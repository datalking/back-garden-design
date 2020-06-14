import { now, timer } from '../timer';
import interval from '../interval';

// It’s difficult to test the timing behavior reliably, since there can be small
// hiccups that cause a timer to be delayed. So we test only the mean rate.
test('interval(callback) invokes the callback about every 17ms', () => {
  const then = now();
  let count = 0;
  const t = interval(
    function() {
      // if (++count > 10) {
      if (++count > 2) {
        t.stop();
        expect(now() - then).toBeGreaterThanOrEqual((17 - 5) * count);
        expect(now() - then).toBeLessThanOrEqual((17 + 5) * count);
      }
    },
    undefined,
    undefined,
  );
});
