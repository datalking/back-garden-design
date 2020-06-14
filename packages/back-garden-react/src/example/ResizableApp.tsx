import React from 'react';
import { ResizableBox, Resizable } from '../components/foundation/resizable';

export class ResizableApp extends React.Component {
  state = { width: 200, height: 200 };

  // onClick = e => {
  //   this.setState({ width: 200, height: 200 });
  // };

  // onResize = (event, { element, size, handle }) => {
  //   this.setState({ width: size.width, height: size.height });
  // };

  render() {
    const boxStyle = {
      display: 'inline-block',
      background: '#ccc',
      border: '1px solid black',
      textAlign: 'center',
      padding: 10,
      boxSizing: 'border-box',
      marginBottom: 10,
      overflow: 'hidden',
      position: 'relative',
      margin: 20,
    };

    return (
      <div>
        {/* <Resizable
            // 若不传入style，则是透明背景，也能拖拽缩放
            style={boxStyle}
            width={this.state.width}
            height={this.state.height}
            onResize={this.onResize}
            resizeHandles={['sw', 'se', 'nw', 'ne', 'w', 'e', 'n', 's']}
          >
            <div style={{ width: this.state.width, height: this.state.height }}>
              <h2> Resizable组件 内容1</h2>
            </div>
          </Resizable> */}
        {/* <ResizableBox className='box' width={this.state.width} height={this.state.height}> */}
        <ResizableBox className='box' width={200} height={200}>
          {/* <ResizableBox style={boxStyle} width={200} height={200}> */}
          {/* <ResizableBox className='' style={boxStyle} width={200} height={200}> */}
          <h2> ResizableBox组件 内容</h2>
        </ResizableBox>
      </div>
    );
  }
}
