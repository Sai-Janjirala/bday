/**
 * FloatingHearts — Canvas-based floating heart particle system
 * Renders soft, dreamy hearts that drift upward with gentle physics
 */
import { useEffect, useRef, useCallback } from "react";

interface Particle {
  x: number;
  y: number;
  size: number;
  speedY: number;
  speedX: number;
  opacity: number;
  rotation: number;
  rotationSpeed: number;
  color: string;
  type: "sparkle" | "star" | "bokeh";
}

interface FloatingHeartsProps {
  /** Number of particles to render */
  count?: number;
  /** Colors to randomly pick from */
  colors?: string[];
  /** CSS class for the canvas container */
  className?: string;
}

const CELEBRATION_COLORS = [
  "rgba(212, 168, 83, 0.6)",  // Gold
  "rgba(240, 217, 141, 0.5)", // Light gold
  "rgba(232, 160, 191, 0.4)", // Rose
  "rgba(217, 119, 6, 0.4)",   // Amber
  "rgba(254, 251, 246, 0.7)", // Soft white
];

export default function FloatingHearts({
  count = 25,
  colors = CELEBRATION_COLORS,
  className = "",
}: FloatingHeartsProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const heartsRef = useRef<Particle[]>([]);
  const animationRef = useRef<number>(0);

  const createParticle = useCallback(
    (canvasWidth: number, canvasHeight: number, startFromBottom = false): Particle => {
      const types: ("sparkle" | "star" | "bokeh")[] = ["sparkle", "star", "bokeh"];
      return {
        x: Math.random() * canvasWidth,
        y: startFromBottom
          ? canvasHeight + Math.random() * 50
          : Math.random() * canvasHeight,
        size: Math.random() * 8 + 4,
        speedY: -(Math.random() * 0.5 + 0.2),
        speedX: (Math.random() - 0.5) * 0.3,
        opacity: Math.random() * 0.6 + 0.2,
        rotation: Math.random() * Math.PI * 2,
        rotationSpeed: (Math.random() - 0.5) * 0.02,
        color: colors[Math.floor(Math.random() * colors.length)],
        type: types[Math.floor(Math.random() * types.length)],
      };
    },
    [colors]
  );

  const drawParticle = useCallback(
    (ctx: CanvasRenderingContext2D, p: Particle) => {
      ctx.save();
      ctx.translate(p.x, p.y);
      ctx.rotate(p.rotation);
      ctx.globalAlpha = p.opacity;
      ctx.fillStyle = p.color;

      if (p.type === "star") {
        // 4-point star sparkle
        const s = p.size;
        ctx.beginPath();
        ctx.moveTo(0, -s);
        ctx.quadraticCurveTo(0, 0, s, 0);
        ctx.quadraticCurveTo(0, 0, 0, s);
        ctx.quadraticCurveTo(0, 0, -s, 0);
        ctx.quadraticCurveTo(0, 0, 0, -s);
        ctx.fill();
      } else if (p.type === "sparkle") {
        // Diamond sparkle
        const s = p.size * 0.8;
        ctx.beginPath();
        ctx.moveTo(0, -s);
        ctx.lineTo(s * 0.6, 0);
        ctx.lineTo(0, s);
        ctx.lineTo(-s * 0.6, 0);
        ctx.closePath();
        ctx.fill();
      } else {
        // Soft glowing circular bokeh
        ctx.beginPath();
        ctx.arc(0, 0, p.size * 0.6, 0, Math.PI * 2);
        ctx.fill();
      }

      ctx.restore();
    },
    []
  );

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const resizeCanvas = () => {
      const dpr = window.devicePixelRatio || 1;
      canvas.width = canvas.offsetWidth * dpr;
      canvas.height = canvas.offsetHeight * dpr;
      ctx.scale(dpr, dpr);
    };

    resizeCanvas();
    window.addEventListener("resize", resizeCanvas);

    // Initialize particles
    heartsRef.current = Array.from({ length: count }, () =>
      createParticle(canvas.offsetWidth, canvas.offsetHeight)
    );

    const animate = () => {
      ctx.clearRect(0, 0, canvas.offsetWidth, canvas.offsetHeight);

      heartsRef.current.forEach((particle, i) => {
        particle.y += particle.speedY;
        particle.x += particle.speedX + Math.sin(particle.y * 0.01) * 0.3;
        particle.rotation += particle.rotationSpeed;
        particle.opacity *= 0.9995;

        // Reset particle when it goes off screen
        if (particle.y < -20 || particle.opacity < 0.01) {
          heartsRef.current[i] = createParticle(
            canvas.offsetWidth,
            canvas.offsetHeight,
            true
          );
        }

        drawParticle(ctx, particle);
      });

      animationRef.current = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      cancelAnimationFrame(animationRef.current);
      window.removeEventListener("resize", resizeCanvas);
    };
  }, [count, createParticle, drawParticle]);

  return (
    <canvas
      ref={canvasRef}
      className={`absolute inset-0 w-full h-full pointer-events-none ${className}`}
      style={{ zIndex: 1 }}
    />
  );
}
