export type AssetId =
    | "wholeEgg_asset"
    | "crackedEgg_asset"
    | "spatula_asset"
    | "pan_asset";

export type Effect =
    | { type: "changeTargetAsset"; newAssetId: AssetId }
    | { type: "changeCursor"; newCursorId: AssetId }
    | { type: "placeOntoTarget" }
    | { type: "holdTarget" };

export type Interaction = {
    actorId: AssetId;
    effects: Effect[];
};

export type AssetDefinition = {
    viewBox: string;
    paths: string;
    width: number;
    height: number;
    holdPosition: { x: number, y: number };
    interactions: Interaction[];
};

export type AssetInstance = {
    typeId: AssetId;
    instanceId: string;
    position: { x: number, y: number };
    scale: number;
    isVisible: boolean;
    heldInstanceId?: string;
};
