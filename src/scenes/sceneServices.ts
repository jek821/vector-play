import { writable } from 'svelte/store';
import type { AssetPlacement, GameState, SceneDefinition } from './sceneTypes';
import type { AssetInstance } from '../assets/assetTypes';
import { sceneDefinitions } from './sceneDefinitions';
import { createInstance } from '../assets/assetServices';
import {assetDefinitions} from "../assets/assetDefinitions";


// Go through a scene definition layout, and for each asset placement in that layout, instantiate the asset and any held items recursively
function instantiatePlacement(placement: AssetPlacement, assets: AssetInstance[], counter: { n: number }): string {
    const instanceId = `${placement.typeId}_${counter.n++}`;
    const instance = createInstance(placement.typeId, instanceId, placement.position);
    assets.push(instance);
    if (placement.heldItem) {
        const heldItem = placement.heldItem
        heldItem.position = { x: placement.position.x + assetDefinitions[placement.typeId].holdPosition.x, y: placement.position.y + assetDefinitions[placement.typeId].holdPosition.y }
        instantiatePlacement(placement.heldItem, assets, counter);
    }
    return instanceId;
}

// Using instantiate placement on "test_scene"
// should probably just put this into the function and call it instantiateScenePlacement or something
const layout = sceneDefinitions["test_scene"].startingLayout;
const assets: AssetInstance[] = [];
const counter = { n: 0 };
for (const placement of layout) {
    instantiatePlacement(placement, assets, counter);
}

export function buildSceneDefinition(assets: AssetInstance[]): SceneDefinition {
    const heldIds = new Set(assets.flatMap(a => a.heldInstanceId ? [a.heldInstanceId] : []));
    const topLevel = assets.filter(a => !heldIds.has(a.instanceId));

    function toPlacement(asset: AssetInstance): AssetPlacement {
        const held = asset.heldInstanceId ? assets.find(a => a.instanceId === asset.heldInstanceId) : undefined;
        return {
            typeId: asset.typeId,
            position: { ...asset.position },
            ...(held ? { heldItem: toPlacement(held) } : {}),
        };
    }

    return { startingLayout: topLevel.map(toPlacement) };
}

// write the scene_id and instantiated assets array into the GameState store.
export const gameState = writable<GameState>({
    currentScene: {
        id: "test_scene",
        assets,
    },
});
