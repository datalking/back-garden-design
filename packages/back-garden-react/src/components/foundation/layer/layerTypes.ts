import { ReactElement } from 'react';

/** unique id for layer */
export type ID = number | string;

/** layer操作相关信息，作为layerFn的参数 */
type LayerHandle = {
  index?: number;
  stack?: ID[];
  isActive?: boolean;
  id?: ID;
  show?: Function;
  hide?: Function;
  update?: Function;
};

/** 输入图层信息作为参数，返回图层内容组件，包括创建图层内容 */
export type LayerFn = (fn: LayerHandle) => ReactElement;

/** layer definition */
export type LayerDefinition = {
  id: ID;
  mountPointId: ID;
  layerFn?: LayerFn;
  args?: any[];
  use?: any[];
  defaultArgs?: any[];
  defaultShow?: boolean;
  groups?: ID[];
};

/** array of layer ID */
export type LayerStack = ID[];

/** including all layer ID and contents */
export type Store = {
  stack: LayerStack;
  layers: {
    [key in ID]: LayerDefinition;
  };
};

export interface LayerStoreCoreI {
  store: Store;
  getLayer: (id: ID) => LayerDefinition;
  getLayersForMountPoint: (mountPointId: ID) => string[];
  getStack: () => ID[];
  register: (
    id: ID,
    fn: LayerFn,
    mountPointId: ID,
    groups?: any[],
    use?: any[],
    defaultArgs?: any[],
    defaultShow?: boolean,
  ) => void;
  unregister: (id: ID) => void;
  updateFn: (
    id: ID,
    fn: LayerFn,
    mountPointId: ID,
    groups?: any[],
    use?: any[],
    defaultArgs?: any[],
    defaultShow?: boolean,
  ) => void;
  show: (id?: ID, args?: any[]) => void;
  hide: (id?: ID) => void;
  getIndex: (id: ID) => number;
  isActive: (id: ID) => boolean;
  update: (id: ID, args: any[]) => void;
  reset: (id: ID) => void;
}

export interface LayerStoreI {
  _core: LayerStoreCoreI;
  _layerSubscriptions: any;
  _mountPointSubscriptions: any;
  subscribeToLayer: (id: ID, fn: Function) => Function;
  subscribeToMountPoint: (id: ID, fn: Function) => Function;
  notifyLayer: (id: ID) => void;
  notifyMountPoint: (id: ID) => void;
  register: (
    id: ID,
    fn: LayerFn,
    mountPointId: ID,
    groups?: any[],
    use?: any[],
    defaultArgs?: any[],
    defaultShow?: boolean,
  ) => void;
  updateFn: (
    id: ID,
    fn: LayerFn,
    mountPointId: ID,
    groups?: any[],
    use?: any[],
    defaultArgs?: any[],
    defaultShow?: boolean,
  ) => void;
  show: (id?: ID, args?: any[]) => void;
  hide: (id?: ID) => void;
  update: (id: ID, args: any[]) => void;
  reset: (id: ID) => void;
  // ======== 下面都是直接引用LayerStoreCore的方法
  getLayer: (id: ID) => LayerDefinition;
  getStack: () => ID[];
  getIndex: (id: ID) => number;
  isActive: (id: ID) => boolean;
  getLayersForMountPoint: (mountPointId: ID) => string[];
}
