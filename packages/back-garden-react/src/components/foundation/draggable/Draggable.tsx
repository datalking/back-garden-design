import React from 'react';
import ReactDOM from 'react-dom';
import classNames from 'classnames';
import { DraggableProps, ControlPosition } from './interfaces';
import DraggableCore from './DraggableCore';
import { log, warn } from '../../../helper/log';
import { createDraggableData, getBoundPosition, canDragX, canDragY } from './positionFns';
import { createSVGTransform, createCSSTransform } from './domFns';

/** Draggable组件的state类型 */
interface DraggableState {
  /** 是否正在拖拽 */
  dragging: boolean;
  /** 是否已经拖拽过 */
  dragged: boolean;
  /** 当前移动的x */
  x: number;
  /** 当前移动的y */
  y: number;
  /** Used for compensating for out-of-bounds drags，拖拽到边界之外后的x */
  slackX: number;
  /** 拖拽到边界之外后的y */
  slackY: number;
  /** 挂载后是否是svg */
  isElementSVG: boolean;
  /** 上次位置 */
  prevPropsPosition?: ControlPosition;
}

/**
 * 通过cloneElement给代表被拖拽元素的children添加touch和mouse事件
 * Draggable组件自己在state中管理拖拽位置，最后会通过css的transform来改变chilren的位置
 * 简单使用时可不传入onStart/Drag/Stop
 */
class Draggable extends React.Component<DraggableProps, DraggableState> {
  static displayName = 'Draggable';

  /** 默认属性值 */
  static defaultProps = {
    ...DraggableCore.defaultProps,
    axis: 'both',
    bounds: false,
    defaultClassName: 'react-draggable',
    defaultClassNameDragging: 'react-draggable-dragging',
    defaultClassNameDragged: 'react-draggable-dragged',
    defaultPosition: { x: 0, y: 0 },
    position: null,
    scale: 1,
  };

  constructor(props: DraggableProps) {
    super(props);
    this.state = {
      dragging: false,
      dragged: false,
      // x/y优先使用props传入的，若无则使用defaultPosition的值
      x: props.position ? props.position.x : props.defaultPosition.x,
      y: props.position ? props.position.y : props.defaultPosition.y,
      slackX: 0,
      slackY: 0,
      isElementSVG: false,
      prevPropsPosition: { ...props.position },
    };

    // 若传入了position位置坐标，但未传入onDrag或onStop方法，则会发出警告
    if (props.position && !(props.onDrag || props.onStop)) {
      warn('Please attach `onDrag` or `onStop` handlers so you can adjust the `position` of this element.');
    }
  }

  static getDerivedStateFromProps(nextProps: DraggableProps, prevState: DraggableState) {
    const { position } = nextProps;
    const { prevPropsPosition } = prevState;

    // 如果有新的位置坐标，则设置新的x,y
    if (position && (!prevPropsPosition || position.x !== prevPropsPosition.x || position.y !== prevPropsPosition.y)) {
      return {
        x: position.x,
        y: position.y,
        prevPropsPosition: { ...position },
      };
    }
    return null;
  }

  componentDidMount() {
    if (typeof window['SVGElement'] !== 'undefined' && ReactDOM.findDOMNode(this) instanceof window['SVGElement']) {
      this.setState({ isElementSVG: true });
    }
  }

  componentWillUnmount() {
    // 如果拖拽时卸载组件，这里能防止不变 prevents invariant if unmounted while dragging
    this.setState({ dragging: false });
  }

  /**
   * 拖拽开始的事件处理函数，会将dragging设为true
   */
  onDragStart = (e, coreData) => {
    log('Draggable: onDragStart: %j', coreData);
    // Short-circuit if user's callback killed it.
    const shouldStart = this.props.onStart(e, createDraggableData(this, coreData));
    // Kills start event on core as well, so move handlers are never bound.
    if (shouldStart === false) return false;

    this.setState({ dragging: true, dragged: true });
    return true;
  };

