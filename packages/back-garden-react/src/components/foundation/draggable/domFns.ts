import { findInArray, isFunction, int } from './util';
import { MouseTouchEvent, ControlPosition, PositionOffsetControlPosition } from './interfaces';

/**
 *移除DOM元素上的类名
 * @param el  元素
 * @param className 要移除的类名
 */
export function removeClassName(el: HTMLElement, className: string) {
  if (el.classList) {
    el.classList.remove(className);
  } else {
    el.className = el.className.replace(new RegExp(`(?:^|\\s)${className}(?!\\S)`, 'g'), '');
  }
}

export function addClassName(el: HTMLElement, className: string) {
  if (el.classList) {
    el.classList.add(className);
  } else {
    if (!el.className.match(new RegExp(`(?:^|\\s)${className}(?!\\S)`))) {
      el.className += ` ${className}`;
    }
  }
}

let matchesSelectorFunc = '';
export function matchesSelector(el: Node, selector: string): boolean {
  if (!matchesSelectorFunc) {
    matchesSelectorFunc = findInArray(
      ['matches', 'webkitMatchesSelector', 'mozMatchesSelector', 'msMatchesSelector', 'oMatchesSelector'],
      function(method) {
        return isFunction(el[method]);
      },
    );
  }
  // Might not be found entirely (not an Element?) - in that case, bail
  if (!isFunction(el[matchesSelectorFunc])) return false;

  return el[matchesSelectorFunc](selector);
}

/**
 * 给元素el添加事件监听器handler
 * @param el  事件目标，常用的是Element, Document, and Window
 * @param event  事件类型名称，如mousedown,load,submit,copy,paste,keydown
 * @param handler 事件处理函数
 */
export function addEvent(el: Node, event: string, handler: Function): void {
  if (!el) {
    return;
  }
  if (el.addEventListener) {
    el.addEventListener(event, handler as EventListenerOrEventListenerObject, true);
  } else {
    el['on' + event] = handler;
  }
}
/** 移除元素el的事件监听器 */
export function removeEvent(el: Node, event: string, handler: Function): void {
  if (!el) {
    return;
  }

  if (el.removeEventListener) {
    el.removeEventListener(event, handler as EventListenerOrEventListenerObject, true);
  } else {
    el['on' + event] = null;
  }
}

export function removeUserSelectStyles(doc?: Document) {
  if (doc && doc.body) {
    removeClassName(doc.body, 'react-draggable-transparent-selection');
  }
  // $FlowIgnore: IE
  //     if (doc.selection) {
  //       // $FlowIgnore: IE
  //       doc.selection.empty();
  //     } else {
  //       window.getSelection().removeAllRanges(); // remove selection caused by scroll
  //     }
  //   }
}

export function matchesSelectorAndParentsTo(el: Node, selector: string, baseNode: Node): boolean {
  let node = el;
  do {
    if (matchesSelector(node, selector)) {
      return true;
    }
    if (node === baseNode) {
      return false;
    }
    node = node.parentNode;
  } while (node);

  return false;
}

export function getTouchIdentifier(e: MouseTouchEvent): number {
  if (e.targetTouches && e.targetTouches[0]) {
    return e.targetTouches[0].identifier;
  }
  if (e.changedTouches && e.changedTouches[0]) {
    return e.changedTouches[0].identifier;
  }
  return undefined;
}

export function getTouch(e: MouseTouchEvent, identifier: number): { clientX: number; clientY: number } {
  return (
    (e.targetTouches && findInArray(e.targetTouches, t => identifier === t.identifier)) ||
    (e.changedTouches && findInArray(e.changedTouches, t => identifier === t.identifier))
  );
}

/**
 * 获取事件位置距离父元素的偏移量
 * @param evt 事件对象
 * @param offsetParent 拖拽元素的父元素
 */
export function offsetXYFromParent(
  evt: { clientX: number; clientY: number },
  offsetParent: HTMLElement,
): ControlPosition {
  const isBody = offsetParent === offsetParent.ownerDocument.body;
  window.console.log('====isBody', isBody);
  // 获取offsetParent元素相对于viewport的位置
  const offsetParentRect = isBody ? { left: 0, top: 0 } : offsetParent.getBoundingClientRect();

  // 计算鼠标相对于事件源父元素在X方向的距离，即offsetX
  const x = evt.clientX + offsetParent.scrollLeft - offsetParentRect.left;
  const y = evt.clientY + offsetParent.scrollTop - offsetParentRect.top;

  return { x, y };
}

export function styleHacks(childStyle: any): any {
  // Workaround IE pointer events; see #51
  // https://github.com/mzabriskie/react-draggable/issues/51#issuecomment-103488278
  return {
    // Disable browser handling of all panning and zooming gestures.
    touchAction: 'none',
    ...childStyle,
  };
}

export function outerHeight(node: HTMLElement): number {
  // This is deliberately excluding margin for our calculations, since we are using
  // offsetTop which is including margin. See getBoundPosition
  let height = node.clientHeight;
  const computedStyle = node.ownerDocument.defaultView.getComputedStyle(node);
  height += int(computedStyle.borderTopWidth);
  height += int(computedStyle.borderBottomWidth);
  return height;
}

export function outerWidth(node: HTMLElement): number {
  // 这里可以没有包括margin，因为offsetLeft已经包括了margin，参考getBoundPosition
  let width = node.clientWidth;
  const computedStyle = node.ownerDocument.defaultView.getComputedStyle(node);
  width += int(computedStyle.borderLeftWidth);
  width += int(computedStyle.borderRightWidth);
  return width;
}
export function innerHeight(node: HTMLElement): number {
  let height = node.clientHeight;
  const computedStyle = node.ownerDocument.defaultView.getComputedStyle(node);
  height -= int(computedStyle.paddingTop);
  height -= int(computedStyle.paddingBottom);
  return height;
}

export function innerWidth(node: HTMLElement): number {
  let width = node.clientWidth;
  const computedStyle = node.ownerDocument.defaultView.getComputedStyle(node);
  width -= int(computedStyle.paddingLeft);
  width -= int(computedStyle.paddingRight);
  return width;
}

export function createSVGTransform(controlPos: ControlPosition, positionOffset: PositionOffsetControlPosition): string {
  const translation = getTranslation(controlPos, positionOffset, '');
  return translation;
}

/**
 * 生成css transform属性的translate部分
 */
export function getTranslation(
  { x, y }: ControlPosition,
  positionOffset: PositionOffsetControlPosition,
  unitSuffix: string,
): string {
  let translation = `translate(${x}${unitSuffix},${y}${unitSuffix})`;
  if (positionOffset) {
    const defaultX = `${typeof positionOffset.x === 'string' ? positionOffset.x : positionOffset.x + unitSuffix}`;
    const defaultY = `${typeof positionOffset.y === 'string' ? positionOffset.y : positionOffset.y + unitSuffix}`;
    translation = `translate(${defaultX}, ${defaultY})` + translation;
  }
  return translation;
}

/**
 * 创建一个符合css的style对象，用来移动元素到新位置
 * 返回值类似{transform: 'translate(26px, 13px)'}
 */
export function createCSSTransform(
  controlPos: ControlPosition,
  positionOffset: PositionOffsetControlPosition,
): Record<string, any> {
  const translation = getTranslation(controlPos, positionOffset, 'px');
  // return {[browserPrefixToKey('transform', browserPrefix)]: translation };
  return { transform: translation };
}
