/** drag的方向 */
export type Axis = 'both' | 'x' | 'y' | 'none';

/** 拖拽缩放把手的类型，可选8个方向 */
export type ResizeHandle = 's' | 'w' | 'e' | 'n' | 'sw' | 'nw' | 'se' | 'ne';

/** Resizable和ResizableBox组件的propTypes */
export interface ResizableProps {
  // children: ReactElement<any>,
  /** 有且只有一个child */
  children: any;
  /** 初始宽度，必需参数 */
  width: number;
  /** 初始高度，必需参数 */
  height: number;
  // handle: ReactElement<any> | (resizeHandle: ResizeHandle) => ReactElement<any>,
  /** 自定义代表缩放把手的元素，类型是React.Element */
  handle?: any;
  /** 缩放把手的大小，若要修改，同时也要修改css */
  handleSize?: [number, number];
  /** 指定要渲染的缩放把手，默认se，可选8种s,w,e,n,sw,nw,se,ne */
  resizeHandles?: ResizeHandle[];
  /** 是否锁定宽高比 */
  lockAspectRatio?: boolean;
  /** 锁定缩放的方向，可选both,x,y,none */
  axis?: Axis;
  /** 缩放的最小尺寸 */
  minConstraints?: [number, number];
  /** 缩放的最大尺寸 */
  maxConstraints?: [number, number];
  // onResizeStop?: ?(e: SyntheticEvent<>, data: ResizeCallbackData) => any,
  /** 缩放 stop 时的回调函数 */
  onResizeStop?: Function;
  // onResizeStart?: ?(e: SyntheticEvent<>, data: ResizeCallbackData) => any,
  /** 缩放 start 时的回调函数 */
  onResizeStart?: Function;
  // onResize?: ?(e: SyntheticEvent<>, data: ResizeCallbackData) => any,
  /** 缩放 resize 时的回调函数，用来更新宽高 */
  onResize?: Function;
  /** 会被传递到react-draggable的DraggableCore组件的属性 */
  draggableOpts?: any;
  className?: string;
  style?: any;
}

export type DragCallbackData = {
  node: HTMLElement;
  x: number;
  y: number;
  deltaX: number;
  deltaY: number;
  lastX: number;
  lastY: number;
};

export type ResizeCallbackData = {
  node: HTMLElement;
  size: { width: number; height: number };
  handle: ResizeHandle;
};
