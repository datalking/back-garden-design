import React, { SyntheticEvent } from 'react';
import Resizable from './Resizable';
import { ResizableProps, ResizeCallbackData } from './interfaces';

/** ResizableBox组件的state类型 */
interface ResizableBoxState {
  /** div当前宽度 */
  width: number;
  /** div当前高度 */
  height: number;
}

/**
 * 会在children子组件后面添加一个拖拽把手
 * 外层是Resizable组件，内层是带宽高的div，children内容会显示在div中，拖拽改变的就是div的宽高
 */
class ResizableBox extends React.Component<ResizableProps, ResizableBoxState> {
  /** 默认属性值，包含拖拽把手大小，若要修改，同时也要修改css  */
  static defaultProps = {
    handleSize: [20, 20],
  };

  /** 默认state，存放div当前宽度和高度，初始值由父组件指定 */
  state: ResizableBoxState = {
    width: this.props.width,
    height: this.props.height,
  };

  /**
   * 根据拖拽缩放后的鼠标位置更新state，即更新div元素的宽高，作为回调函数传递给子组件
   */
  onResize = (e: SyntheticEvent, data: ResizeCallbackData): void => {
    const { size } = data;

    // 若父组件传过来了onResize属性，默认不传递
    if (this.props.onResize) {
      e.persist && e.persist();
      // 在state更新完成后调用父组件传过来的onResize()方法
      this.setState(size, () => this.props.onResize && this.props.onResize(e, data));
    } else {
      this.setState(size);
    }
  };

  render() {
    // window.console.log('====props4 ResizbaleBox');
    // window.console.log(this.props);
    // window.console.log(this.state);

    const {
      width,
      height,
      handle,
      handleSize,
      onResize,
      onResizeStart,
      onResizeStop,
      draggableOpts,
      minConstraints,
      maxConstraints,
      lockAspectRatio,
      axis,
      resizeHandles,
      // 剩余的属性都会传到div
      ...restProps
    } = this.props;
    // restProps中会有children
    // window.console.log(restProps);

    // 对Resizble进行了封装，若直接使用Resizable，需要自己更新子组件的宽高
    return (
      <Resizable
        width={this.state.width}
        height={this.state.height}
        handle={handle}
        handleSize={handleSize}
        onResize={this.onResize}
        onResizeStart={onResizeStart}
        onResizeStop={onResizeStop}
        draggableOpts={draggableOpts}
        minConstraints={minConstraints}
        maxConstraints={maxConstraints}
        lockAspectRatio={lockAspectRatio}
        axis={axis}
        resizeHandles={resizeHandles}
      >
        {/* 这里div内虽然无内容，但children内容包含在restProps中，最终会显示在div中 */}
        {/* <div id='box' style={{ width: this.state.width, height: this.state.height }} {...restProps}></div> */}
        <div style={{ width: this.state.width, height: this.state.height }} {...restProps}></div>
      </Resizable>
    );
  }
}

export default ResizableBox;
