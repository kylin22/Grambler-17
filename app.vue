<template>
  <div id="app-container" @mousedown="playSound('click');">
    <World/>
  </div>
</template>

<script setup lang="ts">
  import World from './src/components/World.vue';

  useHead({
    title: 'Γramb',
    meta: [
      { name: 'description', content: 'holophonon' }
    ]
  });

  interface AudioLookup {
    [key: string]: HTMLAudioElement
  }
  let soundEffects: AudioLookup = {};

  onMounted(() => {
    soundEffects = {
      "click": new Audio("/sfx/click.wav"),
    }
    soundEffects["click"].volume = 0.4;
  });

  const playSound = (SFXKey: string) => {
    const soundEffect = soundEffects[SFXKey];
    if (soundEffect) {
      soundEffect.currentTime = 0;
      soundEffect.play();
    }
  }
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
</style>
