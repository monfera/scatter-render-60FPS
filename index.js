const root = document.createElement('canvas')

const vert = `
    precision mediump float;
    attribute vec2 position;
    void main() {
      gl_Position = vec4(position, 0, 1);
      gl_PointSize = 16.0;
    }`

const frag = `
    precision lowp float;
    void main() {
      float dist = length(2.0 * gl_PointCoord.xy - 1.0);
      if(dist > 1.0) discard;
      gl_FragColor = vec4(0, 0, 0, 1);
    }`

const dpr = window.devicePixelRatio // for svg/html parity in resolution

const maxWidth = 1000
const maxHeight = 600

root.setAttribute('width', maxWidth * dpr)
root.setAttribute('height', maxHeight * dpr)
root.style.width = maxWidth + 'px'
root.style.height = maxHeight + 'px'

const regl = window.createREGL(root)

document.body.appendChild(root)

const fps = document.createElement('p')
document.body.appendChild(fps);

const specWidth = 960
const specHeight = 500

const specSampleCount = 2250
const gridPitch = Math.sqrt(specWidth * specHeight / specSampleCount);
const columns = Math.floor(specWidth / gridPitch)
const rows = Math.floor(specSampleCount / columns)
const sampleCount = columns * rows
const griddedWidth = columns * gridPitch
const griddedHeight = rows * gridPitch
const width = griddedWidth + gridPitch
const height = griddedHeight + gridPitch

const key = [...Array(sampleCount).keys()]
let speedX = key.map(d => 0)
let speedY = key.map(d => 0)
let positionX = key.map((d, i) => gridPitch / 2 + (i % columns) / columns * griddedWidth)
let positionY = key.map((d, i) => gridPitch / 2 + (i - (i % columns)) / columns / rows * griddedHeight)

let lastT = 0

const render = () => {

  regl.frame(({time}) => {

    const t = time * 1000
    speedX = speedX.map(d => d + (Math.random() - 0.5) / 100 - Math.random() * d / 30)
    speedY = speedY.map(d => d + (Math.random() - 0.5) / 100 - Math.random() * d / 30)
    positionX = positionX.map((d, i) => (d + speedX[i] + width) % width)
    positionY = positionY.map((d, i) => (d + speedY[i] + height) % height)

    const posAttr = []
    for(let i = 0; i < key.length; i++) {
      posAttr.push(2 * positionX[i] / maxWidth - 1)
      posAttr.push(2 * positionY[i] / maxHeight - 1)
    }

    regl({
      vert,
      frag,
      attributes: {
        position: posAttr
      },
      count: key.length,
      primitive: 'points',
      lineWidth: 2,
      elements: key
    })()

    fps.innerText = Math.round(1000 / (t - lastT)) + ' FPS'
    lastT = t
  })
}

render()