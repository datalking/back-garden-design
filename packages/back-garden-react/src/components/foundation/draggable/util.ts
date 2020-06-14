export function dontSetMe(props: Record<string, any>, propName: string, componentName: string) {
  if (props[propName]) {
    return new Error(`Invalid prop ${propName} passed to ${componentName} - do not set this, set it on the child.`);
  }
  return new Error('propName should be set to the child');
}

export function findInArray(array: any[] | TouchList, callback: Function): any {
  for (let i = 0, length = array.length; i < length; i++) {
    if (callback.apply(callback, [array[i], i, array])) return array[i];
  }
}

export function isFunction(func: any): boolean {
  return typeof func === 'function' || Object.prototype.toString.call(func) === '[object Function]';
}

export function isNum(num: any): boolean {
  return typeof num === 'number' && !isNaN(num);
}

export function int(a: string): number {
  return parseInt(a, 10);
}
