import { now, timer, timeout } from '../../../helper/d3-timer';
import { timingDefaults, extend, getTransitionId, isNamespace } from './util';
import Events from './Events';

/**
 * 即将执行动画的节点的基类，抽象类
 */
abstract class BaseNode {
  /** 存放动画中间状态数据 */
  state: any;
  /** 存放执行transition所需的数据{tId,tData} */
  transitionData: any;

  constructor(state) {
    this.state = state || {};
  }

  /** 由子类实现插值函数 */
  abstract getInterpolator(begValue: any, endValue: any, attr: any, nameSpace: any): Function;

  /** 给this.state对象添加或覆盖来自update对象的属性 */
  setState(update) {
    if (typeof update === 'function') {
      extend(this.state, update(this.state));
    } else {
      extend(this.state, update);
    }
  }

  /**
   * 执行3种动画的入口
   * 解析动画配置中的events和timing，最后执行this.update()方法
   * @param config 动画配置对象
   */
  transition(config) {
    // console.log('==== transition()-config-param');
    // console.log(config);
    // TODO config为undefined时，直接return

    // 若config是数组，则遍历各配置分别执行
    if (Array.isArray(config)) {
      for (const item of config) {
        this.parse(item);
      }
    } else {
      // 若config不存在或只是一个对象
      this.parse(config);
    }
  }

  /** 若transitionData非空，则表示正在执行transition */
  isTransitioning() {
    return !!this.transitionData;
  }

  /** 停止执行transition */
  stopTransitions() {
    const transitions = this.transitionData;

    if (transitions) {
      Object.keys(transitions).forEach(t => {
        transitions[t].timer.stop();
      });
    }
  }

  /** 从一个config配置对象中解析出events、timing和自定义tween函数，最后调用update() */
  parse(config) {
    // 若config为undefined，则clone为{}
    const clone = { ...config };

    const events = new Events(clone);
    if (clone.events) {
      delete clone.events;
    }

    const timing = {
      // 这里设置了默认duration,delay,ease
      ...timingDefaults,
      ...(clone.timing || {}),
      time: now(),
    };
    if (clone.timing) {
      delete clone.timing;
    }
    // console.log('parse()-clone, ', clone);

    // 遍历clone剩下的属性，包括需要transition的样式或属性名，如opacity、xy
    Object.keys(clone).forEach(stateKey => {
      // 存放补间动画函数的数组
      const tweens = [];
      // 当前需要执行transition的变量的值，如[200]
      const next = clone[stateKey];
      // console.log('current-next,', next);

      // 若next属性是命名空间，则进一步找到需要执行动画的属性
      if (isNamespace(next)) {
        Object.keys(next).forEach(attr => {
          // 获取当前属性值
          const val = next[attr];

          // 若当前属性值是数组
          if (Array.isArray(val)) {
            if (val.length === 1) {
              tweens.push(this.getTween(attr, val[0], stateKey));
            } else {
              this.setState(state => {
                return { [stateKey]: { ...state[stateKey], [attr]: val[0] } };
              });

              tweens.push(this.getTween(attr, val[1], stateKey));
            }
          } else if (typeof val === 'function') {
            // 若当前属性值是函数

            const getNameSpacedCustomTween = () => {
              const kapellmeisterNamespacedTween = t => {
                this.setState(state => {
                  return { [stateKey]: { ...state[stateKey], [attr]: val(t) } };
                });
              };

              return kapellmeisterNamespacedTween;
            };

            tweens.push(getNameSpacedCustomTween);
          } else {
            // 若当前属性值是既不是数组，也不是函数

            this.setState(state => {
              return { [stateKey]: { ...state[stateKey], [attr]: val } };
            });

            tweens.push(this.getTween(attr, val, stateKey));
          }
        });
      } else {
        // 若next属性不是命名空间，而是待执行动画的属性

        if (Array.isArray(next)) {
          // console.log('next is array');
          if (next.length === 1) {
            // 属性执行动画后的终点值在这里指定
            const tweenFunc = this.getTween(stateKey, next[0], null);
            tweens.push(tweenFunc);
          } else {
            this.setState({ [stateKey]: next[0] });
            tweens.push(this.getTween(stateKey, next[1], null));
          }
        } else if (typeof next === 'function') {
          // console.log('next is function');

          const getCustomTween = () => {
            const kapellmeisterTween = t => {
              this.setState({ [stateKey]: next(t) });
            };

            return kapellmeisterTween;
          };

          tweens.push(getCustomTween);
        } else {
          // console.log('next is not array & function');

          this.setState({ [stateKey]: next });
          tweens.push(this.getTween(stateKey, next, null));
        }
      }

      // 每处理完一个属性，就更新transition相关数据
      this.update({ stateKey, timing, tweens, events, status: 0 });
    });
  }

  /**
   * 返回一个可以计算并更新动画中间状态数据的函数
   * @param attr 需要插值的属性名
   * @param endValue  该属性的终点值
   * @param nameSpace 该属性所在的命名空间
   */
  getTween(attr, endValue, nameSpace) {
    return () => {
      const begValue = nameSpace ? this.state[nameSpace][attr] : this.state[attr];
      // console.log('getTween-beginValue, ', begValue);
      // console.log('getTween-endValue, ', endValue);

      if (begValue === endValue) {
        return null;
      }

      const i = this.getInterpolator(begValue, endValue, attr, nameSpace);
      // console.log('i, ', i);

      // 用来更新动画中间状态数据的函数
      let stateTween;

      if (nameSpace === null) {
        stateTween = t => {
          // 更新属性值为插值函数计算出的中间值
          this.setState({ [attr]: i(t) });
        };
      } else {
        stateTween = t => {
          this.setState(state => {
            return { [nameSpace]: { ...state[nameSpace], [attr]: i(t) } };
          });
        };
      }

      return stateTween;
    };
  }

