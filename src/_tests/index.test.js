import { vec2, vec3, vec4 } from '../';

test('vec()', () => {
  console.log();
  const v = vec2(10, 20);

  // Creation
  expect(vec2(10)).toEqual([10, 10]);
  expect(v).toEqual([10, 20]);
  expect(vec4(1, 2, 3, 4)).toEqual([1, 2, 3, 4]);
  expect(vec4([1, 2, 3, 4])).toEqual([1, 2, 3, 4]);
  expect(vec4(vec2([1, 2]), vec2([3, 4]))).toEqual([1, 2, 3, 4]);
  expect(vec4(1, 2)).toEqual([1, 2, 1, 2]);
  expect(vec2([1, 2])).toEqual([1, 2]);
  expect(vec4([1, 2])).toEqual([1, 2, 1, 2]);

  // Get
  expect(v.length).toEqual(2);
  expect(v.x).toEqual(10);
  expect(v.yx).toEqual([20, 10]);
  expect(v.xxxx).toEqual([10, 10, 10, 10]);

  // Set
  v.y = 30;
  expect(v.y).toEqual(30);
  const v3 = vec3(10);
  expect(v3.y).toEqual(10);
  v3.xyz = 20;
  expect(v3).toEqual([20, 20, 20]);
  v3.xyz = [1, 2];
  expect(v3.x).toEqual(1);
  expect(v3.y).toEqual(2);
  expect(v3.z).toEqual(1);

  const a = vec2(1, 2);
  const b = vec4(5, 5, 5, 5);
  b.yz = a;
  expect(b).toEqual([5, 1, 2, 5]);
  const { x, y } = a;
  expect(x).toEqual(1);

  // Enumerate
  expect(a.map(v => v)).toEqual([1, 2]);
});
