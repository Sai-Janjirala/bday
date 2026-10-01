/**
 * FloatingHearts — Canvas-based floating heart particle system
 * Renders soft, dreamy hearts that drift upward with gentle physics
 */
import { useEffect, useRef, useCallback } from "react";

interface Heart {
  x: number;
  y: number;
  size: number;
  speedY: number;
  speedX: number;
  opacity: number;
  rotation: number;
  rotationSpeed: number;
  color: string;
}

interface FloatingHeartsProps {
  /** Number of hearts to render */
  count?: number;
  /** Colors to randomly pick from */
  colors?: string[];
  /** CSS class for the canvas container */
  className?: string;
}

const HEART_COLORS = [
  "rgba(232, 160, 191, 0.6)",
  "rgba(196, 91, 124, 0.4)",
  "rgba(212, 184, 224, 0.5)",
  "rgba(212, 168, 83, 0.3)",
  "rgba(249, 228, 228, 0.7)",
];

export default function FloatingHearts({
  count = 25,
  colors = HEART_COLORS,
  className = "",
}: FloatingHeartsProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const heartsRef = useRef<Heart[]>([]);
  const animationRef = useRef<number>(0);

  const createHeart = useCallback(
    (canvasWidth: number, canvasHeight: number, startFromBottom = false): Heart => ({
      x: Math.random() * canvasWidth,
      y: startFromBottom
        ? canvasHeight + Math.random() * 50
        : Math.random() * canvasHeight,
      size: Math.random() * 12 + 6,
      speedY: -(Math.random() * 0.6 + 0.2),
      speedX: (Math.random() - 0.5) * 0.4,
      opacity: Math.random() * 0.5 + 0.2,
      rotation: Math.random() * Math.PI * 2,
      rotationSpeed: (Math.random() - 0.5) * 0.02,
      color: colors[Math.floor(Math.random() * colors.length)],
    }),
    [colors]
  );

  const drawHeart = useCallback(
    (ctx: CanvasRenderingContext2D, heart: Heart) => {
      ctx.save();
      ctx.translate(heart.x, heart.y);
      ctx.rotate(heart.rotation);
      ctx.globalAlpha = heart.opacity;
      ctx.fillStyle = heart.color;
      ctx.beginPath();

      const s = heart.size;
      ctx.moveTo(0, s * 0.3);
      ctx.bezierCurveTo(-s * 0.5, -s * 0.3, -s, s * 0.1, 0, s);
      ctx.bezierCurveTo(s, s * 0.1, s * 0.5, -s * 0.3, 0, s * 0.3);

      ctx.fill();
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

    // Initialize hearts
    heartsRef.current = Array.from({ length: count }, () =>
      createHeart(canvas.offsetWidth, canvas.offsetHeight)
    );

    const animate = () => {
      ctx.clearRect(0, 0, canvas.offsetWidth, canvas.offsetHeight);

      heartsRef.current.forEach((heart, i) => {
        heart.y += heart.speedY;
        heart.x += heart.speedX + Math.sin(heart.y * 0.01) * 0.3;
        heart.rotation += heart.rotationSpeed;
        heart.opacity *= 0.9995;

        // Reset heart when it goes off screen
        if (heart.y < -20 || heart.opacity < 0.01) {
          heartsRef.current[i] = createHeart(
            canvas.offsetWidth,
            canvas.offsetHeight,
            true
          );
        }

        drawHeart(ctx, heart);
      });

      animationRef.current = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      cancelAnimationFrame(animationRef.current);
      window.removeEventListener("resize", resizeCanvas);
    };
  }, [count, createHeart, drawHeart]);

  return (
    <canvas
      ref={canvasRef}
      className={`absolute inset-0 w-full h-full pointer-events-none ${className}`}
      style={{ zIndex: 1 }}
    />
  );
}
