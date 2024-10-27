<template>
  <World/>
</template>

<script setup lang="ts">
import World from './src/components/World.vue';
  
</script>

<style lang="scss">
  @import "./src/assets/theme.scss";

  html, body, #__nuxt, #__layout {
    cursor: url("./src/assets/cursors/curs.png"), auto;
    font-family: 'Courier New', Courier, monospace;
    margin: 0px;
    background-color: $background-color;
    min-height: 100% !important;
    height: 100%;
  }
</style>
