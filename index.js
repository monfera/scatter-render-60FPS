const root = document.createElement('div')
document.body.appendChild(root)

const specWidth = 960
const specHeight = 500

const specSampleCount = 700
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

const points = key.map((d, i) => document.createElement('span'))
points.forEach((p, i) => p.style.backgroundColor = `rgba(0,0,0,${Math.pow(Math.min(1 - Math.abs(positionX[i] - griddedWidth / 2) / (width / 2), 1 - Math.abs(positionY[i] - griddedHeight / 2) / (height / 2)), 1.5)})`)

// style
const render = t => {
  speedX = speedX.map(d => d + (Math.random() - 0.5) / 2 - Math.random() * d / 30)
  speedY = speedY.map(d => d + (Math.random() - 0.5) / 2 - Math.random() * d / 30)
  positionX = positionX.map((d, i) => (d + speedX[i] + width) % width)
  positionY = positionY.map((d, i) => (d + speedY[i] + height) % height)
  points.forEach((p, i) => {
    const s = p.style
    s.transform = `translate(${positionX[i]}px,${positionY[i]}px)`
  })
}

const loop = t => {
  render(t)
  requestAnimationFrame(loop)
}

loop(0)

// append
points.forEach(p => root.appendChild(p))