  /**
   * 拖拽进行时的事件处理函数，更新位置
   */
  onDrag = (e, coreData) => {
    if (!this.state.dragging) return false;
    log('Draggable: onDrag: %j', coreData);

    const uiData = createDraggableData(this, coreData);

    const newState: any = {
      x: uiData.x,
      y: uiData.y,
    };

    // Keep within bounds.
    if (this.props.bounds) {
      // Save original x and y.
      const { x, y } = newState;

      // Add slack to the values used to calculate bound position. This will ensure that if
      // we start removing slack, the element won't react to it right away until it's been
      // completely removed.
      newState.x += this.state.slackX;
      newState.y += this.state.slackY;

      // Get bound position. This will ceil/floor the x and y within the boundaries.
      const [newStateX, newStateY] = getBoundPosition(this, newState.x, newState.y);
      newState.x = newStateX;
      newState.y = newStateY;

      // Recalculate slack by noting how much was shaved by the boundPosition handler.
      newState.slackX = this.state.slackX + (x - newState.x);
      newState.slackY = this.state.slackY + (y - newState.y);

      // Update the event we fire to reflect what really happened after bounds took effect.
      uiData.x = newState.x;
      uiData.y = newState.y;
      uiData.deltaX = newState.x - this.state.x;
      uiData.deltaY = newState.y - this.state.y;
    }

    // Short-circuit if user's callback killed it.
    const shouldUpdate = this.props.onDrag(e, uiData);
    if (shouldUpdate === false) return false;

    this.setState(newState);
    return true;
  };

  /**
   * 拖拽停止时的事件处理函数，会将dragging设为false
   */
  onDragStop = (e, coreData) => {
    if (!this.state.dragging) return false;

    // Short-circuit if user's callback killed it.
    const shouldStop = this.props.onStop(e, createDraggableData(this, coreData));
    if (shouldStop === false) return false;

    log('Draggable: onDragStop: %j', coreData);

    const newState: any = {
      dragging: false,
      slackX: 0,
      slackY: 0,
    };

    // If this is a controlled component, the result of this operation will be to
    // revert back to the old position. We expect a handler on `onDragStop`, at the least.
    const controlled = Boolean(this.props.position);
    if (controlled) {
      const { x, y } = this.props.position;
      newState.x = x;
      newState.y = y;
    }

    this.setState(newState);
    return true;
  };

  render() {
    window.console.log('====props4 Drag');
    window.console.log(this.props);

    const {
      axis,
      bounds,
      children,
      defaultPosition,
      defaultClassName,
      defaultClassNameDragging,
      defaultClassNameDragged,
      position,
      positionOffset,
      scale,
      ...draggableCoreProps
    } = this.props;

    let style = {};
    let svgTransform = null;

    // If this is controlled, we don't want to move it - unless it's dragging.
    // 若设置了position，则是受控组件，会使用提供的position而忽略内部的position
    const controlled = Boolean(position);
    const draggable = !controlled || this.state.dragging;

    // 若未设置position，则使用defaultPosition { x: 0, y: 0 }
    const validPosition = position || defaultPosition;
    // 获取位置
    const transformOpts = {
      // Set left if horizontal drag is enabled
      x: canDragX(this) && draggable ? this.state.x : validPosition.x,

      // Set top if vertical drag is enabled
      y: canDragY(this) && draggable ? this.state.y : validPosition.y,
    };

    if (this.state.isElementSVG) {
      // 若移动的是svg元素，则使用transform属性
      // If this element was SVG, we use the `transform` attribute.

      svgTransform = createSVGTransform(transformOpts, positionOffset);
    } else {
      // 若移动的不是svg，则使用css的transform属性，一般执行这里，会创建style对象{transform: translate(26px, 13px);}
      // Add a CSS transform to move the element around. This allows us to move the element around
      // without worrying about whether or not it is relatively or absolutely positioned.
      // If the item you are dragging already has a transform set, wrap it in a <span> so <Draggable>
      // has a clean slate.

      style = createCSSTransform(transformOpts, positionOffset);
    }

    // Mark with class while dragging
    const className = classNames((children as any).props.className || '', defaultClassName, {
      [defaultClassNameDragging]: this.state.dragging,
      [defaultClassNameDragged]: this.state.dragged,
    });

    // 在children的外层用DraggableCore包裹，并传入拖拽事件处理回调函数，style会合并
    return (
      <DraggableCore {...draggableCoreProps} onStart={this.onDragStart} onDrag={this.onDrag} onStop={this.onDragStop}>
        {React.cloneElement(React.Children.only(children) as any, {
          className: className,
          style: { ...(children as any).props.style, ...style },
          transform: svgTransform,
        })}
      </DraggableCore>
    );
  }
}

export default Draggable;
