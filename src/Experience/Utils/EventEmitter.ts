/**
 * Simple event emitter for pub/sub pattern
 * Used by Sizes, Time and other utility classes
 */
type Callback = (...args: unknown[]) => void

export default class EventEmitter {
    private callbacks: Map<string, Callback[]> = new Map()

    on(event: string, callback: Callback): this {
        if (!this.callbacks.has(event)) {
            this.callbacks.set(event, [])
        }
        this.callbacks.get(event)!.push(callback)
        return this
    }

    off(event: string, callback?: Callback): this {
        if (!callback) {
            this.callbacks.delete(event)
        } else {
            const callbacks = this.callbacks.get(event)
            if (callbacks) {
                const index = callbacks.indexOf(callback)
                if (index !== -1) {
                    callbacks.splice(index, 1)
                }
            }
        }
        return this
    }

    trigger(event: string, ...args: unknown[]): this {
        const callbacks = this.callbacks.get(event)
        if (callbacks) {
            callbacks.forEach(callback => callback(...args))
        }
        return this
    }
}
