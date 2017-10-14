const root = document.createElement('canvas')

const vert = `
    precision mediump float;
    attribute vec2 position;
    void main() {
      gl_Position = vec4(position, 0, 1);
      gl_PointSize = 16.0;
    }`

const frag = `
    #ifdef GL_OES_standard_derivatives
    #extension GL_OES_standard_derivatives : enable
    #endif
    precision lowp float;
    void main() {
      float alpha = 1.0, delta = 0.0;
    
      vec2 pxy = 2.0 * gl_PointCoord.xy - 1.0;
      float dist = length(pxy);
      float fi = atan(pxy.y, pxy.x);

      float r = 1.0;

      float R = dist - r + 1.0;
 
    #ifdef GL_OES_standard_derivatives
      delta = fwidth(dist);
      if(R > 1.0 + delta ) discard; // avoid further calc, blending if possible
      alpha = 1.0 - smoothstep(1.0 - delta, 1.0 + delta, R);
    #else
      if(R > 1.0) discard;
    #endif

      gl_FragColor = vec4(0, 0, 0, alpha);
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

const posAttr = new Float32Array(key.length * 2)

const render = () => {

  regl.frame(({time}) => {

    const t = time * 1000
    speedX = speedX.map(d => d + (Math.random() - 0.5) / 100 - Math.random() * d / 30)
    speedY = speedY.map(d => d + (Math.random() - 0.5) / 100 - Math.random() * d / 30)
    positionX = positionX.map((d, i) => (d + speedX[i] + width) % width)
    positionY = positionY.map((d, i) => (d + speedY[i] + height) % height)

    for(let i = 0; i < key.length; i++) {
      posAttr[i * 2] = 2 * positionX[i] / maxWidth - 1
      posAttr[i * 2 + 1] = -(2 * positionY[i] / maxHeight - 1)
    }

    regl({
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
        position: posAttr
      },
      count: key.length,
      primitive: 'points'
    })()

    fps.innerText = Math.round(1000 / (t - lastT)) + ' FPS'
    lastT = t
  })
}

render()