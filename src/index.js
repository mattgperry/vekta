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

const getWrappedIndex = (total, i) => (i % total + total) % total || 0;

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
    if (newValues[i] === undefined)
      newValues[i] = newValues[getWrappedIndex(numValues, i)];
  }

  return newValues;
};

const makeIndicesMap = (map, key, i) => ((map[key] = i), map);

const isSwizzleKey = (key, indices) => {
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
  const numKeys = key.length;
  for (let i = 0; i < numKeys; i++) {
    if (indices[key[i]] === undefined) return false;
  }

  return key;
};

const getVectorFactory = (factories, size) => factories[size - 2];

// TODO: Replace .split('') with a for loop
const getSwizzled = (target, indices, key, vec) => {
  const numKeys = key.length;

  if (numKeys === 1) {
    return target[indices[key[0]]];
  } else {
    const values = [];
    for (let i = 0; i < numKeys; i++) values.push(target[indices[key[i]]]);
    return getVectorFactory(vec, numKeys)(values);
  }
};

const setSwizzled = (target, indices, key, value) => {
  const numKeys = key.length;
  const valueIsArray = Array.isArray(value);
  const numValues = valueIsArray ? value.length : 0;

  for (let i = 0; i < numKeys; i++) {
    target[indices[key[i]]] = valueIsArray
      ? value[getWrappedIndex(numValues, i)]
      : value;
  }
  return value;
};

const vectorType = axisOrder => {
  const indices = axisOrder.reduce(makeIndicesMap, {});
  const vecFactories = [];

  const vectorProxy = {
    get(target, key, receiver) {
      return isSwizzleKey(key, indices)
        ? getSwizzled(target, indices, key, vecFactories)
        : Reflect.get(target, key, receiver);
    },
    set(target, key, value, receiver) {
      return isSwizzleKey(key, indices)
        ? setSwizzled(target, indices, key, value)
        : Reflect.set(target, key, value, receiver);
    }
  };

  return axisOrder.reduce((acc, _, i) => {
    // No vector factories for 1-dimensions
    if (i > 0) {
      const size = i + 1;
      acc.push(
        (...values) => new Proxy(fillVectorArray(values, size), vectorProxy)
      );
    }
    return acc;
  }, vecFactories);
};

export { vectorType };
export const [vec2, vec3, vec4] = vectorType(['x', 'y', 'z', 'w']);
export const [rg, rgb, rgba] = vectorType(['r', 'g', 'b', 'a']);
export const [hs, hsl, hsla] = vectorType(['h', 's', 'l', 'a']);
