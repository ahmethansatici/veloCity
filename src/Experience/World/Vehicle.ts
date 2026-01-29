import * as THREE from 'three'
import RAPIER from '@dimforge/rapier3d-compat'
import Experience from '../Experience.ts'

export default class Vehicle {
    experience: Experience
    scene: THREE.Scene
    physicsWorld: Experience['physicsWorld']
    resources: Experience['resources']
    time: Experience['time']
    input: Experience['input']

    // Visual
    model: THREE.Object3D
    chassisMesh: THREE.Group

    // Physics
    chassisBody!: RAPIER.RigidBody
    vehicleController!: RAPIER.DynamicRayCastVehicleController

    constructor() {
        this.experience = new Experience()
        this.scene = this.experience.scene
        this.physicsWorld = this.experience.physicsWorld
        this.resources = this.experience.resources
        this.time = this.experience.time
        this.input = this.experience.input

        // Setup container for physics sync
        this.chassisMesh = new THREE.Group()
        this.scene.add(this.chassisMesh)

        // Get the loaded model
        this.model = this.resources.items.get('carModel') as THREE.Object3D

        // Reset model transformation before adding to physics
        this.model.position.set(0, 0, 0)
        this.model.rotation.set(0, Math.PI * 0.5, 0) // Fix crab walking
        this.model.scale.setScalar(0.04)

        this.chassisMesh.add(this.model)

        this.createPhysics()
    }

    createPhysics() {
        // 1. Create Chassis Body
        // Start position (high enough to not clip ground)
        const startPosition = { x: 0, y: 2, z: 0 }

        const rigidBodyDesc = RAPIER.RigidBodyDesc.dynamic()
            .setTranslation(startPosition.x, startPosition.y, startPosition.z)
            .setCanSleep(false) // Always active

        this.chassisBody = this.physicsWorld.world.createRigidBody(rigidBodyDesc)

        // Add a box collider for the chassis (simplified)
        // Adjust these dimensions based on the visual model (approx 2m width, 4.5m length, 0.5m height)
        // LOWER CENTER OF MASS: Set translation to 0 (center)
        const chassisColliderDesc = RAPIER.ColliderDesc.cuboid(1.0, 0.4, 2.2)
            .setTranslation(0, 0, 0)
            .setMass(1500) // 1500kg car
            .setFriction(0.5)

        this.physicsWorld.world.createCollider(chassisColliderDesc, this.chassisBody)

        // 2. Create Vehicle Controller
        // @ts-ignore
        this.vehicleController = this.physicsWorld.world.createVehicleController(this.chassisBody)

        // 3. Add Wheels
        // Generic sedan dimensions
        const wheelRadius = 0.35
        const suspensionRestLength = 0.6
        const wheelHalfTrack = 1.1 // WIDER -> More stable
        const wheelAxisHeight = 0.2 // Connection point
        const wheelFrontZ = 1.5
        const wheelBackZ = -1.5

        // Suspension settings
        const suspensionStiffness = 70.0 // Stiffer
        const maxSuspensionTravel = 0.3
        const frictionSlip = 1.5 // LOWER friction -> Drifts instead of flips

        // Wheel 0: Front Left
        this.addWheel({ x: wheelHalfTrack, y: wheelAxisHeight, z: wheelFrontZ }, wheelRadius, suspensionRestLength, suspensionStiffness, maxSuspensionTravel, frictionSlip)

        // Wheel 1: Front Right
        this.addWheel({ x: -wheelHalfTrack, y: wheelAxisHeight, z: wheelFrontZ }, wheelRadius, suspensionRestLength, suspensionStiffness, maxSuspensionTravel, frictionSlip)

        // Wheel 2: Rear Left
        this.addWheel({ x: wheelHalfTrack, y: wheelAxisHeight, z: wheelBackZ }, wheelRadius, suspensionRestLength, suspensionStiffness, maxSuspensionTravel, frictionSlip)

        // Wheel 3: Rear Right
        this.addWheel({ x: -wheelHalfTrack, y: wheelAxisHeight, z: wheelBackZ }, wheelRadius, suspensionRestLength, suspensionStiffness, maxSuspensionTravel, frictionSlip)
    }

