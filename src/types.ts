import { Gradient } from "./gradient"
import { Pattern } from "./pattern"

export type Picture = (ctx: CanvasRenderingContext2D) => void
export type Transform = (pic: Picture) => Picture

export type MatrixArray = [a: number, b: number, c: number, d: number, e: number, f: number]
export type Matrix = MatrixArray | DOMMatrix

export type FillStyle =
  | string
  | Color
  | Gradient
  | Pattern
  | CanvasGradient
  | CanvasPattern
export type LineStyle = Partial<{
  width: number
  cap: CanvasLineCap
  join: CanvasLineJoin
  dash: number[]
  dashOffset: number
  miterLimit: number
}>

export type ImageSource = CanvasImageSource
export type ImageSourceData = {
  sx: number
  sy: number
  sWidth: number
  sHeight: number
}

export type ShadowOptions = Partial<{
  color: string | Color
  blur: number
  offsetX: number
  offsetY: number
}>

export type FontOptions = {
  size: string
  family: string
  color?: string
  style?: string
  weight?: string
  variant?: string
  lineHeight?: string
}
export interface Color {
  /** 0 - 255 */
  readonly r: number
  /** 0 - 255 */
  readonly g: number
  /** 0 - 255 */
  readonly b: number

  /** 0 - 360 */
  readonly h: number
  /** 0 - 100 */
  readonly s: number
  /** 0 - 100 */
  readonly l: number

  /** 0 - 1 */
  readonly a: number

  /**
   * Rotates the hue of the color by the specified degrees. Positive values
   * rotate clockwise, negative values rotate counter-clockwise.
   *
   * @param rotDegrees - The number of degrees to rotate the hue.
   */
  hueRotate(rotDegrees: number): Color
  /**
   * Saturates or desaturates the color by the specified percentage. Values
   * less than 100% desaturate the color, values greater than 100% saturate it.
   *
   * @param percentage - The percentage to saturate the color by.
   */
  saturate(percentage: number): Color
  /**
   * Lightens or darkens the color according to the specified percentage.
   * Values less than 100% darken the color, values greater than 100% lighten it.
   *
   * @param percentage - The percentage to lighten the color by.
   */
  lighten(percentage: number): Color

  /**
   * Returns a string assignable to ctx.fillStyle and ctx.strokeStyle
   */
  toString(): string
}
