<template>
  <div
    :id="blockId"
    :class="['draggable-block', blockClass, { dragged: isActive }]"
    :style="{ zIndex: zOrder }"
  >
    <div class="window-header" @mousedown.stop.prevent="handleMouseDown">
      <span>{{ blockTitle }}</span>
    </div>
    <div class="window-content" v-if="showContent">
      <slot></slot>
    </div>
  </div>
</template>

<script setup lang="ts">
  import { ref } from "vue";
  import type { DragEmit } from "../types/worldTypes";

  const props = defineProps<{
    id: string;
    activeBlock: HTMLDivElement | null;
    class?: string;
    title: string;
    left?: number;
    top?: number;
    zIndices?: string[];
  }>();

  const emit = defineEmits<{
    (e: "startDrag", dragged: DragEmit): void
  }>();

  const blockId = ref(props.id);
  const blockClass = ref(props.class);
  const blockTitle = ref(props.title)
  const isActive = computed(() => props.activeBlock?.id === props.id);

  const handleMouseDown = (mouseEvent: MouseEvent): void => {
    const draggedElement = document.getElementById(blockId.value) as HTMLDivElement;
    if (!draggedElement) return;
    emit("startDrag", { element: draggedElement, event: mouseEvent });
  }

  const zOrder = computed(() => {
    const index = props.zIndices?.findIndex(id => id === props.id)
    return index ? index + 1 : 1;
  });

  const showContent = ref(true);
</script>

<style lang="scss" scoped>
  @import "../assets/theme.scss";

  .draggable-block {
    position: absolute;
    background-color: #fff;
    border: 2px solid $primary-color;
    border-radius: 10px;
    color: $primary-color;
    box-sizing: border-box;
    overflow: hidden;
    width: var(--width, 600px);
    height: var(--height, 500px);
    -webkit-user-select: none; 
    -ms-user-select: none; 
    user-select: none;
  }

  .window-header {
    padding: 5px;
    background-color: $background-color;
    border-bottom: 2px solid $primary-color;
  }

  .window-header span {
    margin-right: 10px;
  }

  .window-content {
    padding: 12px;
    overflow-y: hidden;
  }

  .dragged {
    outline: solid $primary-color;
  }
</style>