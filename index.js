const root = document.createElement('canvas')
const ctx = root.getContext('2d')

const dpr = window.devicePixelRatio // for svg/html parity in resolution

const maxWidth = 1000
const maxHeight = 600

root.setAttribute('width', maxWidth * dpr)
root.setAttribute('height', maxHeight * dpr)
root.style.width = maxWidth + 'px'
root.style.height = maxHeight + 'px'

document.body.appendChild(root)

const fps = document.createElement('p')
document.body.appendChild(fps);

const specWidth = 960
const specHeight = 500

const specSampleCount = 2200
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

const render = t => {
  speedX = speedX.map(d => d + (Math.random() - 0.5) / 100 - Math.random() * d / 30)
  speedY = speedY.map(d => d + (Math.random() - 0.5) / 100 - Math.random() * d / 30)
  positionX = positionX.map((d, i) => (d + speedX[i] + width) % width)
  positionY = positionY.map((d, i) => (d + speedY[i] + height) % height)
  ctx.clearRect(0, 0, maxWidth * dpr, maxHeight * dpr)
  key.forEach((p, i) => {
    ctx.beginPath()
    ctx.arc(positionX[i] * dpr, positionY[i] * dpr, 4 * dpr, 0, 2 * Math.PI)
    ctx.fill()
  })
  fps.innerText = Math.round(1000 / (t - lastT)) + ' FPS'
  lastT = t
}

const loop = t => {
  render(t)
  requestAnimationFrame(loop)
}

loop(0)