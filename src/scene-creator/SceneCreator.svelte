<script lang="ts">
    import type { AssetId, AssetInstance } from '../assets/assetTypes';
    import { assetDefinitions } from '../assets/assetDefinitions';
    import { createInstance, holdAsset, setAssetScale } from '../assets/assetServices';
    import { getSceneRenderData } from '../rendering/renderServices';
    import { buildSceneDefinition } from '../scenes/sceneServices';
    import GameFrame from '../game-frame/GameFrame.svelte';

    let canvasAssets: AssetInstance[] = [];
    let selectedId: string | null = null;
    let showHud = false;
    let addingHeldFor: string | null = null;
    let exportOutput = '';
    let svgEl: SVGSVGElement;
    let dragging: { instanceId: string; startMouseX: number; startMouseY: number; startAssetX: number; startAssetY: number } | null = null;
    let counter = 0;

    const assetTypeIds = Object.keys(assetDefinitions) as AssetId[];

    // Recomputes on every canvasAssets change — getRenderPosition handles held item positions
    $: renderData = getSceneRenderData(canvasAssets);
    $: selectedAsset = canvasAssets.find(a => a.instanceId === selectedId);

    // Converts screen coordinates to 1920x1080 SVG space using the viewBox transform
    function getSvgPos(e: MouseEvent): { x: number; y: number } {
        const pt = svgEl!.createSVGPoint();
        pt.x = e.clientX;
        pt.y = e.clientY;
        const svgPt = pt.matrixTransform(svgEl!.getScreenCTM()!.inverse());
        return { x: svgPt.x, y: svgPt.y };
    }

    function spawnAsset(typeId: AssetId) {
        const instanceId = `${typeId}_${counter++}`;
        const newAsset = createInstance(typeId, instanceId, { x: 50, y: 50 });

        if (addingHeldFor) {
            const holder = canvasAssets.find(a => a.instanceId === addingHeldFor)!;
            holdAsset(holder, newAsset);
            addingHeldFor = null;
        }

        canvasAssets = [...canvasAssets, newAsset];
        selectedId = instanceId;
        showHud = false;
    }

    function onAssetMousedown(e: MouseEvent, instanceId: string) {
        e.stopPropagation();
        selectedId = instanceId;

        // Held assets move with their parent — only drag top-level assets
        const isHeld = canvasAssets.some(a => a.heldInstanceId === instanceId);
        if (isHeld) return;

        const asset = canvasAssets.find(a => a.instanceId === instanceId)!;
        const pos = getSvgPos(e);
        dragging = {
            instanceId,
            startMouseX: pos.x,
            startMouseY: pos.y,
            startAssetX: asset.position.x,
            startAssetY: asset.position.y,
        };
    }

    function onMousemove(e: MouseEvent) {
        if (!dragging) return;
        const pos = getSvgPos(e);
        const asset = canvasAssets.find(a => a.instanceId === dragging!.instanceId)!;
        asset.position = {
            x: dragging.startAssetX + (pos.x - dragging.startMouseX) / asset.scale,
            y: dragging.startAssetY + (pos.y - dragging.startMouseY) / asset.scale,
        };
        canvasAssets = canvasAssets; // trigger reactive recompute of renderData
    }

    function onMouseup() {
        dragging = null;
    }

    function increaseScale() {
        if (selectedAsset) { setAssetScale(selectedAsset, selectedAsset.scale + 1); canvasAssets = canvasAssets; }
    }

    function decreaseScale() {
        if (selectedAsset && selectedAsset.scale > 1) { setAssetScale(selectedAsset, selectedAsset.scale - 1); canvasAssets = canvasAssets; }
    }

    function openAddHeldItem() {
        addingHeldFor = selectedId;
        showHud = true;
    }

    function exportScene() {
        exportOutput = JSON.stringify(buildSceneDefinition(canvasAssets), null, 2);
    }
</script>

