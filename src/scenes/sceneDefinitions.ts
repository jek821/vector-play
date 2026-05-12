import type { SceneId, SceneDefinition } from './sceneTypes';

export const sceneDefinitions: Record<SceneId, SceneDefinition> = {
    test_scene: {
        startingLayout: [
            {
                typeId: "pan_asset",
                position: { x: 50, y: 50 },
                heldItem: { typeId: "crackedEgg_asset", position: { x: 0, y: 0 } }
            },
        ]
    },

    kitchen_scene: {
        startingLayout: []
    },
};
