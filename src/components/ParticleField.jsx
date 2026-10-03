import { useEffect, useRef } from "react";

/* ─────────────────────────────────────────────────────────
 * PARTICLE FIELD STORYBOARD
 *
 *    0ms   a quiet grayscale field drifts behind the hero
 *   input  nearby particles curl around the pointer and leave short trails
 *  2600ms  after the pointer rests, the field follows a slow ambient path
 * ───────────────────────────────────────────────────────── */

const FIELD = {
  areaPerParticle: 620, // px² represented by each particle
  minParticles: 720, // keeps the field present on smaller desktop windows
  maxParticles: 2200, // caps the drawing cost on large displays
  coarsePointerScale: 0.45, // reduces work on touch-first devices
  maxPixelRatio: 2, // keeps the canvas crisp without excessive fill rate
  backgroundAlpha: 0.12, // resting visibility of each particle
  activeAlpha: 0.56, // additional opacity close to the pointer
  minSize: 0.65, // px resting particle size
  sizeRange: 1.25, // px size variation between depth layers
  activeSize: 1.25, // px growth close to the pointer
  trailLength: 0.02, // seconds of velocity shown behind moving particles
};

const MOTION = {
  idleDelay: 2600, // ms before the ambient pointer path resumes
  maxDelta: 0.034, // seconds; prevents jumps after a backgrounded tab returns
  cursorFollow: 7.5, // exponential smoothing strength
  spring: 12, // force returning particles to their resting positions
  damping: 4.8, // velocity damping per second
  radiusMin: 150, // px interaction radius on narrow layouts
  radiusMax: 245, // px interaction radius on wide layouts
  pushForce: 165, // radial force near the pointer
  curlForce: 230, // tangential force that creates the orbiting wake
  wobble: 7, // px ambient movement around each resting position
  wobbleSpeed: 0.34, // ambient field speed
  autoSpeed: 0.18, // idle pointer path speed
};

const APPEARANCE = {
  color: "23, 24, 26", // grayscale ink, stored as RGB for per-dot alpha
  edgeFade: 0.13, // viewport fraction used to soften the canvas edges
};

function seededRandom(seed) {
  let value = seed >>> 0;
  return () => {
    value = (value * 1664525 + 1013904223) >>> 0;
    return value / 4294967296;
  };
}

function ambientPointer(time, width, height) {
  return {
    x: width * (0.5 + 0.37 * Math.sin(time) * Math.cos(time * 0.31)),
    y: height * (0.5 + 0.32 * Math.sin(time * 0.63 + 1.2)),
  };
}

function buildParticles(width, height, coarsePointer) {
  const scale = coarsePointer ? FIELD.coarsePointerScale : 1;
  const targetCount = Math.round((width * height * scale) / FIELD.areaPerParticle);
  const count = Math.min(
    FIELD.maxParticles,
    Math.max(Math.round(FIELD.minParticles * scale), targetCount),
  );
  const columns = Math.max(1, Math.round(Math.sqrt((count * width) / height)));
  const rows = Math.max(1, Math.ceil(count / columns));
  const cellWidth = width / columns;
  const cellHeight = height / rows;
  const random = seededRandom(Math.round(width * 13 + height * 17));

  return Array.from({ length: count }, (_, index) => {
    const column = index % columns;
    const row = Math.floor(index / columns);
    const baseX = (column + 0.18 + random() * 0.64) * cellWidth;
    const baseY = (row + 0.18 + random() * 0.64) * cellHeight;

    return {
      baseX,
      baseY,
      x: baseX,
      y: baseY,
      velocityX: 0,
      velocityY: 0,
      phase: random() * Math.PI * 2,
      depth: 0.45 + random() * 0.55,
    };
  });
}

function getEdgeOpacity(x, y, width, height) {
  const horizontal = Math.min(x, width - x) / (width * APPEARANCE.edgeFade);
  const vertical = Math.min(y, height - y) / (height * APPEARANCE.edgeFade);
  return Math.max(0, Math.min(1, horizontal, vertical));
}

