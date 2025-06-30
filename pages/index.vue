<template>
  <div id="app-container">
    <World/>
  </div>
</template>

<script setup lang="ts">
  import { onMounted } from "vue";
  import World from "~/src/components/World.vue";
  import { useHead } from "nuxt/app";
  import { usePlayerInfoStore } from "~/src/store/playerInfo";
  import loadAll from "~/src/utils/loadAll";

  useHead({
    title: "Γramb",
    meta: [
      { name: "description", content: "" }
    ]
  });
  const { user } = useAuth();
  if (!user) {
    await navigateTo("/auth/login");
  }

  onMounted(() => {
    //Prevent default scroll behavior
    const preventScroll = (e: Event) => e.preventDefault();
    window.addEventListener("wheel", preventScroll, { passive: false });
    window.addEventListener("touchmove", preventScroll, { passive: false });
    window.addEventListener("keydown", (e: KeyboardEvent) => {
      // Prevent arrow keys, space, page up/down, home/end
      if (["ArrowUp","ArrowDown","ArrowLeft","ArrowRight"," ","PageUp","PageDown","Home","End"].includes(e.key)) {
        e.preventDefault();
      }
    });
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
