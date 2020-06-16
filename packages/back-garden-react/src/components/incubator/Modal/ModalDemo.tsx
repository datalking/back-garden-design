import React from 'react';
import { LayerToggle, Layer } from '../../foundation/layer';
import FixedLayer from './FixedLayer';
import Window from './Window';

const styles = {
  header: {
    height: '36px',
    background: '#F6F6F6',
    borderRadius: '5px 5px 0 0',
    borderWidth: '1px',
    padding: '20px 20px 0 20px',
  },
  body: {
    height: 'auto',
    minHeight: '450px',
    background: '#FFFFFF',
    borderRadius: '0 0 5px 5px',
    padding: '20px',
  },
  footer: {
    height: '34px',
    background: '#F6F6F6',
    borderRadius: '0 0 5px 5px',
    padding: '20px 0 20px 0',
  },
};

class ModalDemo extends React.Component {
  render() {
    // window.console.log('====props4 ModalDemo');
    // window.console.log(this.props);

    return (
      <div>
        <Layer id='simple_modal_layerId' to='screen'>
          {({ index, hide, show }) => (
            <FixedLayer style={{ background: 'rgba(0,0,0,0.1)' }} onEsc={hide} onClick={hide} zIndex={index * 100}>
              <Window>
                <div style={styles.header}>Modal 标题</div>
                <div style={styles.body} />
              </Window>
            </FixedLayer>
          )}
        </Layer>

        <div>
          <h4>SIMPLE MODAL</h4>
          <LayerToggle for='simple_modal_layerId'>
            {({ show }) => <button onClick={() => show()}>打开 SIMPLE MODAL</button>}
          </LayerToggle>
        </div>
      </div>
    );
  }
}

export default ModalDemo;
