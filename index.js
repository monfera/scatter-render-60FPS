const root = document.createElement('div')
document.body.appendChild(root)

const width = 960
const height = 500

const sampleCount = 1000

const key = [...Array(sampleCount).keys()]
let speedX = key.map(d => 0)
let speedY = key.map(d => 0)
let positionX = key.map(d => width * Math.random())
let positionY = key.map(d => height * Math.random())

const points = key.map((d, i) => document.createElement('span'))

// style
const render = t => {
  speedX = speedX.map(d => d + (Math.random() - 0.5) / 5 - Math.random() * d / 100)
  speedY = speedY.map(d => d + (Math.random() - 0.5) / 5 - Math.random() * d / 100)
  positionX = positionX.map((d, i) => (d + speedX[i] + width) % width)
  positionY = positionY.map((d, i) => (d + speedY[i] + height) % height)
  points.forEach((p, i) => {
    const s = p.style
    s.transform = `translate3d(${positionX[i]}px,${positionY[i]}px,0px)`
  })
}

const loop = t => {
  render(t)
  requestAnimationFrame(loop)
}

loop(0)

// append
points.forEach(p => root.appendChild(p))

