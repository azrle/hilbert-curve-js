function setupCanvas(canvas) {
    var dpr = window.devicePixelRatio || 1
    var rect = canvas.getBoundingClientRect()
    canvas.width = rect.width * dpr
    canvas.height = rect.height * dpr
    var ctx = canvas.getContext('2d')
    ctx.scale(dpr, dpr)
    return ctx
}

const canvas = document.querySelector('canvas')
const offset = 10
const height = canvas.height = 256 + offset
const width = canvas.width = 256 + offset
const ctx = setupCanvas(canvas)

/*

Hilbert curve unit
* *
| |
*-*

Note:
Yes, we can use index and bit-operation to compute this directly.
However, it might be difficult to understand.

*/
const unit_r = [0, 1, 1, 0]
const unit_c = [0, 0, 1, 1]


let x = offset
let y = offset
let d = 0
let order = 5
let len = 1 << order

ctx.strokeStyle = "#000"
ctx.fillStyle = "#fff"
ctx.fillRect(0, 0, width, height)
ctx.lineCap = "round"
ctx.lineWidth = 1

function animate() {
    d++
    if (d >= len * len) return
    let [r, c] = d2rc(order, d)
    ctx.beginPath()
    ctx.moveTo(x, y)
    x = (width-offset) / len * c + offset
    y = (height-offset) / len * r + offset
    ctx.lineTo(x, y)
    ctx.stroke()

    requestAnimationFrame(animate)
}

animate()

/*

Hilbert Curve Pattern
*-* *-*
 0| |3
*-* *-*
|     |
* *-* *
|1| |2|
*-* *-*

Section 0 is reflection symmetry across left diagonal
Section 3 is reflection symmetry across right diagonal

*/

function d2rc(l, d) {
    l--
    // section, first two bits
    let sec = d >> (l << 1)
    // square length: 2^l = 1<<l
    // total points: 2^(2*l) = 1<<(1<<l)
    let r = unit_r[sec] * (1 << l)
    let c = unit_c[sec] * (1 << l)
    if (l == 0) return [r, c]
    let [y, x] = d2rc(l, d & ((1 << (l << 1)) - 1))
    switch (sec) {
        case 0:
            // left-diag-reflect
            r += x
            c += y
            break
        case 3:
            // right-diag-reflect
            r += (1 << l) - 1 - x
            c += (1 << l) - 1 - y
            break
        default:
            r += y
            c += x
    }
    return [r, c]
}
