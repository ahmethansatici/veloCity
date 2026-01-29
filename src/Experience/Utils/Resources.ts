import * as THREE from 'three'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js'
import EventEmitter from './EventEmitter.ts'

export interface Source {
    name: string
    type: 'gltfModel' | 'texture' | 'cubeTexture'
    path: string | string[]
}

/**
 * Resource loader for textures, models, and cube textures
 * Emits 'ready' event when all resources are loaded
 */
export default class Resources extends EventEmitter {
    sources: Source[]
    items: Map<string, THREE.Texture | THREE.Object3D | THREE.CubeTexture>
    toLoad: number
    loaded: number
    loaders!: {
        gltfLoader: GLTFLoader
        textureLoader: THREE.TextureLoader
        cubeTextureLoader: THREE.CubeTextureLoader
    }

    constructor(sources: Source[]) {
        super()

        this.sources = sources
        this.items = new Map()
        this.toLoad = this.sources.length
        this.loaded = 0

        this.setLoaders()
        this.startLoading()
    }

    setLoaders() {
        this.loaders = {
            gltfLoader: new GLTFLoader(),
            textureLoader: new THREE.TextureLoader(),
            cubeTextureLoader: new THREE.CubeTextureLoader()
        }
    }

    startLoading() {
        // If no sources, trigger ready immediately
        if (this.sources.length === 0) {
            this.trigger('ready')
            return
        }

        for (const source of this.sources) {
            if (source.type === 'gltfModel') {
                this.loaders.gltfLoader.load(source.path as string, (gltf) => {
                    this.sourceLoaded(source, gltf.scene)
                })
            } else if (source.type === 'texture') {
                this.loaders.textureLoader.load(source.path as string, (texture) => {
                    this.sourceLoaded(source, texture)
                })
            } else if (source.type === 'cubeTexture') {
                this.loaders.cubeTextureLoader.load(source.path as string[], (texture) => {
                    this.sourceLoaded(source, texture)
                })
            }
        }
    }

    sourceLoaded(source: Source, file: THREE.Texture | THREE.Object3D | THREE.CubeTexture) {
        this.items.set(source.name, file)
        this.loaded++

        if (this.loaded === this.toLoad) {
            this.trigger('ready')
        }
    }
}
