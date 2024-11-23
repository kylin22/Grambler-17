import { ref, onUnmounted } from "vue";
import { Vector2 } from "three";
//TODO fix small difference causing momentum in opposite direction (probably apply momentum only when dragged some set distance)
export const useDragScroll = (element: HTMLElement) => {
  const scrollRef = ref(element);
  const isDragging = ref(false);
  const isMomentum = ref(false);
  const MIN_SPEED = 0;
  const MAX_SPEED = 2;
  const FRICTION = 0.85;
  const MOMENTUM_REMOVE_RANGE = 0.001;
  const MOMENTUM_TIMESTEP = 16;
  let startPosition = new Vector2(0, 0);
  let velocity = new Vector2(0, 0);
  let lastTime = 0;
  let momentumInterval: NodeJS.Timeout | null = null;
  let momentumBuffer: NodeJS.Timeout | null = null;

  const startDrag = (event: MouseEvent) => {
    if (event.button !== 2) return;
    isDragging.value = true;
    startPosition = new Vector2(event.pageX, event.pageY);
    velocity = new Vector2(0, 0);
    lastTime = event.timeStamp;
    
    document.addEventListener("mousemove", moveDrag);
    document.addEventListener("mouseup", endDrag);
  }

  const moveDrag = (event: MouseEvent) => {
    if (!isDragging.value) return;
    
    const currentPosition = new Vector2(event.pageX, event.pageY) 
    const difference = currentPosition.sub(startPosition);
    const dt = event.timeStamp - lastTime;

    if (difference.length() > 0) {
      window.scrollBy({ left: -difference.x, top: -difference.y, behavior: "smooth" });
    }

    lastTime = event.timeStamp;

    velocity = difference.divideScalar(dt);

    if (momentumBuffer) {
      clearTimeout(momentumBuffer);
    }
    momentumBuffer = setTimeout(() => {
      velocity = new Vector2(0, 0);
    }, MOMENTUM_TIMESTEP);
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

    const dt = MOMENTUM_TIMESTEP;
    velocity.multiplyScalar(FRICTION);

    window.scrollBy({
      left: -velocity.x * dt,
      top: -velocity.y * dt,
      behavior: "smooth"
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