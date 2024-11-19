<template>
  <div id="popup">
    <h1>Redirecting you to Discord for login...</h1>
    <p><NuxtLink to="/" class="link">If there's an issue click here to reload.</NuxtLink></p>
  </div>
</template>

<script setup lang="ts">
  onMounted(async() => {
    console.log(await useAuth().loginWith("discord"));
  })
</script>

<style lang="scss" scoped>
  @import "~/src/assets/theme.scss";

  html, body, #__nuxt, #__layout, #app-container {
    cursor: url("~/src/assets/cursors/curs.png"), auto;
    font-family: 'Courier New', Courier, monospace;
    margin: 0px;
    background-color: $background-color;
    min-height: 100% !important;
    height: 100%;
    caret-color: transparent;
  }

  #__nuxt {
    display: flex;
    flex-direction: column;
    justify-content: center;
  }

  h1 {
    font-weight: normal;
  }
 
  p {
    font-size: 0.5em;
  }

  #popup {
    text-align: center;
    font-size: 2em;
    color: $primary-color;
  }

  .link {
    all: unset;
  }

  .link:hover {
    text-decoration: underline;
  }
</style>
