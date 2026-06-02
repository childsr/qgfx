import { Picture } from "./types"

interface IPath {
  arc(x: number, y: number, radius: number, startAngle: number, endAngle: number, counterclockwise?: boolean): IPath
  arcTo(x1: number, y1: number, x2: number, y2: number, radius: number): IPath
  bezierCurveTo(cp1x: number, cp1y: number, cp2x: number, cp2y: number, x: number, y: number): IPath
  closePath(): IPath
  ellipse(x: number, y: number, radiusX: number, radiusY: number, rotation: number, startAngle: number, endAngle: number, counterclockwise?: boolean): IPath
  lineTo(x: number, y: number): IPath
  moveTo(x: number, y: number): IPath
  quadraticCurveTo(cpx: number, cpy: number, x: number, y: number): IPath
  rect(x: number, y: number, w: number, h: number): IPath
  roundRect(x: number, y: number, w: number, h: number, radii?: number | DOMPointInit | (number | DOMPointInit)[]): IPath
}
type CommandName = keyof IPath
type Command<N extends CommandName = CommandName> = [N,Parameters<IPath[N]>]
type CommandStack = null | [Command,CommandStack]

export class Path implements IPath {
  private readonly commands: CommandStack
  private _pic?: Picture
  private _cmdsArr?: Command[]
  private get cmdsArr(): Command[] {
    if (!this._cmdsArr) {
      let stack = this.commands
      const cmdsArr = []
      while (stack !== null) {
        cmdsArr.unshift(stack[0])
        stack = stack[1]
      }
      this._cmdsArr = cmdsArr
    }
    return this._cmdsArr
  }

  constructor(commands: CommandStack = null) {
    this.commands = commands
  }
  
  arc(x: number, y: number, radius: number, startAngle: number, endAngle: number, counterclockwise?: boolean) {
    return new Path([["arc",[x,y,radius,startAngle,endAngle,counterclockwise]],this.commands])
  }
  arcTo(x1: number, y1: number, x2: number, y2: number, radius: number) {
    return new Path([["arcTo",[x1,y1,x2,y2,radius]],this.commands])
  }
  bezierCurveTo(cp1x: number, cp1y: number, cp2x: number, cp2y: number, x: number, y: number) {
    return new Path([["bezierCurveTo",[cp1x,cp1y,cp2x,cp2y,x,y]],this.commands])
  }
  closePath() {
    return new Path([["closePath",[]],this.commands])
  }
  ellipse(x: number, y: number, radiusX: number, radiusY: number, rotation: number, startAngle: number, endAngle: number, counterclockwise?: boolean) {
    return new Path([["ellipse",[x,y,radiusX,radiusY,rotation,startAngle,endAngle,counterclockwise]],this.commands])
  }
  lineTo(x: number, y: number) {
    return new Path([["lineTo",[x,y]],this.commands])
  }
  moveTo(x: number, y: number) {
    return new Path([["moveTo",[x,y]],this.commands])
  }
  quadraticCurveTo(cpx: number, cpy: number, x: number, y: number) {
    return new Path([["quadraticCurveTo",[cpx,cpy,x,y]],this.commands])
  }
  rect(x: number, y: number, w: number, h: number) {
    return new Path([["rect",[x,y,w,h]],this.commands])
  }
  roundRect(x: number, y: number, w: number, h: number, radii?: number | DOMPointInit | (number | DOMPointInit)[]) {
    return new Path([["roundRect",[x,y,w,h,radii]],this.commands])
  }

  get pic(): Picture {
    if (!this._pic) {
      const cmds = this.cmdsArr
      this._pic = ctx => {
        for (let i = 0; i < cmds.length; i++) {
          ;(ctx[cmds[i][0]] as any)(...(cmds[i][1] as any[]))
        }
      }
    }
    return this._pic
  }
  
  static from(paths: Path[]): Path {
    let cmds: Command[] = []
    for (let i = 0; i < paths.length; i++) {
      const cmdsArr = paths[i].cmdsArr
      for (let i = 0; i < cmdsArr.length; i++) {
        cmds.push(cmdsArr[i])
      }
    }
    let cmdStack: CommandStack = null
    for (let i = cmds.length - 1; i >= 0; i--) {
      cmdStack = [cmds[i], cmdStack]
    }
    return new Path(cmdStack)
  }
}