<div class="scene-creator">

    <!-- Canvas uses GameFrame so the editor coordinate space matches the game exactly -->
    <GameFrame
        bind:svgEl
        on:mousemove={onMousemove}
        on:mouseup={onMouseup}
        on:mouseleave={onMouseup}
        on:mousedown={() => selectedId = null}
    >
        {#each renderData as r (r.instanceId)}
            <!-- svelte-ignore a11y_no_static_element_interactions -->
            <g
                transform={r.transform}
                on:mousedown={(e) => onAssetMousedown(e, r.instanceId)}
                style="cursor: {dragging?.instanceId === r.instanceId ? 'grabbing' : 'grab'}"
            >
                <svg viewBox={r.viewBox} width={r.width} height={r.height} overflow="visible">
                    {@html r.paths}
                </svg>
                {#if r.instanceId === selectedId}
                    <rect
                        x={-1} y={-1}
                        width={r.width + 2} height={r.height + 2}
                        fill="none" stroke="cyan" stroke-width={0.5}
                    />
                {/if}
            </g>
        {/each}
    </GameFrame>

    <!-- Side panel -->
    <div class="panel">
        <button on:click={() => { addingHeldFor = null; showHud = true; }}>Add Asset</button>

        {#if selectedAsset}
            <hr />
            <p class="selected-label">{selectedAsset.typeId}</p>
            <button on:click={increaseScale}>Scale +</button>
            <button on:click={decreaseScale}>Scale -</button>
            <button on:click={openAddHeldItem}>Add Item Inside</button>
        {/if}

        <hr />
        <button on:click={exportScene}>Export</button>
        {#if exportOutput}
            <textarea readonly value={exportOutput}></textarea>
        {/if}
    </div>

    <!-- Asset picker HUD -->
    {#if showHud}
        <!-- svelte-ignore a11y_no_static_element_interactions -->
        <div class="hud-overlay" on:mousedown|self={() => showHud = false}>
            <div class="hud">
                <h3>{addingHeldFor ? 'Pick item to hold' : 'Pick an Asset'}</h3>
                {#each assetTypeIds as typeId}
                    <button class="asset-btn" on:click={() => spawnAsset(typeId)}>
                        <svg
                            viewBox={assetDefinitions[typeId].viewBox}
                            width={assetDefinitions[typeId].width * 2}
                            height={assetDefinitions[typeId].height * 2}
                        >
                            {@html assetDefinitions[typeId].paths}
                        </svg>
                        <span>{typeId}</span>
                    </button>
                {/each}
            </div>
        </div>
    {/if}

</div>

<style>
    .scene-creator {
        display: flex;
        width: 100vw;
        height: 100vh;
        overflow: hidden;
        position: relative;
    }

    .panel {
        width: 200px;
        background: #333;
        color: white;
        padding: 12px;
        display: flex;
        flex-direction: column;
        gap: 8px;
        overflow-y: auto;
    }

    .panel button {
        padding: 6px 10px;
        background: #555;
        color: white;
        border: none;
        cursor: pointer;
        border-radius: 4px;
    }

    .panel button:hover { background: #666; }

    .selected-label {
        font-size: 11px;
        color: #aaa;
        margin: 0;
        word-break: break-all;
    }

    .panel textarea {
        width: 100%;
        height: 200px;
        font-size: 10px;
        font-family: monospace;
        background: #222;
        color: #0f0;
        border: 1px solid #555;
        resize: vertical;
        box-sizing: border-box;
    }

    .hud-overlay {
        position: absolute;
        inset: 0;
        background: rgba(0, 0, 0, 0.6);
        display: flex;
        align-items: center;
        justify-content: center;
        z-index: 10;
    }

    .hud {
        background: #2a2a2a;
        border: 1px solid #555;
        padding: 20px;
        border-radius: 8px;
        display: flex;
        flex-direction: column;
        gap: 8px;
        max-height: 80vh;
        overflow-y: auto;
        min-width: 220px;
    }

    .hud h3 { color: white; margin: 0 0 8px; }

    .asset-btn {
        display: flex;
        align-items: center;
        gap: 12px;
        padding: 8px 12px;
        background: #3a3a3a;
        border: 1px solid #555;
        border-radius: 4px;
        cursor: pointer;
        color: white;
    }

    .asset-btn:hover { background: #4a4a4a; }
</style>
