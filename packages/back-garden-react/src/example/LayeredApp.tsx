import React from 'react';
import { LayerStoreI } from '../components/foundation/layer/layerType';
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
    layerStore: new LayerStore(),
    updateLayerStore: this.updateLayerStore,
  };

  render() {
    return (
      <LayerStackProvider value={this.state}>
        <div id='MountPlaceIndicator'>
          <LayerStackMountPoint
            id='screen' // 挂载点id
            elementType='div'
            layerStackWrapperClass='screen-wrapper'
            layerWrapperClass='layer-element'
          />
          <h2>layer DEMO2019</h2>
          <div>
            <ModalDemo />
          </div>
        </div>
      </LayerStackProvider>
    );
  }
}
