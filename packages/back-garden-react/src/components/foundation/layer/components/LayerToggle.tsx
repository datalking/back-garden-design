import React from 'react';
import { LayerStoreI } from '../layerTypes';
import { LayerStackContext } from './LayerStackProvider';

interface LayerToggleProps {
  children: any;
  for?: string;
}

/**
 * 控制图层显示和隐藏的组件
 */
class LayerToggle extends React.Component<LayerToggleProps, {}> {
  // 从context中获取图层信息
  static contextType = LayerStackContext;
  context!: React.ContextType<typeof LayerStackContext>;

  layerStore: LayerStoreI;
  unsubscribe: Function;

  constructor(props, context) {
    super(props, context);
    this.unsubscribe = null;
    this.layerStore = context.layerStore;
  }

  componentWillMount() {
    this.unsubscribe = this.layerStore.subscribeToLayer(this.props.for, () => {
      setTimeout(() => this.setState({}), 100);
    });
  }

  componentWillUnmount() {
    this.unsubscribe();
    this.unsubscribe = null;
    this.layerStore = null;
  }

  render() {
    window.console.log('====props4 LayerToggle');
    window.console.log(this.props);

    const { children, ...props } = this.props;
    const { show, hide } = this.layerStore;
    const stack = this.layerStore.getStack();

    window.console.log(this.layerStore);

    return children(
      {
        stack,
        isActive: stack.indexOf(props.for) !== -1,
        // show: (...args) => props.for ? show(props.for, args) : show,
        show: (...args) => show(props.for, args),
        // hide: (...args) => props.for ? hide(props.for) : hide,
        hide: (...args) => hide(props.for),
      },
      ...this.layerStore.getLayer(props.for).args,
    );
  }
}

export default LayerToggle;
