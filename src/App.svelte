<script lang="ts">
  import { gameState } from './scenes/sceneServices';
  import { getSceneRenderData } from './rendering/renderServices';
  import SceneCreator from './scene-creator/SceneCreator.svelte';
  import GameFrame from './game-frame/GameFrame.svelte';
  import gameTitleSrc from './assets/png/Game_Title.png';
  import testAnimationSrc from './assets/gif/test_animation.gif';

  let hash = window.location.hash;
  window.addEventListener('hashchange', () => hash = window.location.hash);
</script>
{#if hash === '#/test-animation'}
  <div class="app">
    <header class="logo-bar">
      <img src={gameTitleSrc} alt="Game Title" />
    </header>

    <div class="frame-area">
      <GameFrame>
        <image
                href={testAnimationSrc}
                x="0"
                y="0"
                width="1920"
                height="1080"
                preserveAspectRatio="xMidYMid meet"
        />
      </GameFrame>
    </div>
  </div>


{:else if hash === '#/scene-creator'}
  <SceneCreator />

{:else}
  <div class="app">
    <header class="logo-bar">
      <img src={gameTitleSrc} alt="Game Title" />
    </header>

    <div class="frame-area">
      <GameFrame>
        {#each getSceneRenderData($gameState.currentScene.assets) as r (r.instanceId)}
          <g transform={r.transform}>
            <svg viewBox={r.viewBox} width={r.width} height={r.height} overflow="visible">
              {@html r.paths}
            </svg>
          </g>
        {/each}
      </GameFrame>
    </div>
  </div>
{/if}

<style>
  .test-gif {
    width: 100%;
    height: 100%;
    object-fit: contain;
  }
</style>