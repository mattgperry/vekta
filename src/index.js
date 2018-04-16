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

/**
 * Create a valid set of swizzles based on a list of single-character keys.
 * ie ['x', 'y'] -> ['x', 'y', 'xx', 'xy' ...]
 */
const createValidSwizzleSet = (keys) => {
  const numKeys = keys.length;
  const maxDepth = numKeys - 1;
  
  const addKeys = (key, depth) => {
    const validKeys = [key];
    
    if (depth >= maxDepth) return validKeys;
    
    for (let i = 0; i < numKeys; i++) {
      validKeys.push(...addKeys(key + keys[i], depth + 1));
    }
 
    return validKeys;
  };
  
  return new Set(keys.reduce((acc, key) => {
    acc.push(...addKeys(key, 0));
    return acc;
  }, []));
};

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
  const validSwizzleKeys = createValidSwizzleSet(axisOrder);
  const vecFactories = [];

  const vectorProxy = {
    get(target, key, receiver) {
      return validSwizzleKeys.has(key)
        ? getSwizzled(target, indices, key, vecFactories)
        : Reflect.get(target, key, receiver);
    },
    set(target, key, value, receiver) {
      return validSwizzleKeys.has(key)
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
