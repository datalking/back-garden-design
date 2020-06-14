import { Store, ID, LayerDefinition, LayerFn, LayerStoreCoreI } from './layerType';

/**
 * 存放核心图层数据，并提供操作方法
 */
class LayerStoreCore implements LayerStoreCoreI {
  /** 存放活跃图层id和所有图层定义信息  */
  store: Store = {
    // 活跃图层id构成的数组
    stack: [],
    // 所有注册过的图层定义信息
    layers: {},
  };

  /** 获取id图层的定义信息 */
  getLayer = (id: ID): LayerDefinition => this.store.layers[id];

  /** 获取mountPointId挂载点下的所有图层定义信息 */
  getLayersForMountPoint = (mountPointId: ID): string[] => {
    const { layers } = this.store;
    return Object.keys(layers).filter(id => layers[id].mountPointId === mountPointId);
  };

  /** 获取所有活跃图层id的构成的数组 */
  getStack = (): ID[] => this.store.stack;

  /** 注册图层相关信息到store */
  register = (
    id: ID,
    layerFn: LayerFn,
    mountPointId: ID = null,
    groups: ID[] = [],
    use: any[],
    defaultArgs: any[] = [],
    defaultShow: boolean,
  ): void => {
    this.store.layers[id] = { id, layerFn, groups, mountPointId, defaultArgs, defaultShow, use };
    // 如果defaultShow为true，则显示该图层
    this.reset(id);
  };

  reset = (id: ID) => {
    const layer = this.store.layers[id];
    layer.args = layer.defaultArgs;
    if (layer.defaultShow) {
      this.show(id);
    }
  };

  /** 删除id图层的定义信息 */
  unregister = (id: ID): void => {
    delete this.store.layers[id];
  };

  /** 显示id图层， 将id加入活跃图层数组，会触发LayerMountPoint组件的条件渲染 */
  show = (id: ID, args?: any[]): void => {
    console.log('调用show传入id是', id);

    const { stack } = this.store;
    this.update(id, args);

    // 如果要显示的id不是最后一个图层，就将id加入图层数组作为最后一个图层
    if (id !== stack[stack.length - 1]) {
      this.hide(id);
      this.store.stack = [...stack, id];
    }
  };

  /** 隐藏id图层，将id从活跃图层数组中删除，会触发LayerMountPoint组件的条件渲染 */
  hide = (id: ID) => {
    console.log('调用hide传入id是', id);

    const stack = [...this.store.stack];

    // 如果要隐藏的id存在，则删除该图层id
    if (stack.indexOf(id) !== -1) {
      stack.splice(stack.indexOf(id), 1);
      this.store.stack = stack;
    }
  };

  /** 获取当前图层id在活跃图层数组中的索引  */
  getIndex = (id: ID): number => this.store.stack.indexOf(id);

  /** 若当前图层id在活跃图层数组中，则为active */
  isActive = (id: ID): boolean => this.store.stack.indexOf(id) !== -1;

  updateFn = (
    id: ID,
    layerFn: LayerFn,
    mountPointId: ID = null,
    groups: ID[] = [],
    use: any[],
    defaultArgs: any[],
    defaultShow: boolean,
  ) => {
    let layer = this.getLayer(id);
    layer = { ...layer, layerFn, use, mountPointId, groups, defaultArgs, defaultShow };
  };

  update = (id: ID, args: any[]) => {
    if (args.length) {
      this.store.layers[id].args = args;
    } else {
      this.store.layers[id].args = this.store.layers[id].defaultArgs;
    }
  };
}

export default LayerStoreCore;
