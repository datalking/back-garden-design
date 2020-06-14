import React from 'react';
import ReactDOM from 'react-dom';
import styled from 'styled-components';

// const escapeStack = [];
// window.addEventListener(
//   'keydown',
//   e => escapeStack.length && e.keyCode === 27 && escapeStack[escapeStack.length - 1].call(null, e),
//   true,
// );
interface FixedLayerProps {
  zIndex?: number;
  style?: any;
  onClick?: Function;
  onEsc?: any;
}

class FixedLayerBase extends React.Component<FixedLayerProps, {}> {
  static defaultProps = {
    zIndex: 2000,
    onClick: null,
  };

  componentWillMount() {
    if (this.props.onEsc) {
      // escapeStack.push(this.props.onEsc);
    }
  }

  componentWillUnmount() {
    if (this.props.onEsc) {
      // escapeStack.pop();
    }
  }

  onClick = e => this.props.onClick && e.target === ReactDOM.findDOMNode(this) && this.props.onClick();

  render() {
    window.console.log('====props4 FixedLayer');
    window.console.log(this.props);
    const divProps = { ...this.props };
    delete divProps.zIndex;
    delete divProps.onEsc;
    return (
      <div {...divProps} onClick={this.onClick} style={{ ...this.props.style }}>
        {this.props.children}
      </div>
    );
  }
}

const FixedLayer = styled(FixedLayerBase)`
  position: fixed;
  /* pointer-events: auto; */
  top: 0;
  bottom: 0;
  right: 0;
  left: 0;
  height: 100%;
  z-index: ${props => props.zIndex};
  background: rgba(0, 0, 0, 0.1);
`;

export default FixedLayer;