    addWheel(position: { x: number, y: number, z: number }, radius: number, restLength: number, stiffness: number, travel: number, friction: number) {
        const direction = { x: 0, y: -1, z: 0 } // Down
        const axle = { x: 1, y: 0, z: 0 } // Sideways (X-axis)

        this.vehicleController.addWheel(
            position,
            direction,
            axle,
            restLength,
            radius
        )

        // We need to access the wheel index we just added (last one)
        const wheelIndex = this.vehicleController.numWheels() - 1

        // Set suspension parameters
        this.vehicleController.setWheelSuspensionStiffness(wheelIndex, stiffness)
        this.vehicleController.setWheelMaxSuspensionTravel(wheelIndex, travel)

        // Set friction slip (if method exists)
        // @ts-ignore
        if (this.vehicleController.setWheelFrictionSlip) {
            // @ts-ignore
            this.vehicleController.setWheelFrictionSlip(wheelIndex, friction)
        }

        // Attempt to set damping safely
        // @ts-ignore
        if (this.vehicleController.setWheelSuspensionCompression) {
            // @ts-ignore
            this.vehicleController.setWheelSuspensionCompression(wheelIndex, 4.4)
        }
        // @ts-ignore
        if (this.vehicleController.setWheelSuspensionRelaxation) {
            // @ts-ignore
            this.vehicleController.setWheelSuspensionRelaxation(wheelIndex, 4.3)
        }
    }

    update() {
        if (!this.chassisBody) return

        this.chassisBody.wakeUp() // Prevent sleeping

        // 1. Handle Input
        const engineForce = 8000
        const brakeForce = 150
        const maxSteer = 0.5 // Radians

        let currentEngineForce = 0
        let currentBrakeForce = 0
        let currentSteering = 0

        // Forward / Backward
        if (this.input.isPressed('KeyW') || this.input.isPressed('ArrowUp')) {
            currentEngineForce = engineForce
        } else if (this.input.isPressed('KeyS') || this.input.isPressed('ArrowDown')) {
            currentEngineForce = -engineForce
        }

        // Steering
        if (this.input.isPressed('KeyA') || this.input.isPressed('ArrowLeft')) {
            currentSteering = maxSteer // Keep maxSteer but ensure maxSteer itself is correct sign? No, simple swap
            // Wait, previous was: A -> maxSteer. User said A -> Right. So maxSteer is Right.
            // We want A -> Left. So A -> -maxSteer.
            currentSteering = -maxSteer
        } else if (this.input.isPressed('KeyD') || this.input.isPressed('ArrowRight')) {
            currentSteering = maxSteer
        }

        // Handbrake (Space)
        if (this.input.isPressed('Space')) {
            currentBrakeForce = brakeForce
            currentEngineForce = 0
        }

        // Apply controls
        // Rear-wheel drive: indices 2 and 3
        this.vehicleController.setWheelEngineForce(0, currentEngineForce) // AWD for better control
        this.vehicleController.setWheelEngineForce(1, currentEngineForce)
        this.vehicleController.setWheelEngineForce(2, currentEngineForce)
        this.vehicleController.setWheelEngineForce(3, currentEngineForce)

        // Apply Brakes
        // @ts-ignore
        if (this.vehicleController.setWheelBrake) {
            // @ts-ignore
            this.vehicleController.setWheelBrake(0, currentBrakeForce)
            // @ts-ignore
            this.vehicleController.setWheelBrake(1, currentBrakeForce)
            // @ts-ignore
            this.vehicleController.setWheelBrake(2, currentBrakeForce)
            // @ts-ignore
            this.vehicleController.setWheelBrake(3, currentBrakeForce)
        }

        // Steering: Front wheels 0 and 1
        this.vehicleController.setWheelSteering(0, currentSteering)
        this.vehicleController.setWheelSteering(1, currentSteering)

        // usually engine force 0 + friction does it, but let's check input logic.

        // 2. Update Vehicle Physics
        this.vehicleController.updateVehicle(this.time.delta / 1000)

        // 3. Sync Visuals with Physics Chassis
        const chassisTranslation = this.chassisBody.translation()
        const chassisRotation = this.chassisBody.rotation()

        this.chassisMesh.position.set(chassisTranslation.x, chassisTranslation.y, chassisTranslation.z)
        this.chassisMesh.quaternion.set(chassisRotation.x, chassisRotation.y, chassisRotation.z, chassisRotation.w)

        // Debug: Log position once in a while
        // console.log(this.model.position)
    }
}
