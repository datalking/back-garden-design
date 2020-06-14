/**
 * animation默认使用的数值型插值函数，返回一个可计算中间态值的函数
 * @param beg 初始值
 * @param end 终点值
 */
export function numeric(beg, end) {
  const a = Number(beg);
  const b = Number(end) - a;

  // 返回一个函数，输入百分比，返回在起止区间中线性位置的值
  return function(t) {
    return a + b * t;
  };
}

/** transition id初始值 */
let transitionId = 0;

/** 生成一个transition id，返回值从1开始 */
export function getTransitionId() {
  return ++transitionId;
}

/** 给obj对象添加或覆盖来自props对象的属性 */
export function extend(obj, props) {
  // eslint-disable-next-line guard-for-in
  for (const i in props) {
    obj[i] = props[i];
  }
}

/** 只执行一次传入的func函数 */
export function once(func) {
  let called = false;

  //   return function transitionEvent() {
  return function transitionEvent(this: any) {
    if (!called) {
      called = true;
      // eslint-disable-next-line babel/no-invalid-this
      func.call(this);
    }
  };
}

/** 若属性值是对象且不是数组，则视为是使用了命名空间的属性 */
export function isNamespace(prop) {
  return typeof prop === 'object' && Array.isArray(prop) === false;
}

/** 线性缓动函数 */
const linear = t => {
  return Number(t);
};

/** 动画timing属性的默认值 */
export const timingDefaults = {
  duration: 250,
  delay: 0,
  ease: linear,
};
