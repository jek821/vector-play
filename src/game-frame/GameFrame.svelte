<script lang="ts">
    export let svgEl: SVGSVGElement | undefined = undefined;

    let wrapperWidth = 0;
    let wrapperHeight = 0;

    $: frameWidth = Math.min(wrapperWidth, wrapperHeight * (16 / 9));
    $: frameHeight = frameWidth * (9 / 16);
</script>

<div class="wrapper" bind:clientWidth={wrapperWidth} bind:clientHeight={wrapperHeight}>
    <!-- svelte-ignore a11y_no_static_element_interactions -->
    <svg
        bind:this={svgEl}
        viewBox="0 0 1920 1080"
        width={frameWidth}
        height={frameHeight}
        on:mousemove
        on:mouseup
        on:mouseleave
        on:mousedown
    >
        <slot />
    </svg>
</div>

<style>
    .wrapper {
        width: 100%;
        height: 100%;
        display: flex;
        align-items: center;
        justify-content: center;
        overflow: hidden;
        background: transparent;
    }

    svg {
        display: block;
        background: #111;
        border: 3px solid #c0c0c0;
        box-shadow: 0 4px 24px rgba(0, 0, 0, 0.6);
    }
</style>
