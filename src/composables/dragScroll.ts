import { ref, onUnmounted } from "vue";
import { Vector2 } from "three";

export const useDragScroll = (element: HTMLElement) => {
  const scrollRef = ref(element);
  const isDragging = ref(false);
  const isMomentum = ref(false);
  const MIN_SPEED = 0;
  const MAX_SPEED = 2;
  const FRICTION = 0.90;
  const MOMENTUM_REMOVE_RANGE = 0.001;
  const MOMENTUM_TIMESTEP = 16;
  const MOMENTUM_APPLY_MARGIN = 50;
  let startPosition = new Vector2(0, 0);
  let lastPosition = new Vector2(0, 0);
  let velocity = new Vector2(0, 0);
  let lastTime = 0;
  let momentumInterval: NodeJS.Timeout | null = null;
  let momentumBuffer: NodeJS.Timeout | null = null;

  const startDrag = (event: MouseEvent) => {
    isMomentum.value = false;
    if (event.button !== 2) return;
    isDragging.value = true;
    startPosition = new Vector2(event.clientX, event.clientY);
    lastPosition = new Vector2(event.clientX, event.clientY);
    velocity = new Vector2(0, 0);
    lastTime = event.timeStamp;
    
    document.addEventListener("mousemove", moveDrag);
    document.addEventListener("mouseup", endDrag);
  }

  const moveDrag = (event: MouseEvent) => {
    if (!isDragging.value) return;
    
    const currentPosition = new Vector2(event.clientX, event.clientY);

    const difference = new Vector2().copy(lastPosition).sub(currentPosition);
    const dt = event.timeStamp - lastTime;
    if (difference.length() > 0) {
      window.scrollBy({ left: difference.x, top: difference.y, behavior: "auto" });
    }

    lastTime = event.timeStamp;
    lastPosition = new Vector2().copy(currentPosition);

    velocity = difference.divideScalar(dt);

    if (momentumBuffer) {
      clearTimeout(momentumBuffer);
    }
    momentumBuffer = setTimeout(() => {
      velocity = new Vector2(0, 0);
    }, MOMENTUM_APPLY_MARGIN);
  }

  const endDrag = () => {
    isDragging.value = false;
    document.removeEventListener("mousemove", moveDrag);
    document.removeEventListener("mouseup", endDrag);

    if (velocity.length() > MIN_SPEED) {
      isMomentum.value = true;
      if (velocity.length() > MAX_SPEED) {
        velocity.normalize().multiplyScalar(MAX_SPEED);
      }
      if (momentumBuffer) {
        clearTimeout(momentumBuffer);
      }
      momentumInterval = setInterval(updateMomentum, MOMENTUM_TIMESTEP); // 16ms = ~60fps
    }
  }

  const updateMomentum = () => {
    if (!isMomentum.value) {
      clearInterval(momentumInterval!);
      momentumInterval = null;
      return;
    }
    
    velocity.multiplyScalar(FRICTION);

    window.scrollBy({
      left: velocity.x * MOMENTUM_TIMESTEP,
      top: velocity.y * MOMENTUM_TIMESTEP,
      behavior: "auto"
    });

    if (velocity.length() < MOMENTUM_REMOVE_RANGE) {
      isMomentum.value = false;
      clearInterval(momentumInterval!);
      momentumInterval = null;
    }
  }

  scrollRef.value.addEventListener("mousedown", startDrag);

  onUnmounted(() => {
    if (scrollRef.value) {
      scrollRef.value.removeEventListener("mousedown", startDrag);
    }
  })

  return {
    scrollRef,
    isDragging
  }
}