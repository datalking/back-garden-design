import React, { SyntheticEvent } from 'react';
import { DraggableCore } from '../draggable';
import { ResizableProps, ResizeHandle, DragCallbackData } from './interfaces';
import './index.css';

/** Resizable组件的state类型 */
interface ResizableState {
  /** 是否正在拖拽缩放 */
  resizing: boolean;
  /** 当前宽度 */
  width: number;
  /** 当前高度 */
  height: number;
  /**  边界外的宽度，默认0 */
  slackW: number;
  /**  边界外的高度，默认0 */
  slackH: number;
}

/**
 * Resizable组件通过cloneElement在children子组件内容的后面添加拖拽把手元素
 */
class Resizable extends React.Component<ResizableProps, ResizableState> {
  /** 默认属性值 */
  static defaultProps = {
    // 默认可以向右下2个方向缩放
    axis: 'both',
    minConstraints: [20, 20],
    maxConstraints: [Infinity, Infinity],
    // 是否锁定宽高比
    lockAspectRatio: false,
    // 默认缩放把手，一个右下角的把手
    resizeHandles: ['se'],
    // 拖拽把手大小，若要修改，同时也要修改css
    handleSize: [20, 20],
  };

  state: ResizableState = {
    resizing: false,
    width: this.props.width,
    height: this.props.height,
    slackW: 0,
    slackH: 0,
  };

  static getDerivedStateFromProps(nextProps, prevState) {
    // 若父组件改变了width/height, 则改变子组件的state
    if (!prevState.resizing && (nextProps.width !== prevState.width || nextProps.height !== prevState.height)) {
      return {
        width: nextProps.width,
        height: nextProps.height,
      };
    }

    return null;
  }

  /** 根据宽高比，计算新宽高 */
  lockAspectRatio(width: number, height: number, aspectRatio: number): [number, number] {
    width = height * aspectRatio;
    height = width / aspectRatio;
    return [width, height];
  }

  /**
   * 将拖拽时的宽高限制在最大值和最小值范围内
   * @param width 当前宽度
   * @param height 当前高度
   */
  runConstraints(width: number, height: number): [number, number] {
    const [min, max] = [this.props.minConstraints, this.props.maxConstraints];

    // 若锁定了宽高比
    if (this.props.lockAspectRatio) {
      // 计算初始宽高比
      const ratio = this.state.width / this.state.height;
      height = width / ratio;
      width = height * ratio;
    }

    // 若min和max都不存在，则直接返回
    if (!min && !max) {
      return [width, height];
    }

    // 记录旧宽高，用于计算步长变化
    const [oldW, oldH] = [width, height];

    // Add slack to the values used to calculate bound position. This will ensure that if
    // we start removing slack, the element won't react to it right away until it's been
    // completely removed.
    let { slackW, slackH } = this.state;
    width += slackW;
    height += slackH;

    // 若最小值存在，则宽/高度取计算值和最小值中较大的
    if (min) {
      width = Math.max(min[0], width);
      height = Math.max(min[1], height);
    }
    // 若最大值存在，则宽/高取计算值和最大值中较小的
    if (max) {
      width = Math.min(max[0], width);
      height = Math.min(max[1], height);
    }

    // If the numbers changed, we must have introduced some slack. Record it for the next iteration.
    // 计算本次宽高改变的步长的增量，并记录下来下次使用，若无max和min，则都应为0
    slackW += oldW - width;
    slackH += oldH - height;
    // window.console.log('==== slackW/H : ', slackW, slackH);

    if (slackW !== this.state.slackW || slackH !== this.state.slackH) {
      this.setState({ slackW, slackH });
    }

    return [width, height];
  }

