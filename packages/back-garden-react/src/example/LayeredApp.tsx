import React from 'react';
import { LayerStoreI } from '../components/foundation/layer/layerTypes';
import { LayerStore, LayerStackProvider, LayerStackMountPoint } from '../components/foundation/layer';
import ModalDemo from '../components/incubator/Modal/ModalDemo';

interface LayerStackContextState {
  layerStore: LayerStoreI;
  updateLayerStore: Function;
}

export class LayeredApp extends React.Component<{}, LayerStackContextState> {
  // 更新layerStore的方法
  updateLayerStore = newStore => {
    this.setState(state => ({
      ...state,
      layerStore: newStore,
    }));
  };

  state = {
    /** 图层数据的初始值 */
    layerStore: new LayerStore(),
    /** 更新图层数据的方法 */
    updateLayerStore: this.updateLayerStore,
  };

  render() {
    return (
      <LayerStackProvider value={this.state}>
        <div id='mountPointSection'>
          <LayerStackMountPoint
            // 挂载点id
            id='screen'
            elementType='div'
            // layerStackWrapperClass='screen-wrapper'
            // layerWrapperClass='layer-element'
          />
          <h2>LayerApp 2020</h2>
          <div id='modalSection'>
            <ModalDemo />
          </div>
        </div>
      </LayerStackProvider>
    );
  }
}
