import LayerStoreCore from './LayerStoreCore';
import { ID, LayerFn, LayerStoreCoreI, LayerStoreI } from './layerTypes';

/**
 *  操作LayerStoreCore中的图层信息数据，并渲染到DOM
 */
class LayerStore implements LayerStoreI {
  /** 图层核心数据的引用 */
  _core: LayerStoreCoreI = new LayerStoreCore();
  /** 存放图层id与fn */
  _layerSubscriptions = {};
  /** 存放挂载点id与fn */
  _mountPointSubscriptions = {};

  getLayer = this._core.getLayer;
  getStack = this._core.getStack;
  getIndex = this._core.getIndex;
  isActive = this._core.isActive;
  getLayersForMountPoint = this._core.getLayersForMountPoint;

  subscribeToLayer = (id: ID, fn: Function): Function => {
    // console.log('==== subscribeToLayer', id);

    if (typeof this._layerSubscriptions[id] === 'undefined') {
      this._layerSubscriptions[id] = new Set();
    }
    this._layerSubscriptions[id].add(fn);
    // 返回一个可以删除图层的方法
    return () => this._layerSubscriptions[id].delete(fn);
  };

  subscribeToMountPoint = (id: ID, fn: Function): Function => {
    // console.log('==== subscribeToMountPoint', id);

    if (typeof this._mountPointSubscriptions[id] === 'undefined') {
      this._mountPointSubscriptions[id] = new Set();
    }
    this._mountPointSubscriptions[id].add(fn);
    // 返回一个可以删除图层的方法
    return () => this._mountPointSubscriptions[id].delete(fn);
  };

  /** 执行id图层的fn函数，渲染出图层内容 */
  notifyLayer = (id: ID): void => {
    // console.log('==== notifyLayer', id);

    if (this._layerSubscriptions[id]) {
      this._layerSubscriptions[id].forEach(fn => fn());
    }
  };

  /** 执行id挂载点下所有图层的fn，渲染该挂载点下所有图层的内容 */
  notifyMountPoint = (id: ID): void => {
    // console.log('==== notifyMountPoint', id);

    if (this._mountPointSubscriptions[id]) {
      this._mountPointSubscriptions[id].forEach(fn => fn());
    }
  };

  register = (
    id: ID,
    layerFn: LayerFn,
    mountPointId: ID = null,
    groups: ID[] = [],
    use: any[],
    defaultArgs: any[],
    defaultShow: boolean,
  ): void => {
    this._core.register(id, layerFn, mountPointId, groups, use, defaultArgs, defaultShow);
    if (mountPointId) {
      this.notifyMountPoint(mountPointId);
    } else {
      this.notifyLayer(id);
    }
  };

  updateFn = (
    id: ID,
    layerFn: LayerFn,
    mountPointId: ID = null,
    groups: ID[] = [],
    use: any[],
    defaultArgs: any[],
    defaultShow: boolean,
  ): void => {
    const lastMountPoint = this.getLayer(id).mountPointId;
    this._core.updateFn(id, layerFn, mountPointId, groups, use, defaultArgs, defaultShow);
    if (lastMountPoint !== mountPointId) {
      this.notifyMountPoint(lastMountPoint);
      this.notifyMountPoint(mountPointId);
    } else {
      this.notifyLayer(id);
    }
  };

  update = (id: ID, args: any[]): void => {
    this._core.update(id, args);
    this.notifyLayer(id);
  };

  reset = (id: ID): void => {
    this._core.reset(id);
    this.notifyLayer(id);
  };

  unregister = (id: ID): void => {
    this._core.unregister(id);
  };

  show = (id?: ID, args?: any[]): void => {
    this._core.show(id, args);
    this.notifyLayer(id);
  };

  hide = (id?: ID): void => {
    // const stack = this.getStack();
    this._core.hide(id);
    this.notifyLayer(id);
  };
}

export default LayerStore;
