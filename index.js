const root = document.createElement('canvas')

const vert = `
    precision mediump float;
    attribute float positionX;
    attribute float positionY;
    void main() {
      gl_Position = vec4(positionX, positionY, 0, 1);
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

const specSampleCount = 500000
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
    positionX: regl.prop('positionX'),
    positionY: regl.prop('positionY')
  },

  count: key.length,
  primitive: 'points'
})

const posAttrXo = new Float32Array(key.length).map((d, i) => 2 * positionX[i] / maxWidth - 1)
const posAttrYo = new Float32Array(key.length).map((d, i) => -(2 * positionY[i] / maxHeight - 1))

const posAttrX = new Float32Array(key.length)
const posAttrY = new Float32Array(key.length)

const tau = 2 * Math.PI

const render = () => {

  regl.frame(({time}) => {

    const t = time * 1000

    for(let i = 0; i < key.length; i++) {
      posAttrX[i] = posAttrXo[i] + Math.sin(time % tau) / 1000
    }

    for(let i = 0; i < key.length; i++) {
      posAttrY[i] = posAttrYo[i] + Math.cos(time % tau) / 1000
    }

    magic({
      positionX: posAttrX,
      positionY: posAttrY
    })

    fps.innerText = Math.round(1000 / (t - lastT)) + ' FPS'
    lastT = t
  })
}

render()