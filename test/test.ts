import * as q from "../src/index"
import { Picture, Transform } from "../src/types"

const canvas = document.getElementById("canvas") as HTMLCanvasElement
const ctx = canvas.getContext("2d")!

function resize() {
  canvas.width = window.innerWidth
  canvas.height = window.innerHeight
  draw()
}


async function draw() {
  const w = canvas.width
  const h = canvas.height
  
  const gen = (n: number, pic: Picture) => q.overlay(
    Array(n).fill(null).map(() => (
      (q.translate(w*Math.random(),h*Math.random()) (pic))
    ))
  )

  function imageTest() {
    const img = q.image(document.querySelector("img")!)
    const smiley = (
      (q.scale(0.25,0.25)
        (img))
    )
    const smileys = gen(1e4,smiley)
    return smileys
  }
  function dotsTest() {
    const dot = (
      (q.scale(5,5)
        (q.circle))
    )
    const blueDot = (
      (q.scale(5,5)
        (q.fill("blue")
          (q.circle)))
    )
    const n = 1e3
    const dotsPath = (() => {
      let p = q.path
      for (let i = 0; i < n; i++) {
        let [x,y] = [w*Math.random(),h*Math.random()]
        p = p
          .moveTo(x,y)
          .arc(x,y,5,0,2*Math.PI)
      }
      return p.pic
    })()
    const test1 = q.fill ("blue") (gen (n,dot))
    const test2 = gen (n, q.fill ("blue") (dot))
    const test3 = gen (n, blueDot)
    const test4 = q.fill("blue") (dotsPath)
    return test2
  }
  function textTest() {
    return (
      (q.fillStyle (q.css.white)
        (q.move (100,100)
          (q.strokeText("Hello World", "30px monospace"))))
    )
  }
  function starTest() {
    const star =
      q.path
       .moveTo(0,-50)
       .lineTo(14.43,-15.45)
       .lineTo(47.55,-15.45)
       .lineTo(23.56,5.9)
       .lineTo(29.39,40.45)
       .lineTo(0,20)
       .lineTo(-29.39,40.45)
       .lineTo(-23.56,5.9)
       .lineTo(-47.55,-15.45)
       .lineTo(-14.43,-15.45)
       .closePath()
       .pic
    return (
      (q.move(w/2,h/2)
        (q.sc(3)
          (q.shadow({ color: "black", blur: 0, offsetX: 50, offsetY: 4 })
            (q.fill(q.css.yellow)
              (star)))))
    )
  }

  const base: Transform = pic => (
    (q.translate (w/2,h/2)
      (q.scale(1,-1)
        (pic)))
  )

  const p = q.path
    .lineTo(100,0)
    .bezierCurveTo(100,20,80,30,70,40)
    .lineTo(10,0)
    .closePath()
  const pic0 = (
    (q.clip (p)
      (q.fillAll ("red")))
  )
  const pic = q.mirrorX(pic0)

  const scene = q.overlay([
    q.fillAll("#4e4e4e"),
    // base (pic)
    // dotsTest()
    // textTest()
    starTest()
  ])

  console.time("Rendering time")
  ctx.save()
  scene(ctx)
  ctx.restore()
  console.timeEnd("Rendering time")
}

window.addEventListener("resize", resize)
resize()

Object.assign(window, { q, ctx })