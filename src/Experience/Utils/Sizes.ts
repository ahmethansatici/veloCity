import EventEmitter from './EventEmitter.ts'

/**
 * Handles viewport dimensions and resize events
 * Emits 'resize' event when window size changes
 */
export default class Sizes extends EventEmitter {
    width: number
    height: number
    pixelRatio: number

    constructor() {
        super()

        // Setup initial values
        this.width = window.innerWidth
        this.height = window.innerHeight
        this.pixelRatio = Math.min(window.devicePixelRatio, 2)

        // Listen to resize event
        window.addEventListener('resize', () => {
            this.width = window.innerWidth
            this.height = window.innerHeight
            this.pixelRatio = Math.min(window.devicePixelRatio, 2)

            this.trigger('resize')
        })
    }
}