export default function ParticleField() {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const context = canvas?.getContext("2d", { alpha: true });
    if (!canvas || !context) return undefined;

    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
    const coarsePointer = window.matchMedia("(pointer: coarse)");
    let particles = [];
    let width = 0;
    let height = 0;
    let pixelRatio = 1;
    let frame = 0;
    let previousTime = performance.now();
    let ambientTime = Math.PI * 0.72;
    let lastPointerMove = -Infinity;
    let isVisible = true;
    let isDocumentVisible = !document.hidden;
    let pointerInsideHero = false;
    const pointer = { x: 0, y: 0 };
    const smoothedPointer = { x: 0, y: 0 };

    const resize = () => {
      const bounds = canvas.getBoundingClientRect();
      width = Math.max(1, bounds.width);
      height = Math.max(1, bounds.height);
      pixelRatio = Math.min(window.devicePixelRatio || 1, FIELD.maxPixelRatio);
      canvas.width = Math.round(width * pixelRatio);
      canvas.height = Math.round(height * pixelRatio);
      context.setTransform(pixelRatio, 0, 0, pixelRatio, 0, 0);
      particles = buildParticles(width, height, coarsePointer.matches);

      const startingPoint = ambientPointer(ambientTime, width, height);
      pointer.x = startingPoint.x;
      pointer.y = startingPoint.y;
      smoothedPointer.x = startingPoint.x;
      smoothedPointer.y = startingPoint.y;
    };

    const handlePointerMove = (event) => {
      if (event.pointerType === "touch") return;
      const bounds = canvas.getBoundingClientRect();
      pointerInsideHero =
        event.clientX >= bounds.left &&
        event.clientX <= bounds.right &&
        event.clientY >= bounds.top &&
        event.clientY <= bounds.bottom;
      if (!pointerInsideHero) return;

      pointer.x = event.clientX - bounds.left;
      pointer.y = event.clientY - bounds.top;
      lastPointerMove = performance.now();
    };

    const handleVisibilityChange = () => {
      isDocumentVisible = !document.hidden;
      previousTime = performance.now();
      if (isDocumentVisible) start();
      else stop();
    };

    const render = (time) => {
      const delta = Math.min(MOTION.maxDelta, Math.max(0, (time - previousTime) / 1000));
      previousTime = time;
      context.clearRect(0, 0, width, height);

      const userIsActive = pointerInsideHero && time - lastPointerMove < MOTION.idleDelay;
      if (!userIsActive) {
        ambientTime += delta * MOTION.autoSpeed;
        const ambient = ambientPointer(ambientTime, width, height);
        pointer.x = ambient.x;
        pointer.y = ambient.y;
      }

      const cursorEase = 1 - Math.exp(-MOTION.cursorFollow * delta);
      smoothedPointer.x += (pointer.x - smoothedPointer.x) * cursorEase;
      smoothedPointer.y += (pointer.y - smoothedPointer.y) * cursorEase;

      const interactionRadius = Math.min(
        MOTION.radiusMax,
        Math.max(MOTION.radiusMin, width * 0.19),
      );
      const damping = Math.exp(-MOTION.damping * delta);
      const fieldTime = time * 0.001 * MOTION.wobbleSpeed;

      particles.forEach((particle) => {
        const wobbleX = Math.sin(fieldTime + particle.phase) * MOTION.wobble * particle.depth;
        const wobbleY =
          Math.cos(fieldTime * 0.83 + particle.phase * 1.7) * MOTION.wobble * particle.depth;
        const restingX = particle.baseX + wobbleX;
        const restingY = particle.baseY + wobbleY;
        const deltaX = particle.x - smoothedPointer.x;
        const deltaY = particle.y - smoothedPointer.y;
        const distance = Math.sqrt(deltaX * deltaX + deltaY * deltaY) || 1;
        const proximity = Math.max(0, 1 - distance / interactionRadius);
        const force = proximity * proximity * particle.depth;

        if (force > 0) {
          const normalX = deltaX / distance;
          const normalY = deltaY / distance;
          particle.velocityX +=
            (normalX * MOTION.pushForce - normalY * MOTION.curlForce) * force * delta;
          particle.velocityY +=
            (normalY * MOTION.pushForce + normalX * MOTION.curlForce) * force * delta;
        }

        particle.velocityX += (restingX - particle.x) * MOTION.spring * delta;
        particle.velocityY += (restingY - particle.y) * MOTION.spring * delta;
        particle.velocityX *= damping;
        particle.velocityY *= damping;
        particle.x += particle.velocityX * delta;
        particle.y += particle.velocityY * delta;

        const edgeOpacity = getEdgeOpacity(particle.x, particle.y, width, height);
        const opacity =
          (FIELD.backgroundAlpha + proximity * FIELD.activeAlpha) *
          edgeOpacity *
          particle.depth;
        const size =
          FIELD.minSize + particle.depth * FIELD.sizeRange + proximity * FIELD.activeSize;

        if (proximity > 0.08) {
          context.beginPath();
          context.moveTo(
            particle.x - particle.velocityX * FIELD.trailLength,
            particle.y - particle.velocityY * FIELD.trailLength,
          );
          context.lineTo(particle.x, particle.y);
          context.strokeStyle = `rgba(${APPEARANCE.color}, ${opacity * 0.62})`;
          context.lineWidth = Math.max(0.5, size * 0.48);
          context.stroke();
        }

        context.fillStyle = `rgba(${APPEARANCE.color}, ${opacity})`;
        context.fillRect(particle.x - size / 2, particle.y - size / 2, size, size);
      });

      if (isVisible && isDocumentVisible && !reducedMotion.matches) {
        frame = window.requestAnimationFrame(render);
      } else {
        frame = 0;
      }
    };

    const start = () => {
      if (frame || !isVisible || !isDocumentVisible || reducedMotion.matches) return;
      previousTime = performance.now();
      frame = window.requestAnimationFrame(render);
    };

    const stop = () => {
      if (frame) window.cancelAnimationFrame(frame);
      frame = 0;
      context.clearRect(0, 0, width, height);
    };

    const handleMotionPreference = () => {
      if (reducedMotion.matches) stop();
      else start();
    };

    const observer = new IntersectionObserver(([entry]) => {
      isVisible = entry.isIntersecting;
      if (isVisible) start();
      else stop();
    });
    const resizeObserver = new ResizeObserver(resize);

    resize();
    observer.observe(canvas);
    resizeObserver.observe(canvas);
    window.addEventListener("pointermove", handlePointerMove, { passive: true });
    document.addEventListener("visibilitychange", handleVisibilityChange);
    reducedMotion.addEventListener("change", handleMotionPreference);
    coarsePointer.addEventListener("change", resize);
    start();

    return () => {
      stop();
      observer.disconnect();
      resizeObserver.disconnect();
      window.removeEventListener("pointermove", handlePointerMove);
      document.removeEventListener("visibilitychange", handleVisibilityChange);
      reducedMotion.removeEventListener("change", handleMotionPreference);
      coarsePointer.removeEventListener("change", resize);
    };
  }, []);

  return <canvas ref={canvasRef} className="particle-field" aria-hidden="true" />;
}
