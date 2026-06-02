import type {
  Picture,
  Transform,
  FillStyle,
  LineStyle,
  ImageSource,
  ImageSourceData,
  ShadowOptions,
  Color,
  Matrix,
  MatrixArray
} from "./types"
import { Path } from "./path"
import { isColor } from "./color"
import { Gradient } from "./gradient"
import { Pattern } from "./pattern"

export const blank: Picture = _ctx => { }
export const rect: Picture = ctx => {
  ctx.rect(0, 0, 1, 1)
}
export const circle: Picture = ctx => {
  ctx.moveTo(0, 1)
  ctx.arc(0, 0, 1, 0, Math.PI * 2)
}
export const segment = (x1: number, y1: number, x2: number, y2: number): Picture => {
  return ctx => {
    ctx.moveTo(x1, y1)
    ctx.lineTo(x2, y2)
  }
}
export const arc = (radius: number, start: number, end: number): Picture => {
  return ctx => {
    ctx.arc(0, 0, radius, start, end)
  }
}
export const quadraticCurve = (

  cpx: number, cpy: number,
  x: number,   y: number
): Picture => {
  return ctx => {
    ctx.quadraticCurveTo(cpx, cpy, x, y)
  }
}
export const bezierCurve = (cp1x: number, cp1y: number, cp2x: number, cp2y: number, x: number, y: number): Picture => {
  return ctx => {
    ctx.bezierCurveTo(cp1x, cp1y, cp2x, cp2y, x, y)
  }
}
export const fillText = (content: string, font?: string): Picture => {
  return ctx => {
    if (font) ctx.font = font
    ctx.fontVariantCaps = "titling-caps"
    ctx.fillText(content, 0, 0)
  }
}
export const strokeText = (content: string, font?: string): Picture => {
  return ctx => {
    if (font) ctx.font = font
    ctx.strokeText(content, 0, 0)
  }
}

export const clear: Picture = ctx => {
  ctx.canvas.width += 0
}

export const iterate = (n: number, fn: (i: number) => Picture): Picture => {
  const pics = Array(n).fill(null).map((_, i) => fn(i))
  return overlay(pics)
}
export const withTransforms = (transforms: Transform[]): Transform => {
  return pic => overlay(transforms.map(tfm => tfm(pic)))
}

export const withContext = (pic: Picture): Picture => {
  return ctx => {
    ctx.save()
    pic(ctx)
    ctx.restore()
  }
}

export const compose = (...transforms: Transform[]): Transform => {
  return pic => transforms.reduceRight((p, t) => t(p), pic)
}

const transformDomMtx = (matrix: DOMMatrix): Transform => {
  return pic => {
    return ctx => {
      ctx.transform(matrix.a, matrix.b, matrix.c, matrix.d, matrix.e, matrix.f)
      pic(ctx)
    }
  }
}
const transformMtxArr = (matrix: MatrixArray): Transform => {
  return pic => {
    return ctx => {
      ctx.transform(matrix[0], matrix[1], matrix[2], matrix[3], matrix[4], matrix[5])
      pic(ctx)
    }
  }
}
export const transform = (matrix: Matrix): Transform => {
  if (matrix instanceof DOMMatrix) return transformDomMtx(matrix)
  else return transformMtxArr(matrix)
}
export const translate = (x: number, y: number): Transform => {
  return pic => {
    return ctx => {
      ctx.translate(x, y)
      pic(ctx)
    }
  }
}
export const scale = (x: number, y: number): Transform => {
  return pic => {
    return ctx => {
      ctx.scale(x, y)
      pic(ctx)
    }
  }
}
export const rotate = (radians: number): Transform => {
  return pic => {
    return ctx => {
      ctx.rotate(radians)
      pic(ctx)
    }
  }
}
export const skew = (x: number, y: number): Transform => {
  return pic => {
    return ctx => {
      ctx.transform(1, y, x, 1, 0, 0)
      pic(ctx)
    }
  }
}
export const flipX: Transform = pic => {
  return ctx => {
    ctx.scale(-1, 1)
    pic(ctx)
  }
}
export const flipY: Transform = pic => {
  return ctx => {
    ctx.scale(1, -1)
    pic(ctx)
  }
}
export const mirrorX: Transform = pic => {
  return ctx => {
    pic(ctx)
    ctx.scale(-1, 1)
    pic(ctx)
  }
}
export const mirrorY: Transform = pic => {
  return ctx => {
    pic(ctx)
    ctx.scale(1, -1)
    pic(ctx)
  }
}

