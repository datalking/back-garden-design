import React from 'react';
import { ID, LayerStoreI } from '../layerType';
import { LayerStackContext } from './LayerStackProvider';

interface LayerMountPointProps {
  id: ID;
  index?: number;
}

/**
 * 条件渲染图层内容或返回null
 */
class LayerMountPoint extends React.Component<LayerMountPointProps, {}> {
  // 从context中获取图层信息
  static contextType = LayerStackContext;
  context!: React.ContextType<typeof LayerStackContext>;

  static defaultProps = {
    index: 0,
  };
  unsubscribe: Function;
  layerStore: LayerStoreI;

  constructor(props, context) {
    super(props, context);
    this.unsubscribe = null;
    this.layerStore = context.layerStore;
    window.console.log('========= constructor');
    window.console.log(this.layerStore);
  }

  shouldComponentUpdate(props, state) {
    return true;
  }

  componentWillMount() {
    window.console.log('========= LayerMountPoint componentWillMount');

    this.unsubscribe = this.layerStore.subscribeToLayer(this.props.id, () => {
      this.setState({});
    });
  }

  componentWillUnmount() {
    this.unsubscribe();
    this.unsubscribe = null;
    this.layerStore = null;
  }

  render() {
    window.console.log('====props4 LayerMountPoint');
    window.console.log(this.props);

    const { id } = this.props;
    const { show, hide, update, isActive } = this.layerStore;
    const stack = this.layerStore.getStack();
    const layer = this.layerStore.getLayer(id);
    const index = this.layerStore.getIndex(id);

    window.console.log('====LayerMountPoint====', isActive(id));

    // 若id图层在store.stack中，则渲染出内容
    return isActive(id)
      ? layer.layerFn({
          index,
          id,
          stack,
          hide: () => hide(id),
          show: (...args) => show(id, args),
          update: (...args) => update(id, args),
        })
      : null;
  }
}

export default LayerMountPoint;
