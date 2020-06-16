import React from 'react';
import LayerMountPoint from './LayerMountPoint';
import { LayerStackContext } from './LayerStackProvider';
import { ID, LayerStoreI } from '../layerTypes';

interface LayerStackMountPointProps {
  id: ID;
  /** 默认是span */
  elementType?: string;
  layerStackWrapperClass?: string;
  layerWrapperClass?: string;
}
/**
 * 管理一个挂载点的多个图层，控制一个挂载点的所有图层的渲染，使用了条件渲染。
 * 挂载点的位置可以与layer位置无关，其内容只要isActive为false就是null，
 * 只有active的图层才会被渲染出来添加到DOM
 */
class LayerStackMountPoint extends React.Component<LayerStackMountPointProps, {}> {
  // 从context中获取图层信息
  static contextType = LayerStackContext;
  context!: React.ContextType<typeof LayerStackContext>;

  static defaultProps = {
    elementType: 'span',
    layerStackWrapperClass: '',
    layerWrapperClass: '',
  };

  layerStore: LayerStoreI;
  unsubscribe: Function;

  constructor(props, context) {
    super(props, context);
    this.unsubscribe = context.layerStore.subscribeToMountPoint(props.id, () => {
      this.setState({});
    });
    this.layerStore = context.layerStore;
  }

  componentWillUnmount() {
    this.unsubscribe();
    this.unsubscribe = null;
    this.layerStore = null;
  }

  render() {
    // window.console.log('====props4 LayerStackMountPoint');
    // window.console.log(this.props);

    const { id: mountPointId, elementType, layerStackWrapperClass, layerWrapperClass } = this.props;
    return React.createElement(
      elementType,
      { className: layerStackWrapperClass },
      // children动态生成，先获取挂载点所有图层信息对象，再为各图层分别创建组件
      this.layerStore.getLayersForMountPoint(mountPointId).map(id =>
        React.createElement(
          elementType,
          { key: id, className: layerWrapperClass },
          // 只有当图层id在store.stack中时，才返回内容，否则返回null
          React.createElement(LayerMountPoint, { id }),
        ),
      ),
    );
  }
}

export default LayerStackMountPoint;