  /**
   * 根据resize事件处理名称，返回相应的drag事件处理函数
   * 会作为props传递给DraggableCore，可以返回drag start/drag/stop三种拖拽事件的处理函数
   * @param handlerName 把手事件处理名称，三选一，onResize/Start/Stop
   * @param axis 把手类型，八选一，w,e,n,s,nw,ne,sw,se
   */
  resizeHandler = (handlerName: string, axis: ResizeHandle): Function => {
    // 返回一个函数
    return (e: SyntheticEvent, { node, deltaX, deltaY }: DragCallbackData) => {
      // 先检查拖拽方向的限制
      const canDragX = (this.props.axis === 'both' || this.props.axis === 'x') && ['n', 's'].indexOf(axis) === -1;
      const canDragY = (this.props.axis === 'both' || this.props.axis === 'y') && ['e', 'w'].indexOf(axis) === -1;

      // 若拖拽方向是向左或向上，则步长改变量变为负值
      if (canDragX && axis[axis.length - 1] === 'w') {
        deltaX = -deltaX;
      }
      if (canDragY && axis[0] === 'n') {
        deltaY = -deltaY;
      }

      // 根据变化的步长计算新宽高
      let width = this.state.width + (canDragX ? deltaX : 0);
      let height = this.state.height + (canDragY ? deltaY : 0);

      // 若宽高无变化，则直接返回
      const widthChanged = width !== this.state.width;
      const heightChanged = height !== this.state.height;
      if (handlerName === 'onResize' && !widthChanged && !heightChanged) return;

      // 若宽高有变化
      // 先确保宽高不过指定边界
      [width, height] = this.runConstraints(width, height);

      // 创建Resizable的新state
      const newState: any = {};
      // const newState: Partial<ResizableState> = {};

      if (handlerName === 'onResizeStart') {
        // 若是拖拽缩放刚开始

        window.console.log('==== resize start');
        newState.resizing = true;
      } else if (handlerName === 'onResizeStop') {
        // 若是拖拽缩放已停止

        window.console.log('==== resize stop');
        newState.resizing = false;
        newState.slackW = newState.slackH = 0;
      } else {
        // 若是拖拽缩放正在进行

        // 若宽高无变化，则直接返回，否则更新宽高
        if (width === this.state.width && height === this.state.height) return;

        window.console.log('==== resize ing');
        newState.width = width;
        newState.height = height;
      }

      // 若handlerName对应的callback函数由父组件传入了
      const hasCb = typeof this.props[handlerName] === 'function';

      window.console.log('==== hasCb, ', hasCb);

      // 若callback存在，ResizableBox只有onResize存在，onResizeStart/Stop都为undefined
      if (hasCb) {
        // 在react中允许以异步的方式访问事件属性
        if (typeof e.persist === 'function') e.persist();
        // setState完成后，调用相应的resize方法更新父组件div元素的宽高
        this.setState(newState, () => this.props[handlerName](e, { node, size: { width, height }, handle: axis }));
      } else {
        // 若callback不存在，则只更新本组件的宽高

        this.setState(newState);
      }
    };
  };

  /**
   * 渲染拖拽缩放的把手
   * @param resizeHandle 拖拽把手类型，八选一
   */
  renderResizeHandle = (resizeHandle: ResizeHandle) => {
    const { handle } = this.props;
    // 若拖拽把手handle元素存在于props中，但默认不存在
    if (handle) {
      // 若handle是函数，则调用函数获取返回的element作为把手
      if (typeof handle === 'function') {
        return handle(resizeHandle);
      }
      // 若handle不是函数，就返回代表把手的名称
      return handle;
    }

    // 默认执行这里，若handle不存在，就使用右下角把手
    return <span className={`react-resizable-handle react-resizable-handle-${resizeHandle}`} />;
  };

  render() {
    // window.console.log('====props4 Resizbale');
    // window.console.log(this.props);

    // FIXME eslint-no-unused-vars
    // 分离出传到Resizable的props，将剩余props传到DraggableCore
    const {
      children,
      draggableOpts,
      width,
      height,
      handleSize,
      lockAspectRatio,
      axis,
      minConstraints,
      maxConstraints,
      onResize,
      onResizeStop,
      onResizeStart,
      resizeHandles,
      // 剩余的props，会传到children上
      ...restProps
    } = this.props;

    // Resizable组件自身都会带有react-resizable这个类，内容是 position: relative；
    const className = restProps.className ? `${restProps.className} react-resizable` : 'react-resizable';

    // 返回false，children是ResizableBox的div，children.props.children是ResizableBox中内容如h2
    // window.console.log(children === children.props.children);
    // window.console.log(children);
    // window.console.log(children.props.children);

    const newProps = {
      ...restProps,
      className,
      children: [
        children.props.children,
        // 在原有的children后面添加拖拽把手handle元素，resizeHandles默认['se']
        resizeHandles.map(h => (
          <DraggableCore
            {...draggableOpts}
            key={`resizableHandle-${h}`}
            onStart={this.resizeHandler('onResizeStart', h)}
            onDrag={this.resizeHandler('onResize', h)}
            onStop={this.resizeHandler('onResizeStop', h)}
          >
            {/* 下面渲染拖拽把手元素 */}
            {this.renderResizeHandle(h)}
          </DraggableCore>
        )),
      ],
    };

    // 合并style
    if (newProps.style && children.props.style) {
      newProps.style = { ...children.props.style, ...newProps.style };
    }
    // 合并className
    if (newProps.className && children.props.className) {
      newProps.className = `${children.props.className} ${newProps.className}`;
    }

    return React.cloneElement(children, newProps);
  }
}

export default Resizable;
