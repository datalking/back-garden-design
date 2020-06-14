import React from 'react';
import { LayerStoreI } from '../layerType';
import LayerStore from '../LayerStore';

type LayerStackProviderProps = {
  layerStore: LayerStoreI;
  updateLayerStore: Function;
};

const defaultLayerStackContext: LayerStackProviderProps = {
  layerStore: new LayerStore(),
  updateLayerStore: () => {},
};

const LayerStackContext = React.createContext<LayerStackProviderProps>(defaultLayerStackContext);

const { Provider: LayerStackProvider, Consumer: LayerStackConsumer } = LayerStackContext;

export { LayerStackContext, LayerStackProvider, LayerStackConsumer };
export default LayerStackProvider;
