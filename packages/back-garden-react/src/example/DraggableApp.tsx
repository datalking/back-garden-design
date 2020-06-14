import React from 'react';
import { Draggable } from '../components/foundation/draggable';

interface DraggableAppState {
  disableDrag: boolean;
  activeDrags: number;
  deltaPosition: any;
  controlledPosition: any;
}

export class DraggableApp extends React.Component<{}, DraggableAppState> {
  state = {
    disableDrag: false,
    activeDrags: 0,
    deltaPosition: {
      x: 0,
      y: 0,
    },
    controlledPosition: {
      x: -400,
      y: 200,
    },
  };

  toggleDraggable = () => {
    this.setState({
      disableDrag: !this.state.disableDrag,
    });
  };

  handleDrag = (e, ui) => {
    const { x, y } = this.state.deltaPosition;
    this.setState({
      deltaPosition: {
        x: x + ui.deltaX,
        y: y + ui.deltaY,
      },
    });
  };

  onStart = () => {
    this.setState({ activeDrags: this.state.activeDrags + 1 });
  };

  onStop = () => {
    this.setState({ activeDrags: this.state.activeDrags - 1 });
  };

  render() {
    const { disableDrag } = this.state;
    return (
      <div
        style={{
          width: 640,
          height: 480,
          backgroundColor: '#fafafa',
        }}
      >
        {/* <Draggable disabled={disableDrag} bounds='parent' onStart={this.onStart} onStop={this.onStop}> */}
        <Draggable disabled={disableDrag} bounds='parent'>
          <div
            style={{
              width: 180,
              backgroundColor: '#fff',
              border: '1px solid #999',
              borderRadius: '3px',
              height: 180,
              margin: 10,
              padding: 10,
            }}
          >
            <h2 style={{ cursor: disableDrag ? 'wait' : 'grab' }}>{disableDrag ? 'Non-draggable' : 'Drag Me'}</h2>
            <div>
              <input disabled={disableDrag} />
              <input type='checkbox' disabled={disableDrag} />
            </div>
            <button onClick={this.toggleDraggable}>{disableDrag ? 'Enable' : 'Disable'} Drag</button>
          </div>
        </Draggable>
      </div>
    );
  }
}