export const opacity = (alpha: number): Transform => {
  return pic => {
    return ctx => {
      const oldAlpha = ctx.globalAlpha
      ctx.globalAlpha *= alpha
      pic(ctx)
      ctx.globalAlpha = oldAlpha
    }
  }
}
export const hueRotate = (radians: number): Transform => {
  return filter(`hue-rotate(${radians}rad)`)
}
export const saturate = (percentage: number): Transform => {
  return filter(`saturate(${percentage}%)`)
}
export const lighten = (percentage: number): Transform => {
  return filter(`brightness(${percentage}%)`)
}

export const composite = (operation: GlobalCompositeOperation): Transform => {
  return pic => {
    return ctx => {
      const oldValue = ctx.globalCompositeOperation
      ctx.globalCompositeOperation = operation
      pic(ctx)
      ctx.globalCompositeOperation = oldValue
    }
  }
}

export const shadowColor = (color: string | Color): Transform => {
  return pic => {
    return ctx => {
      ctx.save()
      ctx.shadowColor = color.toString()
      pic(ctx)
      ctx.restore()
    }
  }
}
export const shadowBlur = (blur: number): Transform => {
  return pic => {
    return ctx => {
      ctx.save()
      ctx.shadowBlur = blur
      pic(ctx)
      ctx.restore()
    }
  }
}
export const shadowOffset = (x: number, y: number): Transform => {
  return pic => {
    return ctx => {
      ctx.save()
      ctx.shadowOffsetX = x
      ctx.shadowOffsetY = y
      pic(ctx)
      ctx.restore()
    }
  }
}
export const shadow = (options: ShadowOptions): Transform => {
  return pic => {
    return ctx => {
      ctx.save()
      if (options.color !== undefined) ctx.shadowColor = options.color.toString()
      if (options.blur !== undefined) ctx.shadowBlur = options.blur
      if (options.offsetX !== undefined) ctx.shadowOffsetX = options.offsetX
      if (options.offsetY !== undefined) ctx.shadowOffsetY = options.offsetY
      pic(ctx)
      ctx.restore()
    }
  }
}

export const filter = (filterStr: string): Transform => {
  return pic => {
    return ctx => {
      ctx.filter = filterStr
      pic(ctx)
    }
  }
}

export const overlay = (pics: Picture[]): Picture => {
  return ctx => {
    for (let i = 0; i < pics.length; i++) {
      ctx.save()
      pics[i](ctx)
      ctx.restore()
    }
  }
}

export const fill = (fillStyle: FillStyle): Transform => {
  return pic => {
    return ctx => {
      ctx.beginPath()
      ctx.fillStyle = toCanvasFillStyle(ctx, fillStyle)
      pic(ctx)
      ctx.fill()
    }
  }
}
export const stroke = (strokeStyle: FillStyle, lineStyle?: LineStyle): Transform => {
  return pic => {
    return ctx => {
      ctx.beginPath()
      ctx.save()
      pic(ctx)
      ctx.restore()
      ctx.strokeStyle = toCanvasFillStyle(ctx, strokeStyle)
      if (lineStyle) applyLineStyle(ctx, lineStyle)
      ctx.stroke()
    }
  }
}

