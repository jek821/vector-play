import type { AssetInstance } from '../assets/assetTypes';
import type { RenderData } from './renderTypes';
import { assetDefinitions } from '../assets/assetDefinitions';
import { getRenderPosition } from '../assets/assetServices';


// Go through the instantiated assets in game state store, and return a struct for each that gives necessary rendering information
export function getSceneRenderData(assets: AssetInstance[]): RenderData[] {
    return assets
        .filter(a => a.isVisible)
        .map(a => {
            const def = assetDefinitions[a.typeId];
            const pos = getRenderPosition(a, assets);
            return {
                instanceId: a.instanceId,
                transform: `translate(${pos.x * a.scale}, ${pos.y * a.scale}) scale(${a.scale})`,
                viewBox: def.viewBox,
                width: def.width,
                height: def.height,
                paths: def.paths,
            };
        });
}
