import { ref, onUnmounted } from "vue";
import { Vector2 } from "three";
import { clamp } from "three/src/math/MathUtils.js";
 
export const useDragScroll = (element: HTMLElement) => {
  const isDragging = ref(false);
  const isMomentum = ref(false);
  const MIN_SPEED = 0;
  const MAX_SPEED = 3;
  const FRICTION = 0.9;
  const MOMENTUM_REMOVE_RANGE = 0.01;
  const MOMENTUM_TIMESTEP = 16;
  const MOMENTUM_APPLY_MARGIN = 50;
  let lastPosition = new Vector2(0, 0);
  let newPosition = shallowRef(new Vector2(0, 0));
  let velocity = new Vector2(0, 0);
  let lastTime = 0;
  let momentumInterval: NodeJS.Timeout | null = null;
  let momentumBuffer: NodeJS.Timeout | null = null;
  const elementDimensions = new Vector2(element.offsetWidth / 2, element.offsetHeight / 2);
  
  const updatePosition = (incrementX: number, incrementY: number) => {
    newPosition.value.x += incrementX;
    newPosition.value.y += incrementY;
    newPosition.value.x = clamp(newPosition.value.x, -elementDimensions.x / 2, elementDimensions.x / 2);
    newPosition.value.y = clamp(newPosition.value.y, -elementDimensions.y / 2, elementDimensions.y / 2);
    element.style.transform = `translate(${-newPosition.value.x}px, ${-newPosition.value.y}px)`;
  };

  const getPosition = (event: MouseEvent | TouchEvent) => {
    const clientX = event instanceof MouseEvent ? event.clientX : event.touches[0].clientX;
    const clientY = event instanceof MouseEvent ? event.clientY : event.touches[0].clientY;
    return new Vector2(clientX, clientY);
  }

  const startDrag = (event: MouseEvent | TouchEvent) => {
    isMomentum.value = false;
    isDragging.value = true;
    lastPosition = getPosition(event);
    velocity = new Vector2(0, 0);
    lastTime = event.timeStamp;
    
    document.addEventListener("mousemove", moveDrag);
    document.addEventListener("mouseup", endDrag);
    document.addEventListener("touchmove", moveDrag);
    document.addEventListener("touchend", endDrag);
  }

  const moveDrag = (event: MouseEvent | TouchEvent) => {
    if (!isDragging.value) return;
    
    const currentPosition = getPosition(event);

    const difference = new Vector2().copy(lastPosition).sub(currentPosition);
    const dt = event.timeStamp - lastTime;
    updatePosition(difference.x, difference.y);
    
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
    updatePosition(velocity.x * MOMENTUM_TIMESTEP, velocity.y * MOMENTUM_TIMESTEP);

    if (velocity.length() < MOMENTUM_REMOVE_RANGE) {
      isMomentum.value = false;
      clearInterval(momentumInterval!);
      momentumInterval = null;
    }
  }

  document.addEventListener("mousedown", startDrag);
  document.addEventListener("touchstart", startDrag);

  onUnmounted(() => {
    document.removeEventListener("mousedown", startDrag);
  });

  return {
    isDragging,
    pan: newPosition
  }
}