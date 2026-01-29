import * as THREE from 'three'
import Experience from './Experience.ts'

export default class Renderer {
    experience: Experience
    canvas: HTMLCanvasElement
    sizes: Experience['sizes']
    scene: THREE.Scene
    camera: Experience['camera']
    instance!: THREE.WebGLRenderer

    constructor() {
        this.experience = new Experience()
        this.canvas = this.experience.canvas
        this.sizes = this.experience.sizes
        this.scene = this.experience.scene
        this.camera = this.experience.camera

        this.setInstance()
    }

    setInstance() {
        this.instance = new THREE.WebGLRenderer({
            canvas: this.canvas,
            antialias: true,
            alpha: false
        })
        this.instance.toneMapping = THREE.ACESFilmicToneMapping
        this.instance.toneMappingExposure = 1.0
        this.instance.shadowMap.enabled = true
        this.instance.shadowMap.type = THREE.PCFSoftShadowMap
        this.instance.setSize(this.sizes.width, this.sizes.height)
        this.instance.setPixelRatio(Math.min(window.devicePixelRatio, 2))
        this.instance.setClearColor('#1a1a2e')
    }

    resize() {
        this.instance.setSize(this.sizes.width, this.sizes.height)
        this.instance.setPixelRatio(Math.min(window.devicePixelRatio, 2))
    }

    update() {
        this.instance.render(this.scene, this.camera.instance)
    }
}
