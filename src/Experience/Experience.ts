import * as THREE from 'three'

import Sizes from './Utils/Sizes.ts'
import Time from './Utils/Time.ts'
import PhysicsWorld from './Utils/PhysicsWorld.ts'
import Camera from './Camera.ts'
import Renderer from './Renderer.ts'
import World from './World/World.ts'
import Resources from './Utils/Resources.ts'
import sources from './sources.ts'

import Input from './Utils/Input.ts'

let instance: Experience | null = null

export default class Experience {
  canvas!: HTMLCanvasElement
  sizes!: Sizes
  time!: Time
  scene!: THREE.Scene
  physicsWorld!: PhysicsWorld
  camera!: Camera
  renderer!: Renderer
  world!: World
  resources!: Resources
  input!: Input

  constructor(canvas?: HTMLCanvasElement) {
    // Singleton pattern
    if (instance) {
      return instance
    }
    instance = this

    // Canvas
    this.canvas = canvas!

    // Setup
    this.sizes = new Sizes()
    this.time = new Time()
    this.input = new Input()
    this.scene = new THREE.Scene()
    this.resources = new Resources(sources)
    this.physicsWorld = new PhysicsWorld()
    this.camera = new Camera()
    this.renderer = new Renderer()
    this.world = new World()

    // Resize event
    this.sizes.on('resize', () => {
      this.resize()
    })

    // Time tick event
    this.time.on('tick', () => {
      this.update()
    })
  }

  resize() {
    this.camera.resize()
    this.renderer.resize()
  }

  update() {
    // Step physics first
    this.physicsWorld.step()

    this.camera.update()
    this.world.update()
    this.renderer.update()
  }

  destroy() {
    this.sizes.off('resize')
    this.time.off('tick')

    // Traverse the whole scene and dispose
    this.scene.traverse((child) => {
      if (child instanceof THREE.Mesh) {
        child.geometry.dispose()

        for (const key in child.material) {
          const value = child.material[key]
          if (value && typeof value.dispose === 'function') {
            value.dispose()
          }
        }
      }
    })

    this.renderer.instance.dispose()

    instance = null
  }
}
