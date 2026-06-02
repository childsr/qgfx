import { Color } from "./types"

export type ColorStop = [number, string | Color]
type GradientType =
  | ["conic", startAngle: number, x: number, y: number]
  | ["linear", x0: number, y0: number, x1: number, y1: number]
  | ["radial", x0: number, y0: number, r0: number, x1: number, y1: number, r1: number]
interface GradientDesc {
  readonly type: GradientType
  readonly colorStops: ColorStop[]
}

export class Gradient {
  private desc: GradientDesc
  private _canvasGradient?: CanvasGradient

  getCanvasGradient(ctx: CanvasRenderingContext2D): CanvasGradient {
    if (!this._canvasGradient) {
      let canvasGradient: CanvasGradient
      if (this.desc.type[0] === "conic") {
        const [, startAngle, x, y] = this.desc.type
        canvasGradient = ctx.createConicGradient(startAngle,x,y)
      }
      else if (this.desc.type[0] === "linear") {
        const [, x0, y0, x1, y1] = this.desc.type
        canvasGradient = ctx.createLinearGradient(x0,y0,x1,y1)
      }
      else {
        const [, x0, y0, r0, x1, y1, r1] = this.desc.type
        canvasGradient = ctx.createRadialGradient(x0,y0,r0,x1,y1,r1)
      }
      for (const [offset, color] of this.desc.colorStops) {
        canvasGradient.addColorStop(offset, color.toString())
      }
      this._canvasGradient = canvasGradient
    }
    return this._canvasGradient
  }

  private constructor(desc: GradientDesc) {
    this.desc = desc
  }

  addColorStops(...colorStops: ColorStop[]): Gradient {
    return new Gradient({
      type: this.desc.type,
      colorStops: [...this.desc.colorStops,...colorStops]
    })
  }

  static conic(startAngle: number, x: number, y: number, colorStops: [number, string | Color][]): Gradient {
    return new Gradient({
      type: ["conic", startAngle, x, y],
      colorStops
    })
  }
  static linear(x0: number, y0: number, x1: number, y1: number, colorStops: [number, string | Color][]): Gradient {
    return new Gradient({
      type: ["linear", x0, y0, x1, y1],
      colorStops
    })
  }
  static radial(x0: number, y0: number, r0: number, x1: number, y1: number, r1: number, colorStops: [number, string | Color][]): Gradient {
    return new Gradient({
      type: ["radial", x0, y0, r0, x1, y1, r1],
      colorStops
    })
  }
}
