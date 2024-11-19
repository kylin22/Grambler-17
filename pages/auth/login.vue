<template>
  
</template>

<script setup lang="ts">
  console.log(useAuth().loginWith("discord"));
</script>

<style lang="scss">
  @import "~/src/assets/theme.scss";

  html, body, #__nuxt, #__layout, #app-container {
    cursor: url("~/src/assets/cursors/curs.png"), auto;
    font-family: 'Courier New', Courier, monospace;
    margin: 0px;
    background-color: $background-color;
    min-height: 100% !important;
    height: 100%;
  }

  .selectable {
    cursor: url("~/src/assets/cursors/curstext.png"), auto;
  }
</style>
