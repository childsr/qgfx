import { Color } from "./types"

class RGBColor implements Color {
  private _hsl: [number,number,number] | null = null

  readonly r: number
  readonly g: number
  readonly b: number
  
  get h(): number {
    if (!this._hsl) {
      this._hsl = rgb2hsl(this.r,this.g,this.b)
    }
    return this._hsl[0]
  }
  get s(): number {
    if (!this._hsl) {
      this._hsl = rgb2hsl(this.r,this.g,this.b)
    }
    return this._hsl[1]
  }
  get l(): number {
    if (!this._hsl) {
      this._hsl = rgb2hsl(this.r,this.g,this.b)
    }
    return this._hsl[2]
  }
  
  readonly a: number

  hueRotate(rotDegrees: number): Color {
    return new HSLColor(
      this.h + rotDegrees,
      this.s,
      this.l,
      this.a
    )
  }
  saturate(percentage: number): Color {
    const multiplier = percentage / 100
    return new HSLColor(this.h,multiplier*this.s,this.l,this.a)
  }
  lighten(percentage: number): Color {
    const multiplier = percentage / 100
    return new HSLColor(this.h,this.s,multiplier*this.l,this.a)
  }

  toString(): string {
    return `rgba(${this.r},${this.g},${this.b},${this.a})`
  }

  constructor(r: number, g: number, b: number, a: number = 1) {
    this.r = r
    this.g = g
    this.b = b
    this.a = a
  }
}
class HSLColor implements Color {
  private _rgb: [number,number,number] | null = null
  
  get r(): number {
    if (!this._rgb) {
      this._rgb = hsl2rgb(this.h,this.s,this.l)
    }
    return this._rgb[0]
  }
  get g(): number {
    if (!this._rgb) {
      this._rgb = hsl2rgb(this.h,this.s,this.l)
    }
    return this._rgb[1]
  }
  get b(): number {
    if (!this._rgb) {
      this._rgb = hsl2rgb(this.h,this.s,this.l)
    }
    return this._rgb[2]
  }

  readonly h: number
  readonly s: number
  readonly l: number
  
  readonly a: number

  hueRotate(rotDegrees: number): Color {
    return new HSLColor(
      this.h + rotDegrees,
      this.s,
      this.l,
      this.a
    )
  }
  saturate(percentage: number): Color {
    const multiplier = percentage / 100
    return new HSLColor(this.h,multiplier*this.s,this.l,this.a)
  }
  lighten(percentage: number): Color {
    const multiplier = percentage / 100
    return new HSLColor(this.h,this.s,multiplier*this.l,this.a)
  }

  constructor(h: number, s: number, l: number, a: number = 1) {
    this.h = h
    this.s = s
    this.l = l
    this.a = a
  }
}

