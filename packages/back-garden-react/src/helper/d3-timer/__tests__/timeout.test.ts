import { now, timer } from '../timer';
import timeout from '../timeout';

test('timeout(callback) invokes the callback once', () => {
  let count = 0;
  timeout(
    function() {
      expect(++count).toBe(1);
    },
    undefined,
    undefined,
  );
});

test('timeout(callback, delay) invokes the callback once after the specified delay', () => {
  const then = now();
  const delay = 50;
  timeout(
    function(elapsed) {
      expect(now() - then).toBeGreaterThanOrEqual(delay - 10);
      expect(now() - then).toBeLessThanOrEqual(delay + 10);
    },
    delay,
    undefined,
  );
});
