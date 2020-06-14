// is an animation frame pending? 表示动画函数是否暂停的状态，默认0表示(非暂停)
let frame = 0;
// is a timeout pending? 表示timeout是否处理暂停状态
let timeout: any = 0;
// are any timers active? 定时器timer是否处于激活状态
let interval: any = 0;
// how frequently we check for clock skew 检查页面暂停的时间间隔，默认1s检查一次
const pokeDelay = 1000;
// 动画函数任务队列头指针
let taskHead: any;
// 动画函数任务队列尾指针
let taskTail: { _next: any };
let clockLast = 0;
let clockNow = 0;
// 暂停时间 roughly equates to the amount of time the page has been sleeping. (It should be a negative value.)
let clockSkew = 0;
// 定义用来获取时间的对象
const clock = typeof performance === 'object' && performance.now ? performance : Date;
/** 定义动画函数，若浏览器支持requestAnimationFrame，则使用它，否则使用setTimeout */
const setFrame =
  typeof window === 'object' && window.requestAnimationFrame
    ? window.requestAnimationFrame.bind(window)
    : function(f: any) {
        setTimeout(f, 17);
      };

/**
 * timer定时器的构造函数，包含3个实例属性，是一个存放待执行动画函数的任务队列
 * @param this Timer
 */
// export function Timer( ) {
export function Timer(this: any) {
  /** _next指针指向下一个timer */
  this._next = null;
  /**  当前timer */
  this._time = this._next;
  /** 当前执行的回调函数 */
  this._call = this._time;
}

Timer.prototype = timer.prototype = {
  constructor: Timer,
  /** 重新启动定时器，会重新计算基准时间time */
  restart: function(callback: Function, delay: number, time: number) {
    // console.log('====调用Timer restart');
    if (typeof callback !== 'function') throw new TypeError('callback is not a function');
    // time若未传入则赋值为now()
    time =
      (time === null || time === undefined ? now() : Number(time)) +
      (delay === null || delay === undefined ? 0 : Number(delay));

    // 若_next为空且尾指针不是当前对象this
    if (!this._next && taskTail !== this) {
      // 若尾指针存在，则将this添加到队列尾
      if (taskTail) {
        taskTail._next = this;
      } else {
        // 若尾指针不存在，则将this作为头指针
        taskHead = this;
      }
      taskTail = this;
    }

    // 将传入restart()方法的参数赋值给timer
    this._call = callback;
    this._time = time;
    // 这里决定调用cb一次还是多次
    sleep(undefined);
  },
  /** 停止当前timer的唯一方式，不再执行callback */
  stop: function() {
    if (this._call) {
      this._call = null;
      this._time = Infinity;
      //
      sleep(undefined);
    }
  },
};

/**
 * 创建一个新的定时器对象。
 * 会重复执行回调函数直到stop()方法被调用，timeout和interval都基于timer实现。
 * 回调函数会被传入从定时器激活以来表面经过的时间(apprent elapsed time)作为参数，
 * 表面经过时间可能比实际经过时间要短，因为页面进入后台模式时raf会暂停，表面经过时间会冻结。
 * 参考： https://github.com/d3/d3-timer/issues/17
 * @param callback 待执行的回调函数
 * @param delay 延迟时间ms，默认0
 * @param time 计算延迟的基准时间，默认now()
 */
export function timer(callback: Function, delay: number, time: number) {
  const t = new Timer();
  t.restart(callback, delay, time);
  return t;
}

/** 定义了一个函数，可以立即调用任务队列所有回调函数，回调函数中可以包含stop方法 */
export function timerFlush() {
  // Get the current time, if not already set.
  now();
  // Pretend we’ve set an alarm, if we haven’t already.
  // 开始执行回调函数了，方便调用stop时根据frame直接return
  ++frame;
  // 获取动画函数任务队列头指针
  let t = taskHead;
  let e: number;
  // console.log('timerFlush-taskHead, ', t);
  // 若头指针非空，则循环执行头指针处的回调函数
  while (t) {
    e = clockNow - t._time;
    // console.log('timerFlush-e, ', e);
    // console.log(t);

    if (e >= 0) {
      t._call.call(null, e);
    }
    t = t._next;
  }
  --frame;
  // console.log('timerFlush-finished, ', t);
}

