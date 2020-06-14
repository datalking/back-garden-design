import React from 'react';
import { dontSetMe } from './util';

/** 自己管理位置state的拖拽组件的Props类型 */
export interface DraggableProps extends DraggableCoreProps {
  /** 指定可拖拽的方向，both包括x和y，x只水平，y只竖直，none禁止拖拽 */
  axis?: 'both' | 'x' | 'y' | 'none';
  /** 指定可拖拽的范围，值parent限制在父节点范围内，也可传入一个范围对象，单位px */
  bounds?: DraggableBounds | string | false;
  /** 拖拽ui类名，默认react-draggable */
  defaultClassName?: string;
  /** 正在拖拽ui类名，默认react-draggable-dragging */
  defaultClassNameDragging?: string;
  /** 拖拽后的类名，默认react-draggable-dragged */
  defaultClassNameDragged?: string;
  /** 指定开始拖拽的位置坐标x,y */
  defaultPosition?: ControlPosition;
  /** 相对起始位置的偏移量 */
  positionOffset?: PositionOffsetControlPosition;
  /** 指定元素当前的位置，若不指定，则作为非受控组件，position和defaultPosition关系参考react的form */
  position?: ControlPosition;
  /** 指定拖拽元素的缩放比例，默认1.0 */
  scale?: number;
}

/** 表示拖拽范围4个边界的类型 */
export interface DraggableBounds {
  top: number;
  right: number;
  bottom: number;
  left: number;
}

/** 拖拽事件类型 */
export type DraggableEvent =
  | React.MouseEvent<HTMLElement | SVGElement>
  | React.TouchEvent<HTMLElement | SVGElement>
  | MouseEvent
  | TouchEvent;

/** 拖拽事件处理函数的类型 */
export type DraggableEventHandler = (e: DraggableEvent, data: DraggableData) => void | boolean;

/** 普通事件处理函数的类型 */
export type EventHandler<T> = (e: T) => void | false;

// Missing targetTouches，FIXME 注意Firefox浏览器会异常，TouchEvent is not defined
export class TouchEvent2 {
  // export class TouchEvent2 extends TouchEvent {
  // export class TouchEvent2 extends (window as any).TouchEvent {
  changedTouches: TouchList;
  targetTouches: TouchList;
}

export type MouseTouchEvent = MouseEvent & TouchEvent2;

/** 拖拽位置数据记录 */
export interface DraggableData {
  node: HTMLElement;
  x: number;
  y: number;
  deltaX: number;
  deltaY: number;
  lastX: number;
  lastY: number;
}

/** 位置坐标 */
export type ControlPosition = { x: number; y: number };

/** 位置偏移量 */
export type PositionOffsetControlPosition = { x: number | string; y: number | string };

/** 自己不管理位置state的拖拽组件的Props类型 */
export interface DraggableCoreProps {
  /** 默认false，只允许鼠标左键拖拽，true可使用任意鼠标键拖拽 */
  allowAnyClick?: boolean;
  /** 若为true，则不可拖拽，此时还能触发的方法只有onMouseDown */
  disabled?: boolean;
  /** 默认true，会添加user-select:none到body来防止拖拽时错误地选择了文本 */
  enableUserSelectHack?: boolean;
  /** 若设置了，则使用传入的DOM Node来计算拖拽偏移量 */
  offsetParent?: HTMLElement;
  /** 指定拖拽移动的x和y范围 */
  grid?: [number, number];
  /** 指定触发开始拖拽的选择器 */
  handle?: string;
  /** 指定取消拖拽的选择器 */
  cancel?: string;
  /** 拖拽 start 时的事件处理函数，若返回false，则取消本次拖拽 */
  onStart?: DraggableEventHandler;
  /** 拖拽 move 时的事件处理函数，若返回false，则取消本次拖拽 */
  onDrag?: DraggableEventHandler;
  /** 拖拽 stop 时的事件处理函数，若返回false，则拖拽保持active状态 */
  onStop?: DraggableEventHandler;
  /** 若要处理onMouseDown就使用这个属性，组件内部还有一个onMouseDown(不能直接用) */
  onMouseDown?: (e: MouseEvent) => void;
  /** 这些属性应该定义在子组件:className,style,transform  */
  className?: typeof dontSetMe;
  style?: typeof dontSetMe;
  transform?: typeof dontSetMe;
}

// export class DraggableCore extends React.Component<Partial<DraggableCoreProps>, {}> {
//   static defaultProps: DraggableCoreProps;
// }

// export default class Draggable extends React.Component<Partial<DraggableProps>, {}> {
//   static defaultProps: DraggableProps;
// }
