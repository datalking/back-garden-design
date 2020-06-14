import React, { EventHandler } from 'react';
import ReactDOM from 'react-dom';

import { DraggableCoreProps, MouseTouchEvent } from './interfaces';
import {
  removeEvent,
  removeUserSelectStyles,
  matchesSelectorAndParentsTo,
  getTouchIdentifier,
  addEvent,
  styleHacks,
} from './domFns';
import { getControlPosition, createCoreData, addUserSelectStyles, snapToGrid } from './positionFns';
import { log } from '../../../helper/log';

/** DraggableCore组件的state类型 */
interface DraggableCoreState {
  /** 当前是否处于正在拖拽的状态，默认false */
  dragging: boolean;
  /** 最新x坐标，默认NaN */
  lastX: number;
  /** 最新y坐标，默认NaN */
  lastY: number;
  /** 触摸标识，默认null */
  touchIdentifier?: number;
}

/** 拖拽事件名称 */
const eventsFor = {
  touch: {
    start: 'touchstart',
    move: 'touchmove',
    stop: 'touchend',
  },
  mouse: {
    start: 'mousedown',
    move: 'mousemove',
    stop: 'mouseup',
  },
};

/** 默认使用鼠标事件 */
let dragEventFor = eventsFor.mouse;

/**
 * 通过cloneElement给代表被拖拽元素的children添加mouse和touch事件
 * 使用时要传入自己的onStart/Drag/Stop，DraggableCore组件自己只管理拖拽时所需的最小state
 */
class DraggableCore extends React.Component<DraggableCoreProps, DraggableCoreState> {
  static displayName = 'DraggableCore';

  /** 默认属性值，几个事件处理函数都为空 */
  static defaultProps: DraggableCoreProps = {
    allowAnyClick: false,
    disabled: false,
    enableUserSelectHack: true,
    offsetParent: null,
    grid: null,
    handle: null,
    cancel: null,
    transform: null,
    onStart: function() {},
    onDrag: function() {},
    onStop: function() {},
    onMouseDown: function() {},
  };

  /**
   * 只管理拖拽所需的最少的状态
   */
  state: DraggableCoreState = {
    dragging: false,
    lastX: NaN,
    lastY: NaN,
    touchIdentifier: null,
  };

  componentWillUnmount() {
    // 移除所有余留的事件处理函数，以免部分浏览器在鼠标移动时触发touch事件
    const thisNode = ReactDOM.findDOMNode(this);
    if (thisNode) {
      const { ownerDocument } = thisNode;
      removeEvent(ownerDocument, eventsFor.mouse.move, this.handleDrag);
      removeEvent(ownerDocument, eventsFor.touch.move, this.handleDrag);
      removeEvent(ownerDocument, eventsFor.mouse.stop, this.handleDragStop);
      removeEvent(ownerDocument, eventsFor.touch.stop, this.handleDragStop);
      if (this.props.enableUserSelectHack) {
        removeUserSelectStyles(ownerDocument);
      }
    }
  }

