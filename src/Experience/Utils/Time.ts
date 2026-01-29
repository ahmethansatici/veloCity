import EventEmitter from './EventEmitter.ts'

/**
 * Handles game loop timing with requestAnimationFrame
 * Emits 'tick' event each frame with delta time
 */
export default class Time extends EventEmitter {
    start: number
    current: number
    elapsed: number
    delta: number

    constructor() {
        super()

        // Setup timing
        this.start = Date.now()
        this.current = this.start
        this.elapsed = 0
        this.delta = 16 // Default to ~60fps

        // Wait one frame before starting the loop
        window.requestAnimationFrame(() => {
            this.tick()
        })
    }

    tick() {
        const currentTime = Date.now()
        this.delta = currentTime - this.current
        this.current = currentTime
        this.elapsed = this.current - this.start

        this.trigger('tick')

        window.requestAnimationFrame(() => {
            this.tick()
        })
    }
}
