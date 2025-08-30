<template>
  <v-app dark>
    <v-app-bar app flat color="background" border="primary opacity-100" class="border-b-lg" dark>
      <v-toolbar-title>1 - The Chasm</v-toolbar-title>
    </v-app-bar>
    
    <v-main>
      <v-container fluid class="fill-height pa-6">
        <v-row no-gutters class="fill-height">

          <v-col cols="2" class="sidebar left-sidebar d-flex flex-column">
            <div class="sidebar-content">
              <progress-bar></progress-bar>
            </div>
          </v-col>

          <v-col cols="8" class="d-flex flex-column">
            <div class="center-view flex-grow-1 d-flex align-center justify-center">
              <!-- Place your main content here -->
            </div>
          </v-col>

          <v-col cols="2" class="sidebar right-sidebar d-flex flex-column">
            <div class="sidebar-content">
            </div>
          </v-col>
      
        </v-row>
      </v-container>
    </v-main>

    <v-footer app color="background" border="primary opacity-100" class="border-t-md" dark>
      <span class="mx-auto">Footer Content</span>
    </v-footer>
  </v-app>
</template>

<script setup lang="ts">
  import { onMounted } from "vue";
  import ProgressBar from "~/src/components/ProgressBar.vue";
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
