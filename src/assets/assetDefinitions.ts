import type { AssetId, AssetDefinition } from './assetTypes';

export const assetDefinitions: Record<AssetId, AssetDefinition> = {
    crackedEgg_asset: {
        viewBox: "0 -0.5 30 15",
        paths: `<path stroke="#ffffff" d="M5 0h15M4 1h19M3 2h23M2 3h26M1 4h11M14 4h15M1 5h9M16 5h13M0 6h9M17 6h13M0 7h9M17 7h13M1 8h8M17 8h13M1 9h29M2 10h27M3 11h25M4 12h23M6 13h19M8 14h14" />
<path stroke="#d27537" d="M12 4h2M10 5h6M9 6h8M9 7h8M9 8h8" />`,
        width: 30,
        height: 15,
        holdPosition: { x: 0, y: 0 },
        interactions: [
            {
                actorId: "spatula_asset",
                effects: [{ type: "holdTarget" }]
            }
        ]
    },

    pan_asset: {
        viewBox: "0 -0.5 119 37",
        paths: `<path stroke="#827d85" d="M23 1h15M18 2h25M15 3h31M12 4h37M10 5h15M37 5h14M8 6h12M42 6h11M7 7h10M45 7h9M5 8h9M48 8h8M4 9h9M49 9h8M3 10h8M51 10h7M2 11h8M52 11h7M1 12h8M53 12h7M1 13h7M54 13h6M0 14h7M55 14h6M0 15h7M55 15h6M0 16h6M56 16h3M0 17h6M56 17h1M0 18h6M56 18h1M0 19h6M56 19h3M0 20h6M56 20h6M0 21h7M55 21h7M0 22h7M55 22h7M0 23h8M54 23h7M0 24h9M53 24h8M1 25h9M52 25h8M1 26h10M51 26h9M2 27h11M49 27h10M3 28h11M48 28h10M4 29h13M45 29h12M5 30h15M42 30h14M7 31h18M37 31h17M8 32h45M10 33h41M12 34h37M15 35h31M18 36h25" />
<path stroke="#9cabb4" d="M25 5h12M20 6h22M17 7h28M14 8h34M13 9h36M11 10h40M10 11h42M9 12h44M8 13h46M7 14h48M7 15h48M6 16h50M6 17h50M6 18h50M6 19h50M6 20h50M7 21h48M7 22h48M8 23h46M9 24h44M10 25h42M11 26h40M13 27h36M14 28h34M17 29h28M20 30h22M25 31h12" />
<path stroke="#686969" d="M75 13h26M67 14h42M62 15h52M59 16h58M57 17h62M57 18h62M59 19h58M62 20h52M67 21h42M75 22h26" />`,
        width: 119,
        height: 37,
        holdPosition: { x: 13, y: 10 },
        interactions: []
    },

    wholeEgg_asset: {
        viewBox: "0 0 1 1",
        paths: "",
        width: 1,
        height: 1,
        holdPosition: {x: 0, y: 0},
        interactions: []
    },

    spatula_asset: {
        viewBox: "0 0 1 1",
        paths: "",
        width: 1,
        height: 1,
        holdPosition: {x: 0, y: 0},
        interactions: []
    },
};
