import type { Source } from './Utils/Resources.ts'

/**
 * Resource sources configuration
 * Define all external assets (models, textures) to be loaded
 */
const sources: Source[] = [
    {
        name: 'carModel',
        type: 'gltfModel',
        path: '/models/car/scene.gltf'
    }
]

export default sources
