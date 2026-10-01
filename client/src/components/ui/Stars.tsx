/**
 * Stars — a quiet field of twinkling points for the night sections.
 *
 * Chromatic and never greedy: a low count, slow cycles, and a handful
 * of warm-toned stars so it reads as candlelight through a window
 * rather than a light show. The layout is precomputed once per count,
 * decorative only.
 */
import { motion, useReducedMotion } from "framer-motion";

interface StarField {
  left: number;
  top: number;
  size: number;
  delay: number;
  duration: number;
  gold: boolean;
}

const cache = new Map<number, StarField[]>();

function buildField(count: number): StarField[] {
  const cached = cache.get(count);
  if (cached) return cached;
  const field = Array.from({ length: count }, () => ({
    left: Math.random() * 100,
    top: Math.random() * 100,
    size: Math.random() * 1.6 + 1,
    delay: Math.random() * 6,
    duration: 3 + Math.random() * 5,
    gold: Math.random() < 0.28,
  }));
  cache.set(count, field);
  return field;
}

interface StarsProps {
  count?: number;
  className?: string;
}

export default function Stars({ count = 60, className = "" }: StarsProps) {
  const reduced = useReducedMotion();
  const stars = buildField(count);

  return (
    <div
      aria-hidden="true"
      data-decorative="true"
      className={`pointer-events-none absolute inset-0 z-0 overflow-hidden ${className}`}
    >
      {stars.map((star, index) => (
        <motion.span
          key={index}
          className="absolute rounded-full"
          style={{
            left: `${star.left}%`,
            top: `${star.top}%`,
            width: star.size,
            height: star.size,
            background: star.gold
              ? "var(--color-brass-light)"
              : "rgba(252,249,245,0.85)",
            boxShadow: star.gold
              ? "0 0 6px rgba(217,195,145,0.8)"
              : "0 0 4px rgba(252,249,245,0.45)",
          }}
          initial={{ opacity: 0.1 }}
          animate={reduced ? { opacity: 0.35 } : { opacity: [0.08, 0.9, 0.08] }}
          transition={{
            duration: star.duration,
            repeat: Infinity,
            delay: star.delay,
            ease: "easeInOut",
          }}
        />
      ))}
    </div>
  );
}