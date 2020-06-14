import { Timer, now } from './timer';
/**
 * 每隔delay毫秒执行一次callback函数，会重复执行，若不传入delay参数，则等同于timer()
 * @param callback 待执行的回调函数
 * @param delay 延迟时间ms
 * @param time 计算延迟的基准时间
 */
function interval(callback: Function, delay: number, time: number) {
  const t = new Timer();
  let total = delay;
  // if (delay === null) {
  if (delay === null || delay === undefined) {
    t.restart(callback, delay, time);
    return t;
  }
  delay = Number(delay);
  time = time === null || time === undefined ? now() : Number(time);
  t.restart(
    function tick(elapsed) {
      elapsed += total;
      t.restart(tick, (total += delay), time);
      callback(elapsed);
    },
    delay,
    time,
  );
  return t;
}

export default interval;