/** 页面从后台激活wake时，会调用任务队列所有回调函数，setTimeout(cb,t)会调用此回调方法 */
function wake() {
  clockLast = clock.now();
  clockNow = clockLast + clockSkew;
  frame = timeout = 0;
  try {
    // console.log('====wake');

    // 立即调用任务队列所有回调函数
    timerFlush();
  } finally {
    // console.log('====wake()-finally-nap');
    frame = 0;
    nap();
    clockNow = 0;
  }
}

/**
 * 计算当前delay，当delay大于1s时，再计算时钟偏差，setInterval(cb,t)会调用此回调方法,
 * 一次动画操作只会调用一次
 */
function poke() {
  const now = clock.now();
  const delay = now - clockLast;
  console.log('====执行poke-delay, ', delay);

  // 若距离上次的delay大于1000
  if (delay > pokeDelay) {
    clockSkew -= delay;
    clockLast = now;
  }
}
/** 使用raf时若页面进入后台则暂停，遍历任务队列 */
function nap() {
  let t0: { _next: any };
  let t1 = taskHead;
  let t2: any;
  let time = Infinity;
  // console.log('====nap-t1, ', t1);

  // 当t1头指针非空时
  while (t1) {
    // 若t1回调函数存在，则将t1赋值给t0，t1头指针后移一个，遍历完队列
    if (t1._call) {
      if (time > t1._time) time = t1._time;
      //   (t0 = t1), (t1 = t1._next);
      t0 = t1;
      t1 = t1._next;
    } else {
      // 若t1回调函数不存在，
      //   (t2 = t1._next), (t1._next = null);
      t2 = t1._next;
      t1._next = null;
      // t1 = t0 ? (t0._next = t2) : (taskHead = t2);
      if (t0) {
        t0._next = t2;
        t1 = t0._next;
      } else {
        taskHead = t2;
        t1 = taskHead;
      }
    }
  }

  // 将t0赋值给尾指针
  taskTail = t0;
  // console.log('====nap-sleep-time, ', time);
  //
  sleep(time);
}

/**
 *
 * @param time 当前时间，若传入undefined，则执行setInterval
 */
function sleep(time: number) {
  // console.log('调用sleep()-time-param, ', time);
  // console.log('sleep()-start-frame, ', frame);

  // frame初始值0表示非暂停，若frame不为0则直接返回
  // Soonest alarm already set, or will be.
  if (frame) return;
  // 若超时id存在，则直接清除超时
  if (timeout) timeout = clearTimeout(timeout);
  // 计算具体延迟时间，若time为undefined，则delay是NaN
  // Strictly less than if we recomputed clockNow.
  const delay = time - clockNow;
  // console.log('====sleep()-delay', delay);
  // 若delay存在且大于24 FIXME 为什么是24
  if (delay > 24) {
    // 传入wake()到setTimeout，最后调用一次wake()
    if (time < Infinity) {
      timeout = setTimeout(wake, time - clock.now() - clockSkew);
    }
    if (interval) {
      // console.log('sleep()-清除interval, ', interval);
      interval = clearInterval(interval);
    }
  } else {
    // 若delay不存在或小于等于24

    // 若interval为0，则异步检查后台暂停时间
    if (!interval) {
      clockLast = clock.now();
      // 传入poke()到setInterval，每隔1s检查一次是否暂停
      // 若主线程调用stop方法，则poke还没来得及执行就被clearInterval了
      interval = setInterval(poke, pokeDelay);
      // console.log('sleep()-执行setInterval返回id，', interval);
    }
    // 标记当前frame处于暂停状态
    frame = 1;
    // 在浏览器下次repaint时最后调用一次wake()
    setFrame(wake);
  }
}

/**
 * 获取当前时间，若支持performance.now()则使用它，否则使用Date.now()
 * 在同一frame中，now是不变的，会加上页面后台的时间
 */
export function now() {
  // return clockNow || (setFrame(clearNow), (clockNow = clock.now() + clockSkew));
  // 若clockNow为0
  if (!clockNow) {
    setFrame(clearNow);
    clockNow = clock.now() + clockSkew;
  }
  return clockNow;
}

function clearNow() {
  clockNow = 0;
}
