# @bananaseed/qgfx

qgfx is a functional graphics library for the HTML5 Canvas API. It provides a composable way to build and transform complex drawings using simple primitives and transforms.

## Installation

```bash
npm install @bananaseed/qgfx
```

## Core Concepts

The library is built around two primary types:

- **Picture**: A function that takes a `CanvasRenderingContext2D` and performs drawing operations.
- **Transform**: A function that takes a `Picture` and returns a new `Picture` with modifications (like translation, scaling, or styling).

```typescript
type Picture = (ctx: CanvasRenderingContext2D) => void
type Transform = (pic: Picture) => Picture
```

## Features

### Pictures
- `blank`: An empty picture.
- `rect`: A 1x1 unit rectangle.
- `circle`: A unit circle.
- `segment(pt1, pt2)`: A line segment between two points.
- **Path Builder**: A fluent API for creating complex paths (similar to Canvas 2D path commands).

### Transforms
- `translate(x, y)`
- `scale(x, y)`
- `rotate(angle)`
- `flipX`, `flipY`
- `mirrorX`, `mirrorY`
- `clip(region)`
- `fill(fillStyle)`
- `stroke(strokeStyle)`

### Styling
- **Colors**: Support for CSS strings, RGB/HSL, and hex codes.
- **Color Operators**: `hueRotate`, `saturate`, etc.
- **Gradients and Patterns**.

## Example Usage

```typescript
import { rect, fill, translate, overlay } from '@bananaseed/qgfx';

const redRect = fill('red')(rect)
const shiftedRect = translate(10, 10)(redRect)

const main = overlay([
  rect,
  shiftedRect
])

const canvas = document.getElementById('myCanvas')
const ctx = canvas.getContext('2d')
main(ctx)
```

## License

ISC
