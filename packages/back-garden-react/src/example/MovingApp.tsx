import React from 'react';
import { Animate } from '../components/foundation/animation';

export class MovingApp extends React.Component<{}, any> {
  constructor(props) {
    super(props);
    this.state = {
      open: false,
    };
  }

  handleClick = () => {
    this.setState({
      open: !this.state.open,
    });
  };

  render() {
    const trackStyles = {
      position: 'relative' as 'relative',
      // position: 'relative',
      borderRadius: 4,
      backgroundColor: 'rgba(245, 245, 245, 0.7)',
      margin: '5px 3px 10px',
      width: 250,
      height: 50,
    };

    return (
      <div>
        <button onClick={this.handleClick}>Toggle</button>
        <Animate
          start={() => ({
            x: 0,
          })}
          update={() => ({
            x: [this.state.open ? 200 : 0],
            // timing: { duration: 750, ease: easeExpOut },
            timing: { duration: 200 },
          })}
        >
          {state => {
            // console.log('====MovingApp-children-state-param: ', state);

            const { x } = state;
            return (
              // 背景是纯静态css对象
              <div style={trackStyles}>
                <div
                  style={{
                    position: 'absolute',
                    width: 50,
                    height: 50,
                    borderRadius: 4,
                    opacity: 0.7,
                    backgroundColor: 'teal',
                    // transform: `translate3d(${x}px, 0, 0)`,
                    transform: `translate(${x}px, 0)`,
                  }}
                />
              </div>
            );
          }}
        </Animate>
      </div>
    );
  }
}