  /**
   * 更新一个属性的transition相关的数据。
   * transition存放一个属性动画相关数据的对象，属性包括stateKey,timing,events,tweens，status。
   * status-0表示动画未开始，是默认初始值；
   * status-1表示即将调用init()中的start方法来开始动画；
   * status-2表示即将调用events对象的start方法；
   * status-3表示即将获取补间插值函数；
   * status-4表示即将调用tick方法；
   * status-5表示即将调用init()中的stop方法和events对象的end方法；
   * status-6表示即将调用timer的stop方法，之后会删除tid对应的动画数据
   * @param transition 存放一个属性动画相关的数据
   */
  update(transition) {
    // console.log('this.update()-this.transitionData, ', this.transitionData);

    // 若transitionData不存在，则赋值为空属性对象
    if (!this.transitionData) {
      this.transitionData = {};
    }
    // 若transition存在，则分配一个transition id，默认从1开始
    this.init(getTransitionId(), transition);
  }

  /**
   * 实际执行动画的方法
   * @param id 标识transition的id，从1开始
   * @param transition 动画相关数据，属性包括stateKey,timing,events,tweens，status
   */
  init(id, transition) {
    // console.log('init()-param-transition, ', JSON.stringify(transition));
    // 已有补间函数个数
    const n = transition.tweens.length;
    // console.log('transition.tweens.length, ', n);
    // 创建一个数组，用来存放获取动画中间态数据的函数
    const tweens = new Array(n);

    // queue()，将start方法加入任务队列
    const queue = elapsed => {
      // console.log('====BaseNode-init()-queue');

      transition.status = 1;
      // 将start()加入执行队列
      transition.timer.restart(start, transition.timing.delay, transition.timing.time);

      // 若表面经过时间大于动画延迟时间，则直接调用start开始执行动画
      if (transition.timing.delay <= elapsed) {
        start(elapsed - transition.timing.delay);
      }
    };

    // 将transition的id和对应数据保存到对象transitionData
    this.transitionData[id] = transition;
    // 创建一个执行队列函数的定时器并立即执行queue
    transition.timer = timer(queue, 0, transition.timing.time);
    // console.log('init()-transition-timer, ', JSON.stringify(transition));
    // console.log('this.transitionData, ', JSON.stringify(this.transitionData));

    // start()，会将tick()加入任务队列
    const start = elapsed => {
      // console.log('====BaseNode-init()-start');

      // 检查状态
      if (transition.status !== 1) return stop();

      // 遍历transition id，找到需要执行动画的属性
      for (const tid in this.transitionData) {
        const t = this.transitionData[tid];

        // 若当前属性名不是transition对应的属性名则跳过本次，继续比较
        if (t.stateKey !== transition.stateKey) {
          continue;
        }

        // 若transition
        if (t.status === 3) {
          return timeout(start, undefined, undefined);
        }

        // 若transition
        if (t.status === 4) {
          // 停止动画
          t.status = 6;
          t.timer.stop();

          if (t.events.interrupt) {
            t.events.interrupt.call(this);
          }

          delete this.transitionData[tid];
        } else if (Number(tid) < id) {
          t.status = 6;
          t.timer.stop();

          delete this.transitionData[tid];
        }
      }

      // 在start方法中，将tick加入任务队列，且只会执行一次
      timeout(
        () => {
          if (transition.status === 3) {
            transition.status = 4;
            transition.timer.restart(tick, transition.timing.delay, transition.timing.time);
            tick(elapsed);
          }
        },
        undefined,
        undefined,
      );

      // 更改transition的状态为2，即将调用events的start()
      transition.status = 2;
      // 调用events的start
      if (transition.events.start) {
        transition.events.start.call(this);
      }
      if (transition.status !== 2) {
        return;
      }

      // 更改transition的状态为3，即将获取补间插值函数
      transition.status = 3;

      let j = -1;
      for (let i = 0; i < n; ++i) {
        // 返回一个可以计算并更新动画中间状态数据的函数
        const res = transition.tweens[i]();
        // console.log('====res, ', res);

        if (res) {
          tweens[++j] = res;
        }
      }

      tweens.length = j + 1;
    };

    // tick()，会在主线程的animate()方法执行完后执行
    const tick = elapsed => {
      // console.log('====BaseNode-init()-tick-start');

      // t表示已经经过的时间占动画预期时长的百分比
      let t = 1;

      // 若动画表面经过时间小于动画预期时长，则计算线性缓动的百分比
      if (elapsed < transition.timing.duration) {
        t = transition.timing.ease(elapsed / transition.timing.duration);
      } else {
        // 若动画表面经过时间大于动画预期时长，则停止动画

        console.log('====init()-tick-elapsed >= duration');
        transition.timer.restart(stop);
        transition.status = 5;
      }
      // console.log('tick-t-percent, ', t);

      // 循环计算动画中间态数据
      let i = -1;
      while (++i < tweens.length) {
        tweens[i](t);
      }

      if (transition.status === 5) {
        if (transition.events.end) {
          transition.events.end.call(this);
        }

        stop();
      }

      // console.log('====BaseNode-init()-tick-finished');
    };

    // stop()，会调用timer.stop()，停止定时器，并删除transition id对应的动画数据
    const stop = () => {
      // console.log('====BaseNode-init()-stop');

      transition.status = 6;
      transition.timer.stop();

      delete this.transitionData[id];
      // eslint-disable-next-line guard-for-in
      for (const _ in this.transitionData) return;
      delete this.transitionData;
    };

    // console.log('====BaseNode-init()-finished');
  }
}

export default BaseNode;
