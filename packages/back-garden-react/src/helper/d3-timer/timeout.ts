import { Timer } from './timer';
/**
 * 等待delay毫秒后执行callback函数，只执行一次
 * @param callback 待执行的回调函数
 * @param delay 延迟时间ms
 * @param time 计算延迟的基准时间
 */
function timeout(callback: Function, delay: number, time: number) {
  const t = new Timer();
  delay = delay === null || delay === undefined ? 0 : Number(delay);
  t.restart(
    function(elapsed) {
      // 这里是异步的
      t.stop();
      // 先执行一次cb
      callback(elapsed + delay);
    },
    delay,
    time,
  );
  return t;
}

export default timeout;
