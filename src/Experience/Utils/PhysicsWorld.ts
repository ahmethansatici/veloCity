import RAPIER from '@dimforge/rapier3d-compat'
import EventEmitter from './EventEmitter.ts'

/**
 * Manages the Rapier.js physics world
 * Handles initialization, stepping, and physics body management
 */
export default class PhysicsWorld extends EventEmitter {
    world!: RAPIER.World
    initialized: boolean = false

    // Physics configuration
    gravity = { x: 0, y: -9.81, z: 0 }

    // Track rigid bodies for sync with Three.js meshes
    bodies: Map<number, RAPIER.RigidBody> = new Map()

    constructor() {
        super()
        this.init()
    }

    async init() {
        // Initialize Rapier WASM module
        await RAPIER.init()

        // Create physics world with gravity
        this.world = new RAPIER.World(this.gravity)

        this.initialized = true
        this.trigger('ready')

        console.log('PhysicsWorld initialized with gravity:', this.gravity)
    }

    /**
     * Step the physics simulation
     * Should be called every frame from the game loop
     */
    step() {
        if (!this.initialized) return
        this.world.step()
    }

    /**
     * Create a static ground collider
     */
    createGround(width: number = 50, depth: number = 50): RAPIER.Collider {
        const groundDesc = RAPIER.ColliderDesc.cuboid(width / 2, 2.0, depth / 2)
            .setTranslation(0, -2.0, 0)
        return this.world.createCollider(groundDesc)
    }

    /**
     * Create a dynamic rigid body with a box collider
     */
    createDynamicBox(
        position: { x: number; y: number; z: number },
        size: { x: number; y: number; z: number } = { x: 1, y: 1, z: 1 },
        mass: number = 1
    ): RAPIER.RigidBody {
        // Create rigid body
        const bodyDesc = RAPIER.RigidBodyDesc.dynamic()
            .setTranslation(position.x, position.y, position.z)

        const rigidBody = this.world.createRigidBody(bodyDesc)

        // Create collider attached to the body
        const colliderDesc = RAPIER.ColliderDesc.cuboid(size.x / 2, size.y / 2, size.z / 2)
            .setMass(mass)
            .setRestitution(0.3)
            .setFriction(0.7)

        this.world.createCollider(colliderDesc, rigidBody)

        // Track the body
        this.bodies.set(rigidBody.handle, rigidBody)

        return rigidBody
    }

    /**
     * Remove a rigid body from the world
     */
    removeBody(body: RAPIER.RigidBody) {
        this.bodies.delete(body.handle)
        this.world.removeRigidBody(body)
    }

    /**
     * Get body position for syncing with Three.js mesh
     */
    getBodyTransform(body: RAPIER.RigidBody): { position: RAPIER.Vector3; rotation: RAPIER.Quaternion } {
        return {
            position: body.translation(),
            rotation: body.rotation()
        }
    }

    destroy() {
        this.bodies.clear()
        // Note: Rapier world doesn't have explicit destroy, 
        // it will be garbage collected when no references remain
        this.initialized = false
    }
}