function rgb2hsl(r: number, g: number, b: number): [number,number,number] {
  // Normalize to 0-1 range
  const rNorm = r / 255
  const gNorm = g / 255
  const bNorm = b / 255

  const max = Math.max(rNorm, gNorm, bNorm)
  const min = Math.min(rNorm, gNorm, bNorm)
  const delta = max - min

  // Lightness is average of max and min
  const l = (max + min) / 2 * 100

  // Achromatic (no saturation)
  if (delta === 0) {
    return [0, 0, l]
  }

  // Saturation
  let s: number
  if (l < 50) {
    s = (delta / (max + min)) * 100
  } else {
    s = (delta / (2 - max - min)) * 100
  }

  // Hue
  let h: number
  if (max === rNorm) {
    h = ((gNorm - bNorm) / delta + (gNorm < bNorm ? 6 : 0)) * 60
  } else if (max === gNorm) {
    h = ((bNorm - rNorm) / delta + 2) * 60
  } else {
    h = ((rNorm - gNorm) / delta + 4) * 60
  }

  return [h, s, l]
}
function hsl2rgb(h: number, s: number, l: number): [number,number,number] {
  // Normalize to 0-1 range
  const sNorm = s / 100
  const lNorm = l / 100

  // Achromatic (no saturation)
  if (sNorm === 0) {
    const gray = Math.round(lNorm * 255)
    return [gray, gray, gray]
  }

  // Calculate chroma
  const chroma = (1 - Math.abs(2 * lNorm - 1)) * sNorm

  // Find the hue sector (0-5)
  const hNorm = h / 360
  const x = chroma * (1 - Math.abs((hNorm * 6) % 2 - 1))

  let rPrime: number, gPrime: number, bPrime: number

  if (hNorm < 1/6) {
    [rPrime, gPrime, bPrime] = [chroma, x, 0]
  } else if (hNorm < 2/6) {
    [rPrime, gPrime, bPrime] = [x, chroma, 0]
  } else if (hNorm < 3/6) {
    [rPrime, gPrime, bPrime] = [0, chroma, x]
  } else if (hNorm < 4/6) {
    [rPrime, gPrime, bPrime] = [0, x, chroma]
  } else if (hNorm < 5/6) {
    [rPrime, gPrime, bPrime] = [x, 0, chroma]
  } else {
    [rPrime, gPrime, bPrime] = [chroma, 0, x]
  }

  // Calculate lightness shift
  const m = lNorm - chroma / 2

  // Convert to 0-255 range
  const r = Math.round((rPrime + m) * 255)
  const g = Math.round((gPrime + m) * 255)
  const b = Math.round((bPrime + m) * 255)

  return [r, g, b]
}
function hex2rgb(hex: string): [number, number, number, number] {
  // Remove the hash if it exists
  let cleanHex = hex.replace(/^#/, "")

  // Ensure it is a valid hex code before parsing. If it's not valid, return black.
  if (/^([0-9A-Fa-f]{3}|[0-9A-Fa-f]{4}|[0-9A-Fa-f]{6}|[0-9A-Fa-f]{8})$/.test(hex)) {
    return [0,0,0,1]
  }

  // Expand shorthand forms (e.g., "03F" -> "0033FF", "03FA" -> "0033FFAA")
  if (cleanHex.length === 3 || cleanHex.length === 4) {
    cleanHex = cleanHex.split("").map(char => char + char).join("")
  }

  // Parse Red, Green, and Blue values
  const r = parseInt(cleanHex.substring(0, 2), 16)
  const g = parseInt(cleanHex.substring(2, 4), 16)
  const b = parseInt(cleanHex.substring(4, 6), 16)

  // Parse Alpha value if present (8-digit hex)
  let a = 1
  if (cleanHex.length === 8) {
    const alphaInt = parseInt(cleanHex.substring(6, 8), 16)
    // Convert 0-255 to 0-1 and round to 4 decimal places to avoid floating point artifacts
    a = Math.round((alphaInt / 255) * 10000) / 10000
  }

  return [r, g, b, a]
}

/**
 * Create a color from the red, green, and blue components.
 * 
 * @param r - Red component (0-255)
 * @param g - Green component (0-255)
 * @param b - Blue component (0-255)
 */
export function rgb(r: number, g: number, b: number): Color {
  return new RGBColor(r,g,b)
}
/**
 * Create a color from the red, green, blue, and alpha components.
 * 
 * @param r - Red component (0-255)
 * @param g - Green component (0-255)
 * @param b - Blue component (0-255)
 * @param a - Alpha component (0-1)
 */
export function rgba(r: number, g: number, b: number, a: number): Color {
  return new RGBColor(r,g,b,a)
}
/**
 * Create a color from the hue, saturation, and lightness components.
 * 
 * @param h - Hue component (0-360)
 * @param s - Saturation component (0-100)
 * @param l - Lightness component (0-100)
 */
export function hsl(h: number, s: number, l: number): Color {
  return new HSLColor(h,s,l)
}
/**
 * Create a color from the hue, saturation, lightness, and alpha components.
 *
 * @param h - Hue component (0-360)
 * @param s - Saturation component (0-100)
 * @param l - Lightness component (0-100)
 * @param a - Alpha component (0-1)
 */
export function hsla(h: number, s: number, l: number, a: number): Color {
  return new HSLColor(h,s,l,a)
}
/**
 * Create a color from a CSS hex color string.
 * Supports #RGB, #RGBA, #RRGGBB, and #RRGGBBAA formats ('#' is optional).
 */
export function hex(hexCode: string): Color {
  return new RGBColor(...hex2rgb(hexCode))
}
/** CSS named colors. */
export const css = {
  maroon: rgb (128,0,0),
  red: rgb (255,0,0),
  orange: rgb (255,165,0),
  yellow: rgb (255,255,0),
  olive: rgb (128,128,0),
  green: rgb (0,128,0),
  purple: rgb (128,0,128),
  fuchsia: rgb (255,0,255),
  lime: rgb (0,255,0),
  teal: rgb (0,128,128),
  aqua: rgb (0,255,255),
  blue: rgb (0,0,255),
  navy: rgb (0,0,128),
  black: rgb (0,0,0),
  gray: rgb (128,128,128),
  silver: rgb (192,192,192),
  white: rgb (255,255,255),
  indianred: rgb (205,92,92),
  lightcoral: rgb (240,128,128),
  salmon: rgb (250,128,114),
  darksalmon: rgb (233,150,122),
  lightsalmon: rgb (255,160,122),
  crimson: rgb (220,20,60),
  firebrick: rgb (178,34,34),
  darkred: rgb (139,0,0),
  pink: rgb (255,192,203),
  lightpink: rgb (255,182,193),
  hotpink: rgb (255,105,180),
  deeppink: rgb (255,20,147),
  mediumvioletred: rgb (199,21,133),
  palevioletred: rgb (219,112,147),
  coral: rgb (255,127,80),
  tomato: rgb (255,99,71),
  orangered: rgb (255,69,0),
  darkorange: rgb (255,140,0),
  gold: rgb (255,215,0),
  lightyellow: rgb (255,255,224),
  lemonchiffon: rgb (255,250,205),
  lightgoldenrodyellow: rgb (250,250,210),
  papayawhip: rgb (255,239,213),
  moccasin: rgb (255,228,181),
  peachpuff: rgb (255,218,185),
  palegoldenrod: rgb (238,232,170),
  khaki: rgb (240,230,140),
  darkkhaki: rgb (189,183,107),
  lavender: rgb (230,230,250),
  thistle: rgb (216,191,216),
  plum: rgb (221,160,221),
  violet: rgb (238,130,238),
  orchid: rgb (218,112,214),
  magenta: rgb (255,0,255),
  mediumorchid: rgb (186,85,211),
  mediumpurple: rgb (147,112,219),
  blueviolet: rgb (138,43,226),
  darkviolet: rgb (148,0,211),
  darkorchid: rgb (153,50,204),
  darkmagenta: rgb (139,0,139),
  rebeccapurple: rgb (102,51,153),
  indigo: rgb (75,0,130),
  mediumslateblue: rgb (123,104,238),
  slateblue: rgb (106,90,205),
  darkslateblue: rgb (72,61,139),
  greenyellow: rgb (173,255,47),
  chartreuse: rgb (127,255,0),
  lawngreen: rgb (124,252,0),
  limegreen: rgb (50,205,50),
  palegreen: rgb (152,251,152),
  lightgreen: rgb (144,238,144),
  mediumspringgreen: rgb (0,250,154),
  springgreen: rgb (0,255,127),
  mediumseagreen: rgb (60,179,113),
  seagreen: rgb (46,139,87),
  forestgreen: rgb (34,139,34),
  darkgreen: rgb (0,100,0),
  yellowgreen: rgb (154,205,50),
  olivedrab: rgb (107,142,35),
  darkolivegreen: rgb (85,107,47),
  mediumaquamarine: rgb (102,205,170),
  darkseagreen: rgb (143,188,143),
  lightseagreen: rgb (32,178,170),
  darkcyan: rgb (0,139,139),
  cyan: rgb (0,255,255),
  lightcyan: rgb (224,255,255),
  paleturquoise: rgb (175,238,238),
  aquamarine: rgb (127,255,212),
  turquoise: rgb (64,224,208),
  mediumturquoise: rgb (72,209,204),
  darkturquoise: rgb (0,206,209),
  cadetblue: rgb (95,158,160),
  steelblue: rgb (70,130,180),
  lightsteelblue: rgb (176,196,222),
  powderblue: rgb (176,224,230),
  lightblue: rgb (173,216,230),
  skyblue: rgb (135,206,235),
  lightskyblue: rgb (135,206,250),
  deepskyblue: rgb (0,191,255),
  dodgerblue: rgb (30,144,255),
  cornflowerblue: rgb (100,149,237),
  royalblue: rgb (65,105,225),
  mediumblue: rgb (0,0,205),
  darkblue: rgb (0,0,139),
  midnightblue: rgb (25,25,112),
  cornsilk: rgb (255,248,220),
  blanchedalmond: rgb (255,235,205),
  bisque: rgb (255,228,196),
  navajowhite: rgb (255,222,173),
  wheat: rgb (245,222,179),
  burlywood: rgb (222,184,135),
  tan: rgb (210,180,140),
  rosybrown: rgb (188,143,143),
  sandybrown: rgb (244,164,96),
  goldenrod: rgb (218,165,32),
  darkgoldenrod: rgb (184,134,11),
  peru: rgb (205,133,63),
  chocolate: rgb (210,105,30),
  saddlebrown: rgb (139,69,19),
  sienna: rgb (160,82,45),
  brown: rgb (165,42,42),
  snow: rgb (255,250,250),
  honeydew: rgb (240,255,240),
  mintcream: rgb (245,255,250),
  azure: rgb (240,255,255),
  aliceblue: rgb (240,248,255),
  ghostwhite: rgb (248,248,255),
  whitesmoke: rgb (245,245,245),
  seashell: rgb (255,245,238),
  beige: rgb (245,245,220),
  oldlace: rgb (253,245,230),
  floralwhite: rgb (255,250,240),
  ivory: rgb (255,255,240),
  antiquewhite: rgb (250,235,215),
  linen: rgb (250,240,230),
  lavenderblush: rgb (255,240,245),
  mistyrose: rgb (255,228,225),
  gainsboro: rgb (220,220,220),
  lightgray: rgb (211,211,211),
  lightgrey: rgb (211,211,211),
  darkgray: rgb (169,169,169),
  darkgrey: rgb (169,169,169),
  grey: rgb (128,128,128),
  dimgray: rgb (105,105,105),
  dimgrey: rgb (105,105,105),
  lightslategray: rgb (119,136,153),
  lightslategrey: rgb (119,136,153),
  slategray: rgb (112,128,144),
  slategrey: rgb (112,128,144),
  darkslategray: rgb (47,79,79),
  darkslategrey: rgb (47,79,79)
}

export const isColor = (c: any): c is Color => c instanceof RGBColor || c instanceof HSLColor
