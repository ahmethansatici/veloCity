import * as THREE from 'three'
import Experience from '../Experience.ts'

export default class Environment {
    experience: Experience
    scene: THREE.Scene
    resources: Experience['resources']

    sunLight!: THREE.DirectionalLight
    ambientLight!: THREE.AmbientLight
    environmentMap: any = {}

    constructor() {
        this.experience = new Experience()
        this.scene = this.experience.scene
        this.resources = this.experience.resources

        this.setSunLight()
        this.setEnvironmentMap()
    }

    setSunLight() {
        this.sunLight = new THREE.DirectionalLight('#ffffff', 4)
        this.sunLight.castShadow = true
        this.sunLight.shadow.camera.far = 15
        this.sunLight.shadow.mapSize.set(1024, 1024)
        this.sunLight.shadow.normalBias = 0.05
        this.sunLight.position.set(3.5, 2, -1.25)

        this.scene.add(this.sunLight)

        // Ambient light
        this.ambientLight = new THREE.AmbientLight('#ffffff', 0.5)
        this.scene.add(this.ambientLight)
    }

    setEnvironmentMap() {
        // Setup scene background (Dark Night)
        this.scene.background = new THREE.Color('#1a1a2e')

        // Hemisphere light for realistic ambient lighting (Sky vs Ground color)
        const skyColor = new THREE.Color('#87CEEB')
        const groundColor = new THREE.Color('#3d3d3d')
        const hemiLight = new THREE.HemisphereLight(skyColor, groundColor, 0.6)
        this.scene.add(hemiLight)
    }
}
