import { now, timer } from '../timer';

test('timer(callback) returns an instanceof timer', () => {
  const t = timer(function() {}, undefined, undefined);
  // eslint-disable-next-line no-unused-expressions
  expect(t instanceof timer).toBeTruthy;
});

// It’s difficult to test the timing behavior reliably, since there can be small
// hiccups that cause a timer to be delayed. So we test only the mean rate.
test('timer(callback) invokes the callback about every 17ms', () => {
  const then = now();
  let count = 0;
  const t = timer(
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
