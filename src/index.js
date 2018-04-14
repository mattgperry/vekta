// Fill a given array to the size provided with
// a repeating pattern of its existing values. ie ([10, 20], 3) -> [10, 20, 10]
const fillVectorArray = (values, size) => {
  const newValues = flatten(values);
  const numValues = newValues.length;

  // If we already have the correct number of values, return early
  if (numValues === size) return newValues;

  // Set array to correct size
  newValues.length = size;

  // Fill in the blanks
  for (let i = 0; i < size; i++) {
    // We're using modulo to wrap the index to within the values range
    // so vec4(10, 20) becomes [10, 20, 10, 20]
    if (newValues[i] === undefined)
      newValues[i] = values[(i % numValues + numValues) % numValues];
  }

  return newValues;
};

// Flatten an array of values
const flattenItem = (acc, val) => {
  if (Array.isArray(val)) {
    const numItems = val.length;
    for (let i = 0; i < numItems; i++) acc.push(val[i]);
  } else {
    acc.push(val);
  }

  return acc;
};

const flatten = arr => arr.reduce(flattenItem, []);

const makeIndicesMap = (map, key, i) => ((map[key] = i), map);

const getSwizzleKeys = (key, indices) => {
  if (
    // If this isn't a string, bail
    typeof key !== 'string' ||
    // Check if this is an Array method
    Array.prototype.hasOwnProperty(key) ||
    // Index-based access keys are sent as strings, so here we parse
    // and test to see if they're actually numbers. If so, bail.
    !isNaN(parseInt(key))
  )
    return false;

  // Iterate through all the keys and test to see if they exist in
  // the indices map. If one doesn't, bail.
  const keys = key.split('');
  const numKeys = keys.length;
  for (let i = 0; i < numKeys; i++) {
    if (indices[keys[i]] === undefined) return false;
  }

  return keys;
};

const getVectorFactory = (factories, size) => factories[size - 2];

const getSwizzled = (target, indices, keys, vec) => {
  const numKeys = keys.length;
  return numKeys === 1
    ? target[indices[keys[0]]]
    : keys.reduce((acc, key, i) => {
        acc[i] = target[indices[key]];
        return acc;
      }, getVectorFactory(vec, numKeys)());
};

const setSwizzled = (target, indices, keys, value) => {
  const numKeys = keys.length;
  for (let i = 0; i < numKeys; i++) target[indices[keys[i]]];
  return value;
};

const vector = axisOrder => {
  const indices = axisOrder.reduce(makeIndicesMap, {});
  const vecFactories = [];

  const vectorProxy = {
    get(target, key, receiver) {
      const swizzleKeys = getSwizzleKeys(key, indices);
      return swizzleKeys
        ? getSwizzled(target, indices, swizzleKeys, vecFactories)
        : Reflect.get(target, key, receiver);
    },
    set(target, key, value, receiver) {
      const swizzleKeys = getSwizzleKeys(key, indices);
      return swizzleKeys
        ? setSwizzled(target, indices, swizzleKeys, value)
        : Reflect.set(target, key, value, receiver);
    }
  };

  return axisOrder.reduce((acc, _, i) => {
    if (i > 0) {
      acc.push(
        (...values) => new Proxy(fillVectorArray(values, i + 1), vectorProxy)
      );
    }
    return acc;
  }, vecFactories);
};

export { vector };
export const [vec2, vec3, vec4] = vector(['x', 'y', 'z', 'w']);
export const [rg, rgb, rgba] = vector(['r', 'g', 'b', 'a']);
export const [hs, hsl, hsla] = vector(['h', 's', 'l', 'a']);
