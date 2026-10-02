/**
 * StardustCanvas.tsx — Interactive stardust & fireflies canvas.
 *
 * Renders glowing celestial stardust particles that drift peacefully
 * and gently gravitate towards pointer movement on hover/touch.
 */
import { useEffect, useRef } from "react";
import { useReducedMotion } from "framer-motion";

interface StardustCanvasProps {
  className?: string;
  particleCount?: number;
  glowColor?: string;
}

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  radius: number;
  alpha: number;
  maxAlpha: number;
  twinkleSpeed: number;
  phase: number;
}

export default function StardustCanvas({
  className = "pointer-events-none absolute inset-0 z-10",
  particleCount = 45,
  glowColor = "217, 195, 145", // warm brass light
}: StardustCanvasProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const reduced = useReducedMotion();
  const mouseRef = useRef<{ x: number | null; y: number | null }>({ x: null, y: null });

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || reduced) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animationFrameId: number;
    let width = (canvas.width = canvas.offsetWidth);
    let height = (canvas.height = canvas.offsetHeight);

    const handleResize = () => {
      if (!canvas) return;
      width = canvas.width = canvas.offsetWidth;
      height = canvas.height = canvas.offsetHeight;
    };
    window.addEventListener("resize", handleResize);

    const handlePointerMove = (e: PointerEvent) => {
      const rect = canvas.getBoundingClientRect();
      mouseRef.current.x = e.clientX - rect.left;
      mouseRef.current.y = e.clientY - rect.top;
    };
    const handlePointerLeave = () => {
      mouseRef.current.x = null;
      mouseRef.current.y = null;
    };

    window.addEventListener("pointermove", handlePointerMove);
    window.addEventListener("pointerleave", handlePointerLeave);

    // Initialize particles
    const particles: Particle[] = Array.from({ length: particleCount }, () => ({
      x: Math.random() * width,
      y: Math.random() * height,
      vx: (Math.random() - 0.5) * 0.4,
      vy: -0.2 - Math.random() * 0.4,
      radius: 0.8 + Math.random() * 1.8,
      alpha: 0.2 + Math.random() * 0.5,
      maxAlpha: 0.4 + Math.random() * 0.5,
      twinkleSpeed: 0.02 + Math.random() * 0.03,
      phase: Math.random() * Math.PI * 2,
    }));

    const render = () => {
      ctx.clearRect(0, 0, width, height);

      const mx = mouseRef.current.x;
      const my = mouseRef.current.y;

      particles.forEach((p) => {
        p.phase += p.twinkleSpeed;
        p.alpha = Math.max(0.05, Math.sin(p.phase) * p.maxAlpha);

        // Gentle attraction to pointer if nearby
        if (mx !== null && my !== null) {
          const dx = mx - p.x;
          const dy = my - p.y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < 180 && dist > 10) {
            const force = (1 - dist / 180) * 0.18;
            p.x += (dx / dist) * force;
            p.y += (dy / dist) * force;
          }
        }

        p.x += p.vx;
        p.y += p.vy;

        // Wrap around
        if (p.y < -10) {
          p.y = height + 10;
          p.x = Math.random() * width;
        }
        if (p.x < -10) p.x = width + 10;
        if (p.x > width + 10) p.x = -10;

        // Draw particle with soft halo
        ctx.beginPath();
        const gradient = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, p.radius * 2.8);
        gradient.addColorStop(0, `rgba(${glowColor}, ${p.alpha})`);
        gradient.addColorStop(0.5, `rgba(${glowColor}, ${p.alpha * 0.4})`);
        gradient.addColorStop(1, `rgba(${glowColor}, 0)`);

        ctx.fillStyle = gradient;
        ctx.arc(p.x, p.y, p.radius * 2.8, 0, Math.PI * 2);
        ctx.fill();
      });

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      window.removeEventListener("resize", handleResize);
      window.removeEventListener("pointermove", handlePointerMove);
      window.removeEventListener("pointerleave", handlePointerLeave);
      cancelAnimationFrame(animationFrameId);
    };
  }, [reduced, particleCount, glowColor]);

  if (reduced) return null;

  return <canvas ref={canvasRef} className={className} />;
}
