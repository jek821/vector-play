import type { AssetId, AssetInstance, Effect } from './assetTypes';
import { assetDefinitions } from './assetDefinitions';

export function createInstance(typeId: AssetId, instanceId: string, position: { x: number; y: number }): AssetInstance {
    return {
        typeId,
        instanceId,
        position: { ...position },
        scale: 4,
        isVisible: true,
    };
}

export function setAssetScale(instance: AssetInstance, scale: number): void {
    instance.scale = scale;
}

export function holdAsset(holder: AssetInstance, held: AssetInstance): void {
    holder.heldInstanceId = held.instanceId;
}

export function getRenderPosition(instance: AssetInstance, assets: AssetInstance[]): { x: number; y: number } {
    const holder = assets.find(a => a.heldInstanceId === instance.instanceId);
    if (!holder) return instance.position;
    const hp = assetDefinitions[holder.typeId].holdPosition ?? { x: 0, y: 0 };
    return { x: holder.position.x + hp.x, y: holder.position.y + hp.y };
}

export function performEffect(effect: Effect, targetAsset?: AssetInstance): void {
    switch (effect.type) {
        case "changeTargetAsset":
            if (!targetAsset) return;
            targetAsset.typeId = effect.newAssetId;
            break;
        case "changeCursor":
            break;
        case "holdTarget":
            break;
        case "placeOntoTarget":
            break;
    }
}
