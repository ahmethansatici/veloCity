import EventEmitter from './EventEmitter.ts'

export default class Input extends EventEmitter {
    keys: { [key: string]: boolean } = {}

    constructor() {
        super()

        // Setup event listeners
        window.addEventListener('keydown', (event) => {
            this.keys[event.code] = true
            this.trigger('keydown', [event.code])
        })

        window.addEventListener('keyup', (event) => {
            this.keys[event.code] = false
            this.trigger('keyup', [event.code])
        })
    }

    isPressed(key: string): boolean {
        return !!this.keys[key]
    }
}
