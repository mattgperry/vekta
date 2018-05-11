# <img src="https://user-images.githubusercontent.com/7850794/38776168-b90a8f0c-408a-11e8-96cb-3d76800f118d.png" height="77" width="212" alt="Vekta" /></a>

### A JavaScript vector type with GLSL-inspired swizzling

```javascript
const pos = vec2(0); // [0, 0]
pos.y += 1; // [0, 1]
pos.xy = pos.yx; // [1, 0]
const pos3d = vec3(pos, 10); // [1, 0, 10]
```

## Features

* [Iterable vectors](#iterate)
* [Swizzling](#access)
* [Custom vector types](#create-vector-types)
* Tiny (< 1kb), zero-dependencies

## Install

Via package managers:

```bash
npm install vekta --save
```

```bash
yarn add vekta
```

Via CDN (Loads Vekta into `window.vekta`):

```
https://unpkg.com/vekta/dist/vekta.js
```

## Usage

### Import

All [included types](#included-types) can be imported as named imports, like so:

```javascript
import { vec2 } from 'vekta';
```

### Create

Each vector function returns a proxied array:

```javascript
const pos = vec2(0, 10); // [0, 10]
```

### Fill forward

If the number of provided arguments doesn't match the expected size of the vector, the rest of the array will be filled by cycling through the provided values:

```javascript
const pos = vec4(0, 1); // [0, 1, 0, 1]
```

### Access

These values are accessible both by their index and by their `x`, `y`, `z` and `w` axis labels:

```javascript
const pos = vec3(0, 10, 20);
pos[1]; // 10
pos.y; // 10
```

This is known as **swizzling** and is inspired by the vector types in [GLSL](https://www.khronos.org/opengl/wiki/Data_Type_%28GLSL%29#Vectors).

We can return multiple values as a new vector by naming multiple properties:

```javascript
pos.xy; // [0, 10]
```

These values will be returned in the order defined:

```javascript
pos.yx; // [10, 0]
```

We can define up to four dimensions to return:

```javascript
pos.zzzz; // [20, 20, 20, 20]
```

### Cast into higher dimension

By passing one vector into another, we can cast existing vectors into higher dimensions.

```javascript
const a = vec2(1, 2);
const b = vec3(a, 3); // [1, 2, 3]
const c = vec4(4, b); // [4, 1, 2, 3]
```

Combined with swizzling and the `rgba` vector type, we can create a new number by casting only the `rgb` values and providing a new alpha:

```javascript
const red = rgba(255, 0, 0, 1);
const semiTransparentRed = rgba(red.rgb, 0.5);
```

### Iterate

As vectors are just proxied arrays, they offer all the same iterators:

```javascript
const pos = vec3(0);
const numAxis = pos.length; // 3

pos.forEach(/**/);
pos.reduce(/**/);
pos.map(/**/);
```

### Animate

[Popmotion](https://popmotion.io) can animate arrays, so it can animate vectors:

```javascript
tween({ from: pos.xy, to: pos.yx });
```

## Included types

### Position: `vec2`, `vec3`, `vec4`

Property order: `['x', 'y', 'z', 'w']`

### Color: `rgb`, `rgba`, `hsl`, `hsla`

RGBA property order: `['r', 'g', 'b', 'a']`
HSLA property order: `['h', 's', 'l', 'a']`

**Note:** Currently, the color vectors are essentially syntactic sugar as they don't perform validation to ensure that provided values are valid colors.

## Create vector types

New vector types can be created with the `vectorType` function.

```javascript
import { vectorType } from 'vekta';
```

`vectorType` accepts an array of unique, alphabetic keys. Each key must be of `length === 1`, and the array itself must be `length >= 2`.

It returns an array of functions that handle permutations of the vector type of length `2` to `n`, where `n` is the total number of given keys.

```javascript
const [foo2, foo3] = vectorType(['a', 'b', 'c']);

const bar = foo2(0, 10); // [0, 10]
bar.ab = bar.ba; // [10, 0]
bar3 = foo3(20, bar); // [20, 10, 0]
```

Currently there isn't a big use case for function, but it's easy to imagine adding a configuration argument that allows us to add a little more intelligence to our vector types like validation.

## Browser support

Vekta requires [Proxy](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Proxy) features that can't be polyfilled so it doesn't offer Internet Explorer support.

As Googlebot runs Chrome 41, any use of Proxy will prevent client-rendered websites from being crawled correctly.

## Roadmap

Some ideas for future development:

### Validated setters

Add an optional property to `vectorType` that would allow the definition of functions that would transform set properties to ensure only valid props are set:

```javascript
const [, rgb, rgba] = vectorType(['r', 'g', 'b', 'a'], {
  setters: {
    r: pipe(clamp(0, 255), Math.round)
    //...the rest
  }
});
```

### Interpolation

Add an optional property to `vectorType` that would allow vector types to interpolate between each other when swizzled.

```javascript
const rgb = vectorType(['r', 'g', 'b', 'a'], {
  scale: {
    r: [0, 255],
    g: [0, 255],
    b: [0, 255],
    a: [0, 1]
  }
});

const color = rgba(255, 255, 255, 0.5);
color.ga = color.ag;
console.log(color); // [255, 127, 255, 1]
```
