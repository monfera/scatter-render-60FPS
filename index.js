const root = document.createElement('canvas')

const vert = `
    precision lowp float;
    attribute vec2 positionFrom;
    attribute vec2 positionTo;
    uniform float tween;
    void main() {
      gl_Position = vec4(mix(positionFrom, positionTo, tween), 0, 1);
      gl_PointSize = 1.0;
    }`

const frag = `
    precision lowp float;
    void main() {
      gl_FragColor = vec4(0, 0, 0, 1);
    }`

const dpr = window.devicePixelRatio // for svg/html parity in resolution

const maxWidth = 1000
const maxHeight = 600

root.setAttribute('width', maxWidth * dpr)
root.setAttribute('height', maxHeight * dpr)
root.style.width = maxWidth + 'px'
root.style.height = maxHeight + 'px'

const regl = window.createREGL({canvas: root})

document.body.appendChild(root)

const fps = document.createElement('p')
document.body.appendChild(fps);

const specWidth = 960
const specHeight = 500

const specSampleCount = 1500000
const gridPitch = Math.sqrt(specWidth * specHeight / specSampleCount);
const columns = Math.floor(specWidth / gridPitch)
const rows = Math.floor(specSampleCount / columns)
const sampleCount = columns * rows
const griddedWidth = columns * gridPitch
const griddedHeight = rows * gridPitch
const width = griddedWidth + gridPitch
const height = griddedHeight + gridPitch

const key = [...Array(sampleCount).keys()]
let positionX = key.map((d, i) => gridPitch / 2 + (i % columns) / columns * griddedWidth)
let positionY = key.map((d, i) => gridPitch / 2 + (i - (i % columns)) / columns / rows * griddedHeight)
let positionZ = key.map((d, i) => Math.random())

let firstT = null
let frameCount = 0

const posAttro = new Float32Array(key.length * 2).map((d, ii) => {
  const yEh = ii % 2
  const i = ii - yEh
  return yEh ? -(2 * positionY[i] / maxHeight - 1) : 2 * positionX[i] / maxWidth - 1
})

const posAttrd = new Float32Array(key.length * 2).map(() => Math.random() * 2 - 1)


const magic = regl({
  vert,
  frag,
  blend: {
    enable: false
  },

  depth: {
    enable: false
  },

  attributes: {
    positionFrom: posAttro,
    positionTo: posAttrd
  },

  uniforms: {
    tween: regl.prop('tween')
  },

  count: key.length,
  primitive: 'points'
})

const render = () => {

  regl.frame(({time}) => {

    const t = time * 1000

    magic({
      tween: 0.01 * Math.pow(Math.sin(time * 2), 2)
    })

    firstT = firstT || t

    frameCount++

    fps.innerText = Math.ceil(1000 / ((t - firstT) / frameCount)) + ' FPS'

  })
}

render()