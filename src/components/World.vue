<template>
  <div id="world-container" ref="worldRef" class="vignette" :class="{ 'move-cursor': moveCursor }" @mousedown="addMoveCursor" @mouseup="removeMoveCursor">
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
  import { useDragScroll } from "../composables/dragScroll";

  const draggedBlock = ref<HTMLDivElement | null>(null);
  const activeBlock = ref<HTMLDivElement | null>(null);
  const mouseOffset = ref({ x: 0, y: 0 });
  const zIndexOrder = ref<string[]>([]);
  const moveCursor = ref(false);
  const worldRef = ref<HTMLElement | null>(null);
  let pan = shallowRef({ x: 0, y: 0 });

  onMounted(() => {
    if (!worldRef.value) return;
    pan = useDragScroll(worldRef.value).pan;


    document.addEventListener("mousemove", handleMouseMove);
    document.addEventListener("mouseup", handleEndDrag);
    zIndexOrder.value = updateWorldBlocks();
  });

  onUnmounted(() => {
    document.removeEventListener("mousemove", handleMouseMove);
    document.addEventListener("mouseup", handleEndDrag);
  });

  const addMoveCursor = (event: MouseEvent) => {
    if (event.button === 2) {
      moveCursor.value = true;
    }

    const target = event.target as HTMLElement;
    if (target && target.classList.contains('window-content')) {
      activeBlock.value = null;
    }
    if (activeBlock.value && !activeBlock.value.contains(event.target as Node)) {
      activeBlock.value = null;
    }
  }

  const removeMoveCursor = (event: MouseEvent) => {
    moveCursor.value = false;
  }

  const handleStartDrag = (dragged: DragEmit): void => {
    draggedBlock.value = dragged.element;
    activeBlock.value = dragged.element;
    const blockRect = dragged.element.getBoundingClientRect();
    const panX = pan.value.x;
    const panY = pan.value.y;
    mouseOffset.value = {
      x: dragged.event.clientX - blockRect.left + panX,
      y: dragged.event.clientY - blockRect.top + panY,
    };
    ZIndexMoveTop(dragged.element.id);
  }

  const handleEndDrag = () => {
    draggedBlock.value = null;
  }

  const handleMouseMove = (event: MouseEvent): void => {
    if (draggedBlock.value) {
      const world = document.getElementById('world-container');
      const block = draggedBlock.value;
      const worldRect = world?.getBoundingClientRect();
      if (!worldRect) return;

      // Factor in pan offset
      const panX = pan.value.x;
      const panY = pan.value.y;

      // Mouse position relative to world container, including pan
      let relX = event.clientX - worldRect.left - mouseOffset.value.x + panX;
      let relY = event.clientY - worldRect.top - mouseOffset.value.y + panY;

      // Clamp to world bounds
      const minX = 0;
      const minY = 0;
      const maxX = worldRect.width - block.offsetWidth;
      const maxY = worldRect.height - block.offsetHeight;

      relX = Math.max(minX, Math.min(maxX, relX));
      relY = Math.max(minY, Math.min(maxY, relY));

      block.style.left = `${relX}px`;
      block.style.top = `${relY}px`;
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
    left: -50vw;
    top: -50vh;
    width: 200vw;
    height: 200vh;
  }

  .vignette {
    z-index: 5;
    background: radial-gradient(circle, rgba(0,0,0,0) 25%, rgba(0,0,0,1) 100%);
    position: absolute;
    width: 100%;
    height: 100%;
  }
</style>