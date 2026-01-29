import './style.css'
import Experience from './Experience/Experience.ts'

// Initialize the Experience with the canvas element
const canvas = document.querySelector<HTMLCanvasElement>('canvas.webgl')

if (canvas) {
  new Experience(canvas)
} else {
  console.error('Canvas element not found!')
}
