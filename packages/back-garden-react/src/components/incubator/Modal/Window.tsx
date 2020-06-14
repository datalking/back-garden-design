import React from 'react';
import styled from 'styled-components';

interface WindowProps {
  style?: any;
}

class WindowBase extends React.Component<WindowProps, {}> {
  render() {
    window.console.log('====props4 WindowBase');
    window.console.log(this.props);
    // 不要忘记写 {...this.props}
    return (
      <div {...this.props} id='windowDiv' style={{ ...this.props.style }}>
        {this.props.children}
      </div>
    );
  }
}

const Window = styled(WindowBase)`
  position: absolute;
  /* transform: translateX(0px) translateY(0px); */
  width: 640px;
  height: auto;
  border-radius: 5px;
  box-shadow: 0px 0px 110px 0px rgba(0, 0, 0, 0.6);
  /* padding: 16px; */
`;

export default Window;
