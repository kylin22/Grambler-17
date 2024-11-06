<template>
  <div id="app-container" @mousedown="audioManager.playSound('click');">
    <World/>
  </div>
</template>

<script setup lang="ts">
  import World from './src/components/World.vue';
import AudioManager from './src/utils/audioManager';

  useHead({
    title: 'Γramb',
    meta: [
      { name: 'description', content: 'holophonon' }
    ]
  });

  const audioManager = new AudioManager()

  onMounted(() => {
    audioManager.addAudio("click", "/sfx/click.wav"); 
  });
</script>

<style lang="scss">
  @import "./src/assets/theme.scss";

  html, body, #__nuxt, #__layout, #app-container {
    cursor: url("./src/assets/cursors/curs.png"), auto;
    font-family: 'Courier New', Courier, monospace;
    margin: 0px;
    background-color: $background-color;
    min-height: 100% !important;
    height: 100%;
  }

  .selectable {
    cursor: url("./src/assets/cursors/curstext.png"), auto;
  }
</style>
