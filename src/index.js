const indicies = {
  x: 0,
  y: 1,
  z: 2,
  r: 0,
  g: 1,
  b: 2,
  a: 3,
  h: 0,
  s: 1,
  l: 2
};

const vector = numDimensions => {
  const vectorProxy = {};

  return (...args) => {
    const props = typeof args[0] !== 'number' ? args[0] : args;
    return new Proxy([...props], vectorProxy);
  };
};

export const vec2 = vector(2);
export const vec3 = vector(3);
export const vec4 = vector(4);

// const getVectorPropByKey = (target, key) => {
//   const numDimensions = key.length;

//   // If a single dimension like x or r, return plain number
//   if (numDimensions === 1) {
//     const index = indicies[key];
//     return target[index];

//     // Or if multi-dimension, return a vector
//   } else {
//     const dimensions = key.split('');
//     return dimensions.reduce((thisVector, axisKey, i) => {
//       const index = indicies[axisKey];
//       thisVector[i] = target[index];
//       return thisVector;
//     }, vec([]));
//   }
// }

// const getVectorProp = (target, key) => (!isNaN(parseInt(key)))
//   ? target[parseInt(key)]
//   : getVectorPropByKey(target, key)

// const setVectorPropByKey = (target, key, value) => {
//   const i = indicies[key];
//   target[i] = value;
//   return target;
// }

// const vectorProxy = {
//   get(target, key, receiver) {
//     return (typeof key === 'string' && key !== 'length')
//       ? getVectorProp(target, key)
//       : Reflect.get(target, key, receiver);
//   },

//   set(target, key, value, receiver) {
//     const index = parseInt(key);
//     return (!isNaN(index))
//       ? Reflect.set(target, key, value, receiver)
//       : setVectorPropByKey(target, key, value)
//   },
//   ownKeys() {
//     return ['length']
//   }
// }

// const vec = (...args) => {
//   const props = typeof args[0] !== 'number' ? args[0] : args;
//   return new Proxy([...props], vectorProxy);
// }

// const xy = vec(0, 35)

// console.log('get', xy.rgb)
// xy.xy = 20
// console.log('set', xy)

// //.vec2(xy)
