import { vec2, vec4 } from '../';

test('vec2()', () => {
  const v = vec2(10, 20);

  // Creation
  expect(vec2(10)).toEqual([10, 10]);
  expect(v).toEqual([10, 20]);
  expect(vec4(1, 2, 3, 4)).toEqual([1, 2, 3, 4]);
  expect(vec4([1, 2, 3, 4])).toEqual([1, 2, 3, 4]);
  expect(vec4(vec2([1, 2]), vec2([3, 4]))).toEqual([1, 2, 3, 4]);

  // Get
  expect(v.length).toEqual(2);
  expect(v.x).toEqual(10);
  expect(v.yx).toEqual([20, 10]);
  expect(v.xxxx).toEqual([10, 10, 10, 10]);

  v.y = 30;
  expect(v.y).toEqual(30);
});
