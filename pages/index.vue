<template>
  <div id="app-container" @mousedown="audioManager.playSound('click');">
    <World/>
  </div>
</template>

<script setup lang="ts">
  import { onMounted } from "vue";
  import World from "~/src/components/World.vue";
  import AudioManager from "~/src/utils/audioManager";
  import { useHead } from "nuxt/app";
  import { usePlayerInfoStore } from "~/src/store/playerInfo";
  import loadAll from "~/src/utils/loadAll";
  import { useDragScroll } from "~/src/composables/dragScroll";

  useHead({
    title: "Γramb",
    meta: [
      { name: "description", content: "holophonon" }
    ]
  });
  const { user } = useAuth();
  if (!user) {
    await navigateTo("/auth/login");
  }

  const audioManager = new AudioManager()

  onMounted(() => {
    audioManager.addAudio("click", "/sfx/click.wav"); 
    const container = document.getElementById("app-container");
    if (container) {
      useDragScroll(container);
    }
  });

  const discordUser = useAuth().user;

  if (!discordUser) {
    console.error("Error fetching discord authentication data.") //TODO handle failed authentication.
  } else {
    const discordId = discordUser.id as string;
    await loadAll(discordId);
    const playerInfoStore = usePlayerInfoStore();
  }
</script>

<style lang="scss">
  @import "~/src/assets/theme.scss";

  html, body, #__nuxt, #__layout, #app-container {
    cursor: url("~/src/assets/cursors/curs.png"), auto;
    font-family: "Courier New", Courier, monospace;
    margin: 0px;
    background-color: $background-color;
    min-height: 100% !important;
    height: 100%;
    user-select: none;
    caret-color: transparent;
    -ms-overflow-style: none;
    scrollbar-width: none;

    &::-webkit-scrollbar {
      display: none;
    }
  }

  .selectable {
    cursor: url("~/src/assets/cursors/curstext.png"), auto;
  }
</style>
