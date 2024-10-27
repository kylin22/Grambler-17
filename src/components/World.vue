<template>
  <div id="world-container">
    <DraggableBlock
      id="terminal"
      class='block'
      title="Terminal"
      :activeBlock="activeBlock"
      @start-drag="handleStartDrag"
    >
      <p>/></p>
    </DraggableBlock>
  </div>
</template>

<script lang="ts" setup>
  import { ref } from "vue";
  import DraggableBlock from "./DraggableBlock.vue";
  import type { DragEmit } from "../types/worldTypes";

  const activeBlock = ref<HTMLDivElement | null>(null);
  const mouseOffset = ref({ x: 0, y: 0 });

  const handleStartDrag = (dragged: DragEmit): void => {
    activeBlock.value = dragged.element;
    mouseOffset.value = {
      x: dragged.event.clientX - dragged.element.offsetLeft,
      y: dragged.event.clientY - dragged.element.offsetTop,
    };
  }

  const handleEndDrag = () => {
    activeBlock.value = null;
  }

  const handleMouseMove = (event: MouseEvent): void => {
    if (activeBlock.value) {
      let newX = event.clientX - mouseOffset.value.x;
      let newY = event.clientY - mouseOffset.value.y;

      const maxLeft = (document.getElementById('world-container')?.clientWidth || 0) - activeBlock.value.offsetWidth;
      const maxTop = (document.getElementById('world-container')?.clientHeight || 0) - activeBlock.value.offsetHeight;
      
      newX = Math.max(0, Math.min(maxLeft, newX));
      newY = Math.max(0, Math.min(maxTop, newY));

      activeBlock.value.style.left = `${newX}px`;
      activeBlock.value.style.top = `${newY}px`;
    }
  }

  onMounted(() => {
    document.addEventListener("mousemove", handleMouseMove);
    document.addEventListener("mouseup", handleEndDrag);
  });

  onUnmounted(() => {
    document.removeEventListener("mousemove", handleMouseMove);
    document.addEventListener("mouseup", handleEndDrag);
  });
</script>

<style lang="scss" scoped>
  @import "../assets/theme.scss";

  .block {
    background-color: $background-color;
  }

  #world-container {
    display: block;
    width: 100%;
    height: 100%;
  }
</style>