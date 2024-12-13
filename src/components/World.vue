<template>
  <div id="world-container" class="vignette" :class="{ 'move-cursor': moveCursor }" @mousedown="addMoveCursor" @mouseup="removeMoveCursor">
    <DraggableBlock
      id="terminal"
      class='block'
      title="Terminal"
      :activeBlock="activeBlock"
      @start-drag="handleStartDrag"
      :z-indices="zIndexOrder"
    >
      <Terminal/>
    </DraggableBlock>
  </div>
</template>

<script lang="ts" setup>
  import { ref } from "vue";
  import DraggableBlock from "./DraggableBlock.vue";
  import type { DragEmit } from "../types/worldTypes";
  import Terminal from "./Terminal.vue";

  const draggedBlock = ref<HTMLDivElement | null>(null);
  const activeBlock = ref<HTMLDivElement | null>(null);
  const mouseOffset = ref({ x: 0, y: 0 });
  const zIndexOrder = ref<string[]>([]);
  const moveCursor = ref(false);

  const addMoveCursor = (event: MouseEvent) => {
    if (event.button === 2) {
      moveCursor.value = true;
    }
  }

  const removeMoveCursor = (event: MouseEvent) => {
    moveCursor.value = false;
  }

  const handleStartDrag = (dragged: DragEmit): void => {
    draggedBlock.value = dragged.element;
    activeBlock.value = dragged.element;
    mouseOffset.value = {
      x: dragged.event.clientX - dragged.element.offsetLeft,
      y: dragged.event.clientY - dragged.element.offsetTop,
    };
    ZIndexMoveTop(dragged.element.id);
  }

  const handleEndDrag = () => {
    draggedBlock.value = null;
  }

  const handleMouseMove = (event: MouseEvent): void => {
    if (draggedBlock.value) {
      let newX = event.clientX - mouseOffset.value.x;
      let newY = event.clientY - mouseOffset.value.y;

      const maxLeft = (document.getElementById('world-container')?.clientWidth || 0) - draggedBlock.value.offsetWidth;
      const maxTop = (document.getElementById('world-container')?.clientHeight || 0) - draggedBlock.value.offsetHeight;
      
      newX = Math.max(0, Math.min(maxLeft, newX));
      newY = Math.max(0, Math.min(maxTop, newY));

      draggedBlock.value.style.left = `${newX}px`;
      draggedBlock.value.style.top = `${newY}px`;
    }
  }
  
  const updateWorldBlocks = () => {
    const draggableElements = document.querySelectorAll('.draggable-block');
    return Array.from(draggableElements).map(element => element.id);
  }

  const ZIndexMoveTop = (id: string) => {
    const index = zIndexOrder.value.findIndex(foundId => foundId === id);
    if (index !== -1) {
      zIndexOrder.value.splice(index, 1);
      zIndexOrder.value.push(id);
    }
  }

  onMounted(() => {
    document.addEventListener("mousemove", handleMouseMove);
    document.addEventListener("mouseup", handleEndDrag);
    zIndexOrder.value = updateWorldBlocks();

    document.addEventListener("contextmenu", (event) => {
      event.preventDefault();
    }, false);
  });

  onUnmounted(() => {
    document.removeEventListener("mousemove", handleMouseMove);
    document.addEventListener("mouseup", handleEndDrag);
  });
</script>

<style lang="scss" scoped>
  @import "../assets/theme.scss";

  .move-cursor {
    cursor: url("~/src/assets/cursors/move.png"), auto;
  }

  .block {
    background-color: $background-color;
  }

  #world-container {
    display: block;
    width: 200%;
    height: 200%;
  }

  .vignette {
    z-index: 5;
    background: radial-gradient(circle, rgba(0,0,0,0) 25%, rgba(0,0,0,1) 100%);
    position: absolute;
    width: 100%;
    height: 100%;
  }
</style>