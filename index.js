const root = document.createElement('canvas')

const vert = `
    precision mediump float;
    attribute vec2 position;
    void main() {
      gl_Position = vec4(position, 0, 1);
      gl_PointSize = 1.0;
    }`

const frag = `
    #ifdef GL_OES_standard_derivatives
    #extension GL_OES_standard_derivatives : enable
    #endif
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

const regl = window.createREGL({canvas: root, extensions: ['OES_standard_derivatives']})

document.body.appendChild(root)

const fps = document.createElement('p')
document.body.appendChild(fps);

const specWidth = 960
const specHeight = 500

const specSampleCount = 1000000
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

let lastT = 0


const magic = regl({
  vert,
  frag,
  blend: {
    enable: true,
    func: {
      srcRGB: 'src alpha',
      srcAlpha: 1,
      dstRGB: 'one minus src alpha',
      dstAlpha: 1
    },
    equation: {
      rgb: 'add',
      alpha: 'add'
    },
    color: [0, 0, 0, 0]
  },

  depth: {
    enable: false
  },

  attributes: {
    position: regl.prop('position')
  },

  count: key.length,
  primitive: 'points'
})

const posAttro = new Float32Array(key.length * 2).map((d, ii) => {
  const yEh = ii % 2
  const i = ii - yEh
  return yEh ? -(2 * positionY[i] / maxHeight - 1) : 2 * positionX[i] / maxWidth - 1
})

const posAttr = new Float32Array(key.length * 2)

const render = () => {

  regl.frame(({time}) => {

    const t = time * 1000

    for(let i = 0; i < key.length * 2; i++) {
      posAttr[i] = posAttro[i] + (time / 100) % 0.01
    }

    magic({
      position: posAttr
    })

    fps.innerText = Math.round(1000 / (t - lastT)) + ' FPS'
    lastT = t
  })
}

render()