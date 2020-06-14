import ReactDOM from 'react-dom';
import DraggableCore from './DraggableCore';
import Draggable from './Draggable';
import { MouseTouchEvent, ControlPosition, DraggableData, DraggableBounds } from './interfaces';
import { offsetXYFromParent, getTouch, addClassName, outerHeight, outerWidth, innerHeight, innerWidth } from './domFns';
import { isNum, int } from './util';

/**
 * 获取event对象中包含的位置坐标x,y
 * @param e
 * @param touchIdentifier
 * @param draggableCore
 */
export function getControlPosition(
  e: MouseTouchEvent,
  touchIdentifier: number,
  draggableCore: DraggableCore,
): ControlPosition {
  // 获取相对viewport的位置clientX/Y，非触控时touchIdentifier为undefined
  // window.console.log('====cp', typeof touchIdentifier);
  const touchObj = typeof touchIdentifier === 'number' ? getTouch(e, touchIdentifier) : null;
  // 若获取不到x,y
  if (typeof touchIdentifier === 'number' && !touchObj) return null;
  const node = findDOMNode(draggableCore);
  // 可以使用传入的offsetParent，或者使用默认的offsetParent，会触发reflow，注意性能问题
  const offsetParent = draggableCore.props.offsetParent || node.offsetParent || node.ownerDocument.body;
  // window.console.log(offsetParent);

  // 返回事件位置相对于事件源父元素的偏移量x,y
  return offsetXYFromParent(touchObj || e, offsetParent as HTMLElement);
}

/**
 * 创建当前拖拽位置数据的对象，被DraggableCore使用
 */
// Create an data object exposed by <DraggableCore>'s events
export function createCoreData(draggable: DraggableCore, x: number, y: number): DraggableData {
  const state: any = draggable.state;
  // 判断state中的lastX是否是数值，初始值是NaN
  const isStart = !isNum(state.lastX);
  const node = findDOMNode(draggable);

  if (isStart) {
    // 若lastX不是数值，则是第一次刚开始拖拽，就是用x,y作为上次坐标
    return {
      node,
      deltaX: 0,
      deltaY: 0,
      lastX: x,
      lastY: y,
      x,
      y,
    };
  } else {
    // 非初始拖拽时，使用state中的数据作为上次坐标
    return {
      node,
      deltaX: x - state.lastX,
      deltaY: y - state.lastY,
      lastX: state.lastX,
      lastY: state.lastY,
      x,
      y,
    };
  }
}

/**
 * 创建当前拖拽位置数据的对象，被Draggable使用
 */
// Create an data exposed by <Draggable>'s events
export function createDraggableData(draggable: any, coreData: DraggableData): DraggableData {
  const scale = draggable.props.scale;
  return {
    node: coreData.node,
    x: draggable.state.x + coreData.deltaX / scale,
    y: draggable.state.y + coreData.deltaY / scale,
    deltaX: coreData.deltaX / scale,
    deltaY: coreData.deltaY / scale,
    lastX: draggable.state.x,
    lastY: draggable.state.y,
  };
}

export function addUserSelectStyles(doc?: Document) {
  if (!doc) return;
  let styleEl: any = doc.getElementById('react-draggable-style-el');
  if (!styleEl) {
    styleEl = doc.createElement('style');
    styleEl.type = 'text/css';
    styleEl.id = 'react-draggable-style-el';
    styleEl.innerHTML = '.react-draggable-transparent-selection *::-moz-selection {all: inherit;}\n';
    styleEl.innerHTML += '.react-draggable-transparent-selection *::selection {all: inherit;}\n';
    doc.getElementsByTagName('head')[0].appendChild(styleEl);
  }
  if (doc.body) {
    addClassName(doc.body, 'react-draggable-transparent-selection');
  }
}

export function snapToGrid(grid: [number, number], pendingX: number, pendingY: number): [number, number] {
  const x = Math.round(pendingX / grid[0]) * grid[0];
  const y = Math.round(pendingY / grid[1]) * grid[1];
  return [x, y];
}

/**
 * 计算包含在边界内的位置坐标x,y，被Draggable使用
 */
export function getBoundPosition(draggable: Draggable, x: number, y: number): [number, number] {
  // If no bounds, short-circuit and move on
  if (!draggable.props.bounds) return [x, y];

  // Clone new bounds
  let { bounds } = draggable.props;
  bounds = typeof bounds === 'string' ? bounds : cloneBounds(bounds);
  const node = findDOMNode(draggable);

  if (typeof bounds === 'string') {
    const { ownerDocument } = node;
    const ownerWindow = ownerDocument.defaultView;
    let boundNode;
    if (bounds === 'parent') {
      boundNode = node.parentNode;
    } else {
      boundNode = ownerDocument.querySelector(bounds);
    }
    if (!(boundNode instanceof (ownerWindow as any).HTMLElement)) {
      throw new Error('Bounds selector "' + bounds + '" could not find an element.');
    }
    const nodeStyle = ownerWindow.getComputedStyle(node);
    const boundNodeStyle = ownerWindow.getComputedStyle(boundNode);
    // Compute bounds. This is a pain with padding and offsets but this gets it exactly right.
    bounds = {
      left: -node.offsetLeft + int(boundNodeStyle.paddingLeft) + int(nodeStyle.marginLeft),
      top: -node.offsetTop + int(boundNodeStyle.paddingTop) + int(nodeStyle.marginTop),
      right:
        innerWidth(boundNode) -
        outerWidth(node) -
        node.offsetLeft +
        int(boundNodeStyle.paddingRight) -
        int(nodeStyle.marginRight),
      bottom:
        innerHeight(boundNode) -
        outerHeight(node) -
        node.offsetTop +
        int(boundNodeStyle.paddingBottom) -
        int(nodeStyle.marginBottom),
    };
  }

  // Keep x and y below right and bottom limits...
  if (isNum(bounds.right)) x = Math.min(x, bounds.right);
  if (isNum(bounds.bottom)) y = Math.min(y, bounds.bottom);

  // But above left and top limits.
  if (isNum(bounds.left)) x = Math.max(x, bounds.left);
  if (isNum(bounds.top)) y = Math.max(y, bounds.top);

  return [x, y];
}

export function canDragX(draggable: Draggable): boolean {
  return draggable.props.axis === 'both' || draggable.props.axis === 'x';
}

export function canDragY(draggable: Draggable): boolean {
  return draggable.props.axis === 'both' || draggable.props.axis === 'y';
}

function cloneBounds(bounds: DraggableBounds): DraggableBounds {
  return {
    left: bounds.left,
    top: bounds.top,
    right: bounds.right,
    bottom: bounds.bottom,
  };
}

function findDOMNode(draggable: Draggable | DraggableCore): HTMLElement {
  const node = ReactDOM.findDOMNode(draggable);
  if (!node) {
    throw new Error('<DraggableCore>: Unmounted during event!');
  }
  return node as HTMLElement;
}
