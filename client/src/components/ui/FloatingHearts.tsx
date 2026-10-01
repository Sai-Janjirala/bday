/**
 * FloatingHearts — ambient particle layer.
 *
 * Sparse, slow motes that hang in the air rather than shoot upward.
 * Used behind the intro, hero and finale to give those beats depth.
 *
 * Notes on the rewrite: the loop is capped at ~40fps (it is a
 * background layer, not a foreground animation), the DPR is capped at
 * 1.5, the transform is no longer re-scaled on every resize, and the
 * whole thing stands down when the tab is hidden or the visitor has
 * asked for reduced motion.
 */
import { useEffect, useRef } from "react";

interface Mote {
  x: number;
  y: number;
  size: number;
  speedX: number;
  speedY: number;
  phase: number;
  phaseSpeed: number;
  baseOpacity: number;
  shape: "dot" | "spark" | "ring";
}

interface FloatingHeartsProps {
  /** Motes to keep alive. Kept low on purpose. */
  count?: number;
  colors?: string[];
  className?: string;
  /** Multiply the default density — useful for very small viewports. */
  density?: number;
}

const MOTE_COLORS = [
  "rgba(176, 101, 124, 0.5)",
  "rgba(230, 204, 211, 0.6)",
  "rgba(169, 138, 86, 0.42)",
  "rgba(252, 249, 245, 0.55)",
];

const FRAME_MS = 1000 / 40;

function drawSpark(ctx: CanvasRenderingContext2D, s: number) {
  ctx.beginPath();
  ctx.moveTo(0, -s);
  ctx.quadraticCurveTo(0, 0, s, 0);
  ctx.quadraticCurveTo(0, 0, 0, s);
  ctx.quadraticCurveTo(0, 0, -s, 0);
  ctx.quadraticCurveTo(0, 0, 0, -s);
  ctx.fill();
}

export default function FloatingHearts({
  count = 22,
  colors = MOTE_COLORS,
  className = "",
  density = 1,
}: FloatingHeartsProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const reduced = window.matchMedia?.(
      "(prefers-reduced-motion: reduce)",
    ).matches;
    if (reduced) return;

    const dpr = Math.min(window.devicePixelRatio || 1, 1.5);
    let width = 0;
    let height = 0;

    const resize = () => {
      width = canvas.offsetWidth;
      height = canvas.offsetHeight;
      canvas.width = Math.max(1, Math.round(width * dpr));
      canvas.height = Math.max(1, Math.round(height * dpr));
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };
    resize();

    const observer = new ResizeObserver(resize);
    observer.observe(canvas);

    const total = Math.max(6, Math.round(count * density));
    const shapes: Mote["shape"][] = ["dot", "dot", "spark", "ring"];

    const motes: Mote[] = Array.from({ length: total }, () => ({
      x: Math.random() * width,
      y: Math.random() * height,
      size: 0.9 + Math.random() * 2.6,
      speedX: (Math.random() - 0.5) * 0.09,
      speedY: -(0.04 + Math.random() * 0.13),
      phase: Math.random() * Math.PI * 2,
      phaseSpeed: 0.004 + Math.random() * 0.011,
      baseOpacity: 0.16 + Math.random() * 0.4,
      shape: shapes[Math.floor(Math.random() * shapes.length)],
    }));

    let raf = 0;
    let previous = performance.now();
    let running = true;

    const frame = (now: number) => {
      if (!running) return;
      // ~40fps is plenty for a drifting background field.
      if (now - previous < FRAME_MS) {
        raf = requestAnimationFrame(frame);
        return;
      }
      const dt = Math.min((now - previous) / 16.667, 3);
      previous = now;

      ctx.clearRect(0, 0, width, height);

      for (const mote of motes) {
        mote.phase += mote.phaseSpeed * dt;
        mote.x += (mote.speedX + Math.sin(mote.phase) * 0.16) * dt;
        mote.y += mote.speedY * dt;

        // Wrap rather than respawn, so the field never thins out.
        if (mote.y < -12) {
          mote.y = height + 12;
          mote.x = Math.random() * width;
        }
        if (mote.x < -12) mote.x = width + 12;
        if (mote.x > width + 12) mote.x = -12;

        const breathe = 0.6 + 0.4 * Math.sin(mote.phase * 1.7);
        ctx.globalAlpha = mote.baseOpacity * breathe;
        ctx.fillStyle = colors[Math.floor(Math.random() * colors.length)];

        ctx.save();
        ctx.translate(mote.x, mote.y);
        if (mote.shape === "spark") {
          drawSpark(ctx, mote.size * 2.6);
        } else if (mote.shape === "ring") {
          ctx.globalAlpha *= 0.7;
          ctx.beginPath();
          ctx.arc(0, 0, mote.size * 1.7, 0, Math.PI * 2);
          ctx.stroke();
        } else {
          ctx.beginPath();
          ctx.arc(0, 0, mote.size, 0, Math.PI * 2);
          ctx.fill();
        }
        ctx.restore();
      }

      ctx.globalAlpha = 1;
      raf = requestAnimationFrame(frame);
    };

    const onVisibility = () => {
      if (document.hidden) {
        running = false;
        cancelAnimationFrame(raf);
        ctx.clearRect(0, 0, width, height);
      } else if (!running) {
        running = true;
        previous = performance.now();
        raf = requestAnimationFrame(frame);
      }
    };

    document.addEventListener("visibilitychange", onVisibility);
    raf = requestAnimationFrame(frame);

    return () => {
      running = false;
      cancelAnimationFrame(raf);
      observer.disconnect();
      document.removeEventListener("visibilitychange", onVisibility);
    };
  }, [count, density, colors]);

  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      data-decorative="true"
      className={`pointer-events-none absolute inset-0 h-full w-full ${className}`}
    />
  );
}
