import { ImageSource } from "./types"

export type Repetition = "repeat" | "repeat-x" | "repeat-y" | "no-repeat"
export class Pattern {
  readonly image: ImageSource
  readonly repetition: Repetition
  
  getCanvasPattern(ctx: CanvasRenderingContext2D): CanvasPattern {
    const ptn = ctx.createPattern(this.image,this.repetition)
    if (!ptn) {
      throw new Error("Failed to create pattern: image source is not fully loaded.")
    }
    return ptn
  }

  private constructor(image: ImageSource, repetition: Repetition) {
    this.image = image
    this.repetition = repetition
  }

  static create(image: ImageSource, repetition: Repetition = "repeat") {
    return new Pattern(image,repetition)
  }
}