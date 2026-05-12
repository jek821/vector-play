import type { AssetId, AssetInstance } from '../assets/assetTypes';

export type SceneId =
    | "kitchen_scene"
    | "test_scene";

export type AssetPlacement = {
    typeId: AssetId;
    position: { x: number; y: number };
    heldItem?: AssetPlacement;
};

export type SceneDefinition = {
    startingLayout: AssetPlacement[];
};

export type Scene = {
    id: SceneId;
    assets: AssetInstance[];
};

export type GameState = {
    currentScene: Scene;
    cursor?: AssetId;
};
