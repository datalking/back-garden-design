import { once } from './util';

/**
 * 获取配置的transition动画过渡相关的事件处理函数
 * 只有一个构造函数
 */
class Events {
  // 支持3种事件
  start: any;
  interrupt: any;
  end: any;

  constructor(config) {
    this.start = null;
    this.interrupt = null;
    this.end = null;

    // 从传入的config对象中获取3种事件处理函数并赋值给实例变量
    if (config.events) {
      Object.keys(config.events).forEach(d => {
        if (typeof config.events[d] !== 'function') {
          throw new Error('Event handlers must be a function');
        } else {
          this[d] = once(config.events[d]);
        }
      });
    }
  }
}

export default Events;