  /**
   * 拖拽即将开始时执行的方法，只会执行一次
   * 会将state中的dragging设为true
   */
  //   handleDragStart: EventHandler<MouseTouchEvent> = (e) => {
  handleDragStart = e => {
    // window.console.log('==== drag start position ');

    // Make it possible to attach event handlers on top of this one.
    // 默认未传入onMouseDown，defaultProps初始值为空方法
    this.props.onMouseDown(e);

    // allowAnyClick默认false，只接受左键单击
    if (!this.props.allowAnyClick && typeof e.button === 'number' && e.button !== 0) return false;

    // 获取被拖拽的Node. Be sure to grab relative document (could be iframed)
    const thisNode = ReactDOM.findDOMNode(this);
    if (!thisNode || !thisNode.ownerDocument || !thisNode.ownerDocument.body) {
      throw new Error('<DraggableCore> not mounted on DragStart!');
    }
    // 获取当前node所属的document
    const { ownerDocument } = thisNode;

    // 若当前元素是不可拖拽的，则直接结束返回false
    // Short circuit if handle or cancel prop was provided and selector doesn't match.
    if (
      this.props.disabled ||
      // !(e.target instanceof ownerDocument.defaultView.Node) ||
      (this.props.handle && !matchesSelectorAndParentsTo(e.target, this.props.handle, thisNode)) ||
      (this.props.cancel && matchesSelectorAndParentsTo(e.target, this.props.cancel, thisNode))
    ) {
      return false;
    }

    // 用来获取多点触控屏幕的触摸点，非触摸场景时返回undefined
    // Set touch identifier in component state if this is a touch event. This allows us to
    // distinguish between individual touches on multitouch screens by identifying which
    // touchpoint was set to this element.
    const touchIdentifier = getTouchIdentifier(e);
    this.setState({ touchIdentifier });

    // 获取当前事件拖拽点的坐标，用来计算拖拽的偏移量
    // Get the current drag point from the event. This is used as the offset.
    const position = getControlPosition(e, touchIdentifier, this);
    // window.console.log('==== drag start getControlPosition ');
    // window.console.log(e);
    // window.console.log(touchIdentifier);
    // window.console.log(this);
    // window.console.log(position);

    // not possible but satisfies flow
    if (position === null) return false;
    const { x, y } = position;

    // 创建一个对象，包含拖拽移动初始时的数据，属性包括node,deltaX/Y,lastX/Y,x/y
    // Create an event object with all the data parents need to make a decision here.
    const coreEvent = createCoreData(this, x, y);
    // window.console.log(coreEvent);

    log('DraggableCore: handleDragStart: %j', coreEvent);

    log('calling', this.props.onStart);
    // Call event handler. If it returns explicit false, cancel.
    // 默认的onStart()为空方法，若无返回值，则shouldUpdate为undefined,undefined===false返回false
    const shouldUpdate = this.props.onStart(e, coreEvent);
    // window.console.log('====shouldUpdate', shouldUpdate);
    // window.console.log(shouldUpdate === false);

    // 若调用传过来的onStart()方法返回false，则取消本次拖拽
    if (shouldUpdate === false) {
      return false;
    }

    // Add a style to the body to disable user-select.
    // This prevents text from being selected all over the page.
    if (this.props.enableUserSelectHack) addUserSelectStyles(ownerDocument);

    // 更改状态为正在拖拽
    // Initiate dragging. Set the current x and y as offsets
    // so we know how much we've moved during the drag. This allows us
    // to drag elements around even if they have been moved, without issue.
    this.setState({
      dragging: true,
      lastX: x,
      lastY: y,
    });

    // window.console.log('==== handleDragStart添加移动事件addEvent到文档之前');

    // 将event直接添加到document以便于当鼠标移动到element外还能够捕获move事件
    addEvent(ownerDocument, dragEventFor.move, this.handleDrag);
    addEvent(ownerDocument, dragEventFor.stop, this.handleDragStop);

    return true;
  };

  /**
   * 拖拽正在发生时执行的方法，会执行多次
   */
  // handleDrag: EventHandler<MouseTouchEvent> = (e) => {
  handleDrag = e => {
    // Prevent scrolling on mobile devices, like ipad/iphone.
    if (e.type === 'touchmove') {
      e.preventDefault();
    }

    // 计算当前事件位置相对于事件源父元素的偏移量x,y
    const position = getControlPosition(e, this.state.touchIdentifier, this);
    if (position === null) return;
    let { x, y } = position;
    window.console.log('===handleDrag position', x, y);

    // grid默认null，若设置了grid，则将新位置转换成网格方向的新坐标
    // Snap to grid if prop has been provided
    if (Array.isArray(this.props.grid)) {
      let deltaX = x - this.state.lastX;
      let deltaY = y - this.state.lastY;
      [deltaX, deltaY] = snapToGrid(this.props.grid, deltaX, deltaY);
      // skip useless drag
      if (!deltaX && !deltaY) return;
      x = this.state.lastX + deltaX;
      y = this.state.lastY + deltaY;
    }

    // 创建代表当前拖拽位置数据的对象，属性包括node,deltaX/Y,lastX/Y,x/y
    const coreEvent = createCoreData(this, x, y);

    log('DraggableCore: handleDrag: %j', coreEvent);

    // Call event handler. If it returns explicit false, trigger end.
    // 默认的onDrag()为空方法，若无返回值，则shouldUpdate为undefined
    // Resizable组件的onDrag方法也无返回值
    const shouldUpdate = this.props.onDrag(e, coreEvent);
    // undefined === false 值为false
    if (shouldUpdate === false) {
      this.handleDragStop(new MouseEvent('mouseup'));
      return;
    }

    this.setState({
      lastX: x,
      lastY: y,
    });
  };

