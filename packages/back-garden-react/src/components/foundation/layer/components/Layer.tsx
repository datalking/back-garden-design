import React from 'react';
import { isPrimitiveType } from '../common';
import LayerMountPoint from './LayerMountPoint';
import { ID, LayerFn, LayerStoreI } from '../layerType';
import { LayerStackContext } from './LayerStackProvider';

interface LayerProps {
  children: LayerFn;
  id: ID;
  to?: any;
  defaultArgs?: any[];
  defaultShow?: boolean;
  use?: any[];
  elementType?: any;
}
/**
 * 图层组件，注册图层信息到store
 */
class Layer extends React.Component<LayerProps, {}> {
  // 从context中获取图层信息
  static contextType = LayerStackContext;
  context!: React.ContextType<typeof LayerStackContext>;
  static defaultProps = {
    elementType: 'span',
  };
  layerStore: LayerStoreI;

  constructor(props, context) {
    super(props, context);
    this.layerStore = context.layerStore;
  }

  componentWillMount() {
    const { layerStore } = this.context;
    const { id, children, to, use, defaultArgs, defaultShow } = this.props;
    // 注册id图层的定义信息，将children作为Fn
    layerStore.register(id, children, to, null, use, defaultArgs, defaultShow);
  }

  shouldComponentUpdate(newProps) {
    const { children, id, to, use } = this.props;
    const { layerStore }: { layerStore: LayerStoreI } = this.context;
    let needUpdate = false;
    if (id !== newProps.id || to !== newProps.to) {
      needUpdate = true;
    } else if (children.toString() !== newProps.children.toString) {
      needUpdate = true;
    } else if (use) {
      if (use.length !== newProps.use.length) {
        needUpdate = true;
      } else {
        let i = use.length;
        while (i--) {
          if (isPrimitiveType(use[i]) && isPrimitiveType(newProps.use[i])) {
            if (use[i] !== newProps.use[i]) {
              needUpdate = true;
            }
          } else if (typeof use[i].equals === 'function' && typeof newProps.use[i].equals === 'function') {
            needUpdate = true;
          } else if (JSON.stringify(use[i] !== JSON.stringify(newProps.use[i]))) {
            needUpdate = true;
          }
        }
      }
    }

    if (needUpdate) {
      layerStore.updateFn(
        newProps.id,
        newProps.children,
        newProps.to,
        null,
        newProps.use,
        newProps.defaultArgs,
        newProps.defaultShow,
      );
      return true;
    }
    return false;
  }

  componentWillUnmount() {
    this.layerStore = null;
  }

  render() {
    window.console.log('====props4 Layer');
    window.console.log(this.props);

    const { id, to } = this.props;
    window.console.log('====!to', !to);

    if (!to) {
      return <LayerMountPoint id={id} />;
    }
    return null;
  }
}

export default Layer;
