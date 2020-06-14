import { now } from '../timer';

test('now() returns the same time when called repeatedly in one frame', () => {
  const nowVal = now();
  expect(now()).toBe(nowVal);
});

test('now() returns a different time when called after a timeout', () => {
  const then = now();
  setTimeout(function() {
    expect(now() - then).toBeGreaterThanOrEqual(50 - 5);
    expect(now() - then).toBeLessThanOrEqual(50 + 5);
  }, 50);
});