  /**
   * 拖拽结束时执行的方法，只会执行一次
   */
  // handleDragStop: EventHandler<MouseTouchEvent> = (e) => {
  handleDragStop = e => {
    // dragging在handleDragStart中被设置为true，若当前本身没有在dragging，则直接返回
    if (!this.state.dragging) return;

    // 计算当前事件位置相对于事件源父元素的偏移量x,y
    const position = getControlPosition(e, this.state.touchIdentifier, this);
    if (position === null) return;
    const { x, y } = position;

    // 创建代表当前拖拽位置数据的对象，属性包括node,deltaX/Y,lastX/Y,x/y
    const coreEvent = createCoreData(this, x, y);

    const thisNode = ReactDOM.findDOMNode(this);
    if (thisNode) {
      // Remove user-select hack
      if (this.props.enableUserSelectHack) removeUserSelectStyles(thisNode.ownerDocument);
    }

    log('DraggableCore: handleDragStop: %j', coreEvent);

    // Reset the el.
    this.setState({
      dragging: false,
      lastX: NaN,
      lastY: NaN,
    });

    // 调用父组件传入的拖拽停止时的回调函数
    this.props.onStop(e, coreEvent);

    if (thisNode) {
      // Remove event handlers
      log('DraggableCore: Removing handlers');
      removeEvent(thisNode.ownerDocument, dragEventFor.move, this.handleDrag);
      removeEvent(thisNode.ownerDocument, dragEventFor.stop, this.handleDragStop);
    }
  };

  // onMouseDown: EventHandler<MouseTouchEvent> = (e) => {
  onMouseDown = e => {
    // on touchscreen laptops we could switch back to mouse
    dragEventFor = eventsFor.mouse;

    // window.console.log('先触发事件onMouseDown，只触发一次');
    return this.handleDragStart(e);
  };

  // onMouseUp: EventHandler<MouseTouchEvent> = (e) => {
  onMouseUp = e => {
    dragEventFor = eventsFor.mouse;

    return this.handleDragStop(e);
  };

  // 功能和 onMouseDown 一样，但针对触摸屏
  // onTouchStart: EventHandler<MouseTouchEvent> = (e) => {
  onTouchStart = e => {
    // We're on a touch device now, so change the event handlers
    dragEventFor = eventsFor.touch;

    return this.handleDragStart(e);
  };

  // onTouchEnd: EventHandler<MouseTouchEvent> = (e) => {
  onTouchEnd = e => {
    // We're on a touch device now, so change the event handlers
    dragEventFor = eventsFor.touch;

    return this.handleDragStop(e);
  };

  render() {
    window.console.log('====props4 DragCore');
    window.console.log(this.props);

    // 通过cloneElement给children添加react的mouse和touch事件监听器，当在children上操作时会触发
    return React.cloneElement(React.Children.only(this.props.children) as any, {
      style: styleHacks((this.props.children as any).props.style),
      // 注意：mouseMove()处理器添加在document上，当用户快速拖动到离开元素边界时，它仍会起作用
      onMouseDown: this.onMouseDown,
      onTouchStart: this.onTouchStart,
      onMouseUp: this.onMouseUp,
      onTouchEnd: this.onTouchEnd,
    });
  }
}

export default DraggableCore;
