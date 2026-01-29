import * as THREE from 'three'
import RAPIER from '@dimforge/rapier3d-compat'
import Experience from '../Experience.ts'
import PhysicsWorld from '../Utils/PhysicsWorld.ts'
import Vehicle from './Vehicle.ts'
import Environment from './Environment.ts'

/**
 * World class manages all scene objects and physics entities
 * Orchestrates Floor, Environment, and Vehicle components
 * Syncs physics bodies with Three.js meshes
 */
export default class World {
    experience: Experience
    scene: THREE.Scene
    resources: Experience['resources']
    physicsWorld: PhysicsWorld

    // Vehicle
    vehicle!: Vehicle
    vehicleReady: boolean = false
    physicsReady: boolean = false
    environment!: Environment

    constructor() {
        this.experience = new Experience()
        this.scene = this.experience.scene
        this.resources = this.experience.resources
        this.physicsWorld = this.experience.physicsWorld

        // Wait for physics to initialize
        this.physicsWorld.on('ready', () => {
            this.setupPhysics()
        })

        // Wait for resources to load
        this.resources.on('ready', () => {
            this.setupWorld()
        })

        // Add visual objects (non-physics dependent)
        this.addVisualFloor()
    }

    setupPhysics() {
        // Create physics ground collider
        this.physicsWorld.createGround(100, 100)

        // Vehicle is created when resources are ready, because it needs the model
        // So we just set the flag here
        this.physicsReady = true
        this.checkVehicleCreation()
    }

    checkVehicleCreation() {
        if (this.physicsReady && this.resources.loaded === this.resources.toLoad) {
            this.createVehicle()
        }
    }

    createVehicle() {
        if (this.vehicleReady) return

        this.vehicle = new Vehicle()
        this.vehicleReady = true
        console.log('Vehicle created!')
    }



    setupWorld() {
        // Resources are ready, attempt to create vehicle
        this.checkVehicleCreation()
        this.setupEnvironment()
    }



    setupEnvironment() {
        this.environment = new Environment()
    }



    addVisualFloor() {
        // Visual floor mesh (physics ground is separate)
        const floorGeometry = new THREE.PlaneGeometry(100, 100)
        const floorMaterial = new THREE.MeshStandardMaterial({
            color: '#444444',
            roughness: 0.8,
            metalness: 0.2
        })
        const floor = new THREE.Mesh(floorGeometry, floorMaterial)
        floor.rotation.x = -Math.PI / 2
        floor.receiveShadow = true
        this.scene.add(floor)
    }

    update() {
        if (this.vehicleReady) {
            this.vehicle.update()
        }
    }
}
