import { vec2 } from '../';

test('vec2()', () => {
  const testVector = vec2(10, 20);

  expect(testVector).toEqual([10, 20]);
});
