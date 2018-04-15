# <img src="https://user-images.githubusercontent.com/7850794/38776168-b90a8f0c-408a-11e8-96cb-3d76800f118d.png" height="77" width="212" alt="Vekta" /></a>

### A vector library with GLSL-inspired swizzling

## Features

* Iterable vectors
* [Swizzling](#link-to-swizzling)
* Custom vector types
* Tiny (< 1kb), zero-dependencies

## Examples

### Swap dimensions

```javascript
const pos = vec2(0, 50);
pos.xy = pos.yx;
```

### Cast into higher dimension

```javascript
const a = vec2(1, 2);
const b = vec3(a, 3); // [1, 2, 3]
```

### Fill

```javascript
const a = vec3(10, 20); // [10, 20, 10]
```

### Change color opacity

```javascript
const red = rgba(255, 0, 0, 1);
const semiTransparentRed = rgba(red.rgb, 0.5);
```

### Iterate

```javascript
const pos = vec3(0);
const numAxis = pos.length; // 3

pos.forEach(/**/);
pos.reduce(/**/);
pos.map(/**/);
```

## Install

```bash
npm install vekta --save
```

```bash
yarn add vekta
```

## Available types

### `vec2`, `vec3`, `vec4`

### `rgb`, `rgba`

### `hsl`, `hsla`

## Create vector types