export const fillStyle = (fillStyle: FillStyle): Transform => {
  return pic => {
    return ctx => {
      const old = ctx.fillStyle
      ctx.fillStyle = toCanvasFillStyle(ctx, fillStyle)
      pic(ctx)
      ctx.fillStyle = old
    }
  }
}
export const strokeStyle = (strokeStyle: FillStyle): Transform => {
  return pic => {
    return ctx => {
      const old = ctx.strokeStyle
      ctx.strokeStyle = toCanvasFillStyle(ctx, strokeStyle)
      pic(ctx)
      ctx.strokeStyle = old
    }
  }
}
export const lineStyle = (style: LineStyle): Transform => {
  return pic => {
    return ctx => {
      applyLineStyle(ctx, style)
      pic(ctx)
    }
  }
}

export const fillAll = (fillStyle: FillStyle): Picture => {
  return ctx => {
    ctx.save()
    ctx.setTransform(1, 0, 0, 1, 0, 0)
    ctx.fillStyle = toCanvasFillStyle(ctx, fillStyle)
    ctx.beginPath()
    ctx.fillRect(0, 0, ctx.canvas.width, ctx.canvas.height)
    ctx.restore()
  }
}
export const image = (imageSource: ImageSource, data?: ImageSourceData): Picture => {
  if (!data) return ctx => ctx.drawImage(imageSource, 0, 0)
  else return ctx => ctx.drawImage(
    imageSource,
    data.sx,
    data.sy,
    data.sWidth,
    data.sHeight,
    0, 0,
    data.sWidth,
    data.sHeight,
  )
}

export const clip = (path: Path): Transform => {
  return pic => {
    return ctx => {
      ctx.save()
      ctx.beginPath()
      path.pic(ctx)
      ctx.clip()
      pic(ctx)
      ctx.restore()
    }
  }
}

export const path = Path.path
export const addPaths = (path1: Path, path2: Path, ...rest: Path[]) => {
  return Path.from([path1, path2, ...rest])
}

/* Utilities */

export const degreesToRadians = (degrees: number) => degrees * Math.PI / 180
export const radiansToDegrees = (radians: number) => radians * 180 / Math.PI

/* Aliases */

export const move = translate
export const moveX = (x: number) => move(x, 0)
export const moveY = (y: number) => move(0, y)
export const sc = (s: number) => scale(s, s)
export const scaleX = (x: number) => scale(x, 1)
export const scaleY = (y: number) => scale(1, y)
export const rot = rotate
export const rotateDeg = (degrees: number) => rotate(degreesToRadians(degrees))
export const rotDeg = rotateDeg
export const skewX = (x: number) => skew(x, 0)
export const skewY = (y: number) => skew(0, y)
export const deg2Rad = degreesToRadians
export const rad2Deg = radiansToDegrees


export * from "./color"
export * from "./gradient"
export * from "./image"
export * from "./path"
export * from "./pattern"
export type * from "./types"

function applyLineStyle(ctx: CanvasRenderingContext2D, lineStyle: LineStyle) {
  if (lineStyle.width !== undefined) ctx.lineWidth = lineStyle.width
  if (lineStyle.cap) ctx.lineCap = lineStyle.cap
  if (lineStyle.join) ctx.lineJoin = lineStyle.join
  if (lineStyle.miterLimit !== undefined) ctx.miterLimit = lineStyle.miterLimit
  if (lineStyle.dash) ctx.setLineDash(lineStyle.dash)
  if (lineStyle.dashOffset !== undefined) ctx.lineDashOffset = lineStyle.dashOffset
}
function toCanvasFillStyle(ctx: CanvasRenderingContext2D, s: FillStyle): CanvasFillStrokeStyles["fillStyle"] {
  if (isColor(s)) return s.toString()
  else if (s instanceof Gradient) return s.getCanvasGradient(ctx)
  else if (s instanceof Pattern) return s.getCanvasPattern(ctx)
  else return s
}