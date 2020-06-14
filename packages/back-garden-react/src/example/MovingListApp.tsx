import React from 'react';
import { NodeGroup } from '../components/foundation/animation';

function updateOrder(arr, beg, end) {
  const copy = arr.slice(0);
  const val = copy[beg];
  copy.splice(beg, 1);
  copy.splice(end, 0, val);
  return copy;
}

function clamp(n, min, max) {
  return Math.max(Math.min(n, max), min);
}

const itemsCount = 6;
const itemHeight = 75; // set list-item height and line-height in css as well
// console.log(range(itemsCount))
const itemsArr = [0, 1, 2, 3, 4, 5];

const listItemStyle = {
  position: 'absolute' as 'absolute',
  backgroundColor: 'beige',
  width: '320px',
  height: '48px',
  overflow: 'visible',
  pointerEvents: 'auto' as 'auto',
  transformOrigin: '50% 50% 0px',
  borderRadius: '4px',
  color: 'rgb(153, 153, 153)',
  lineHeight: '48px',
  paddingLeft: '32px',
  fontSize: '22px',
  boxSizing: 'border-box' as 'border-box',
};

export class MovingListApp extends React.Component {
  state = {
    topDeltaY: 0,
    mouseY: 0,
    isPressed: false,
    lastPressed: 0,
    // order: range(itemsCount)
    order: [...itemsArr],
  };

  handleTouchStart = (pos, pressY, { touches: [{ pageY }] }) => {
    this.setState({
      topDeltaY: pageY - pressY,
      mouseY: pressY,
      isPressed: true,
      lastPressed: pos,
    });

    window.addEventListener('touchmove', this.handleTouchMove);
    window.addEventListener('touchend', this.handleTouchEnd);
  };

  handleTouchMove = e => {
    e.preventDefault();
    this.handleMouseMove(e.touches[0]);
  };

  handleMouseDown = (pos, pressY, { pageY }) => {
    this.setState({
      topDeltaY: pageY - pressY,
      mouseY: pressY,
      isPressed: true,
      lastPressed: pos,
    });

    window.addEventListener('mousemove', this.handleMouseMove);
    window.addEventListener('mouseup', this.handleMouseUp);
  };

  handleMouseMove = ({ pageY }) => {
    const { isPressed, topDeltaY, order, lastPressed } = this.state;

    if (isPressed) {
      const mouseY = pageY - topDeltaY;
      const currentRow = clamp(Math.round(mouseY / itemHeight), 0, itemsCount - 1);
      let newOrder = order;

      if (currentRow !== order.indexOf(lastPressed)) {
        newOrder = updateOrder(order, order.indexOf(lastPressed), currentRow);
      }

      this.setState({ mouseY, order: newOrder });
    }
  };

  handleMouseUp = () => {
    this.setState({ isPressed: false, topDeltaY: 0 });

    window.removeEventListener('mouseup', this.handleMouseUp);
    window.removeEventListener('mousemove', this.handleMouseMove);
  };

  handleTouchEnd = () => {
    this.setState({ isPressed: false, topDeltaY: 0 });

    window.removeEventListener('touchmove', this.handleTouchMove);
    window.removeEventListener('touchend', this.handleTouchEnd);
  };

  render() {
    const { mouseY, isPressed, lastPressed, order } = this.state;

    return (
      // <div className="demo-container">
      <div
        style={{
          position: 'absolute',
          width: '100%',
          height: '100%',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
        }}
      >
        <NodeGroup
          // data={range(itemsCount)}
          data={[...itemsArr]}
          keyAccessor={d => `item-key-${d}`}
          start={d => ({
            scale: 1,
            shadow: 1,
            y: order.indexOf(d) * itemHeight,
          })}
          update={d => {
            const dragging = lastPressed === d && isPressed;

            return {
              scale: [dragging ? 1.1 : 1],
              shadow: [dragging ? 5 : 1],
              y: [order.indexOf(d) * itemHeight],
              // timing: { duration: 350, ease: easeExpOut }
              timing: { duration: 350 },
            };
          }}
        >
          {nodes => (
            // <div className="list">
            <div style={{ width: 320, height: 400 }}>
              {nodes.map(({ key, data, state }) => {
                const { shadow, scale, y } = state;
                const transY = lastPressed === data && isPressed ? mouseY : y;

                return (
                  <div
                    // className="list-item"
                    key={key}
                    onMouseDown={e => this.handleMouseDown(data, y, e)}
                    // onTouchStart={e => this.handleTouchStart(data, y, e)}
                    style={{
                      ...listItemStyle,
                      boxShadow: `rgba(0, 0, 0, 0.4) 0px ${shadow}px ${2 * shadow}px 0px`,
                      transform: `translate3d(0, ${transY}px, 0) scale(${scale})`,
                      WebkitTransform: `translate3d(0, ${transY}px, 0) scale(${scale})`,
                      zIndex: data === lastPressed ? 99 : data,
                    }}
                  >
                    {order.indexOf(data) + 1}
                  </div>
                );
              })}
            </div>
          )}
        </NodeGroup>
      </div>
    );
  }
}
