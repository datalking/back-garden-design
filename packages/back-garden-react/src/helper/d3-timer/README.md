# d3-timer

## faq

- 难点(原因在于相互调用)
  - timer-wake
  - timer-poke
  - timer-nap
  - timer-sleep

## docs

- 提供了能处理并发动画的高效队列
- This module provides an efficient queue capable of managing thousands of concurrent animations, while guaranteeing consistent, synchronized timing with concurrent or staged animations.
- Internally, it uses `requestAnimationFrame` for fluid animation (if available), switching to setTimeout for delays longer than 24ms
- 主要提供了 5 个方法
- `d3.now()`
  - Returns the current time as defined by `performance.now()` if available, and `Date.now()` if not.
  - The current time is updated at the start of a frame; it is thus consistent during the frame, and any timers scheduled during the same frame will be synchronized.
  - If this method is called outside of a frame, such as in response to a user event, the current time is calculated and then fixed until the next frame, again ensuring consistent timing during event handling.
- `d3.timer(callback[, delay[, time]])`
  - Schedules a new timer, invoking the specified callback **repeatedly** until the timer is stopped.
  - An optional numeric delay in milliseconds may be specified to invoke the given callback after a delay; if delay is not specified, it defaults to zero
  - The delay is relative to the specified time in milliseconds; if time is not specified, it defaults to now.
  - The callback is passed the (apparent) elapsed time since the timer became active. The apparent elapsed time may be less than the true elapsed time if the page is backgrounded and requestAnimationFrame is paused; in the background, apparent time is frozen.
  - If timer is called within the callback of another timer, the new timer callback will be invoked immediately at the end of the current frame, rather than waiting until the next frame
  - Within a frame, timer callbacks are guaranteed to be invoked in the order they were scheduled, regardless of their start time.
  - `timer.restart(callback[, delay[, time]])`
    - Restart a timer with the specified callback and optional delay and time.
    - This is equivalent to stopping this timer and creating a new timer with the specified arguments, although this timer retains the original invocation priority.
  - `timer.stop()`
    - Stops this timer, preventing subsequent callbacks.No effect if the timer has already stopped.
- `d3.timerFlush()`
  - Immediately invoke any eligible timer callbacks.
  - Note that zero-delay timers are normally first executed after one frame (~17ms).定时器会在下一帧执行，因此会有不大于 17ms 的延迟。这可能导致页面闪烁，因为浏览器被渲染两次: 一次是在第一次事件循环结束时，另一次是在定时器回调第一次执行时。
  - By flushing the timer queue at the end of the first event loop, you can run any zero-delay timers immediately and avoid the flicker.
- `d3.timeout()`
  - Like timer, except the timer automatically stops on its first callback
  - A suitable replacement for `setTimeout` that is guaranteed to not run in the background. 这个方法不会在页面处于非活动状态时运行(内部使用 requestAnimationFrame 实现).The callback is passed the elapsed time(定义定时器到回调执行之间的时间).
- `d3.interval()`
  - Like timer, except the callback is invoked only every delay milliseconds
  - If delay is not specified, this is equivalent to timer.
  - A suitable replacement for `setInterval` that is guaranteed to not run in the background. The callback is passed the elapsed time.
