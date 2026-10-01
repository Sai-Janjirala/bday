/**
 * Petals — the site's one celebration system.
 *
 * Replaces the old emoji confetti. Two modes, same engine:
 *   · `fall`  — a slow drift of petals and dust, for the finale.
 *   · `burst` — a small radial puff from a point, for taps and reveals.
 *
 * Canvas rather than hundreds of DOM nodes, one rAF loop, DPR-aware,
 * and it shuts itself off when the animation is over. Renders nothing
 * at all under `prefers-reduced-motion`.
 */
import { useEffect, useRef } from "react";
import { useReducedMotion } from "framer-motion";

export interface BurstOrigin {
  /** Viewport pixels. */
  x: number;
  y: number;
}

interface PetalsProps {
  active: boolean;
  mode?: "fall" | "burst";
  count?: number;
  origin?: BurstOrigin;
  /** Milliseconds before the loop stops. */
  duration?: number;
  className?: string;
}

type Shape = "petal" | "heart" | "spark" | "dust";

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
  rotation: number;
  spin: number;
  opacity: number;
  sway: number;
  swaySpeed: number;
  phase: number;
  color: string;
  shape: Shape;
  life: number;
  maxLife: number;
}

// Rose, blush and a little brass. Nothing saturated, nothing primary.
const COLORS = [
  "rgba(176, 101, 124, 0.75)",
  "rgba(230, 204, 211, 0.8)",
  "rgba(248, 236, 236, 0.7)",
  "rgba(169, 138, 86, 0.55)",
  "rgba(141, 74, 94, 0.55)",
  "rgba(252, 249, 245, 0.9)",
];

const SHAPES: Shape[] = ["petal", "petal", "petal", "heart", "spark", "dust"];

function drawPetal(ctx: CanvasRenderingContext2D, size: number) {
  const s = size;
  ctx.beginPath();
  ctx.moveTo(0, -s);
  ctx.bezierCurveTo(s * 0.85, -s * 0.45, s * 0.65, s * 0.65, 0, s);
  ctx.bezierCurveTo(-s * 0.65, s * 0.65, -s * 0.85, -s * 0.45, 0, -s);
  ctx.fill();
}

function drawHeart(ctx: CanvasRenderingContext2D, size: number) {
  const s = size;
  ctx.beginPath();
  ctx.moveTo(0, s * 0.85);
  ctx.bezierCurveTo(-s * 1.5, -s * 0.2, -s * 0.55, -s * 1.35, 0, -s * 0.5);
  ctx.bezierCurveTo(s * 0.55, -s * 1.35, s * 1.5, -s * 0.2, 0, s * 0.85);
  ctx.fill();
}

function drawSpark(ctx: CanvasRenderingContext2D, size: number) {
  const s = size;
  ctx.beginPath();
  ctx.moveTo(0, -s);
  ctx.quadraticCurveTo(0, 0, s, 0);
  ctx.quadraticCurveTo(0, 0, 0, s);
  ctx.quadraticCurveTo(0, 0, -s, 0);
  ctx.quadraticCurveTo(0, 0, 0, -s);
  ctx.fill();
}

export default function Petals({
  active,
  mode = "fall",
  count = 44,
  origin,
  duration = 4200,
  className = "",
}: PetalsProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const reduced = useReducedMotion();

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || !active || reduced) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    const width = window.innerWidth;
    const height = window.innerHeight;
    canvas.width = width * dpr;
    canvas.height = height * dpr;
    canvas.style.width = `${width}px`;
    canvas.style.height = `${height}px`;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

    const maxLife = duration;
    const particles: Particle[] = [];

    for (let i = 0; i < count; i += 1) {
      const shape = SHAPES[Math.floor(Math.random() * SHAPES.length)];
      // Give each particle a different lifetime so they don't all die
      // at the same frame.
      const life = maxLife * (0.55 + Math.random() * 0.45);
      const isDust = shape === "dust";

      let x: number;
      let y: number;
      let vx: number;
      let vy: number;

      if (mode === "burst") {
        const source = origin ?? { x: width / 2, y: height / 2 };
        // Even spread around the circle, with a little jitter.
        const angle = (i / count) * Math.PI * 2 + (Math.random() - 0.5) * 0.5;
        const speed = 1.6 + Math.random() * 4.4;
        x = source.x;
        y = source.y;
        vx = Math.cos(angle) * speed;
        vy = Math.sin(angle) * speed - 1.6;
      } else {
        x = Math.random() * width;
        y = -30 - Math.random() * height * 0.55;
        vx = (Math.random() - 0.5) * 0.35;
        vy = 0.32 + Math.random() * 0.7;
      }

      particles.push({
        x,
        y,
        vx,
        vy,
        size: isDust ? 1 + Math.random() * 1.8 : 3.5 + Math.random() * 6.5,
        rotation: Math.random() * Math.PI * 2,
        spin: (Math.random() - 0.5) * (mode === "burst" ? 0.14 : 0.045),
        opacity: 0,
        sway: 0.3 + Math.random() * 0.9,
        swaySpeed: 0.008 + Math.random() * 0.016,
        phase: Math.random() * Math.PI * 2,
        color: COLORS[Math.floor(Math.random() * COLORS.length)],
        shape,
        life: 0,
        maxLife: life,
      });
    }

    let frame = 0;
    let previous = performance.now();

    const tick = (now: number) => {
      // Cap delta so a backgrounded tab doesn't teleport everything.
      const dt = Math.min((now - previous) / 16.667, 3);
      previous = now;
      ctx.clearRect(0, 0, width, height);

      let alive = 0;

      for (const p of particles) {
        if (p.life >= p.maxLife) continue;
        p.life += dt * (1000 / 60);

        const progress = p.life / p.maxLife;
        // Fade in fast, out slow.
        p.opacity = Math.min(1, progress * 6) * (1 - progress) ** 1.4;

        p.phase += p.swaySpeed * dt;
        p.x += (p.vx + Math.sin(p.phase) * p.sway) * dt;
        p.y += p.vy * dt;
        p.vy += (mode === "burst" ? 0.075 : 0.004) * dt;
        p.rotation += p.spin * dt;

        if (mode === "fall" && p.y > height + 40) continue;

        ctx.save();
        ctx.translate(p.x, p.y);
        ctx.rotate(p.rotation);
        ctx.globalAlpha = Math.max(0, p.opacity);
        ctx.fillStyle = p.color;

        if (p.shape === "heart") drawHeart(ctx, p.size);
        else if (p.shape === "spark") drawSpark(ctx, p.size * 1.15);
        else if (p.shape === "dust") {
          ctx.beginPath();
          ctx.arc(0, 0, p.size, 0, Math.PI * 2);
          ctx.fill();
        } else drawPetal(ctx, p.size);

        ctx.restore();
        alive += 1;
      }

      if (alive > 0) frame = requestAnimationFrame(tick);
      else ctx.clearRect(0, 0, width, height);
    };

    frame = requestAnimationFrame(tick);
    return () => {
      cancelAnimationFrame(frame);
      ctx.clearRect(0, 0, width, height);
    };
  }, [active, mode, count, duration, origin, reduced]);

  if (reduced || !active) return null;

  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      className={`pointer-events-none fixed inset-0 z-[70] ${className}`}
    />
  );
}
