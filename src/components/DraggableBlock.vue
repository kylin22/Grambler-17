<template>
  <div
    :id="blockId"
    :class="['draggable-block', blockClass, { selected: isActive }]"
    :style="{ zIndex: zOrder }"
  >
    <div class="window-header" @mousedown.stop.prevent="handleMouseDown">
      <span>{{ blockTitle }}</span>
    </div>
    <div id="content" :class="['window-content', { uninteractable: !isActive }]" v-if="showContent">
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
    width: var(--width, 600px);
    height: var(--height, 500px);
    -webkit-user-select: none; 
    -ms-user-select: none; 
    user-select: none;
    display: flex;
    flex-direction: column;
    caret-color: auto;
    position: absolute;
    top: calc(50% - (var(--height, 500px) / 2));
    left: calc(50% - (var(--width, 600px) / 2));
  }

  .window-header {
    z-index: 0;
    padding: 5px;
    background-color: transparent;
    border-bottom: 2px solid $primary-color;
  }

  .window-header span {
    margin-right: 10px;
  }

  .window-content {
    display: flex;
    overflow: hidden;
    z-index: 1;
    padding: 8px;
  }

  .selected {
    outline: solid $primary-color;
  }

  .uninteractable {
    pointer-events: none;
  }
</style>