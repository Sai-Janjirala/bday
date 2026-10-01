/**
 * Confetti — Burst of heart-shaped confetti particles
 * Triggered on tap/click interactions throughout the site
 */
import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface ConfettiParticle {
  id: number;
  x: number;
  y: number;
  rotation: number;
  scale: number;
  color: string;
  emoji: string;
}

interface ConfettiProps {
  /** Whether the confetti is currently active */
  active: boolean;
  /** Number of particles */
  count?: number;
  /** Origin point (relative to container) */
  originX?: number;
  originY?: number;
}

const EMOJIS = ["💖", "💕", "✨", "💗", "🌸", "💝", "⭐", "🦋"];
const COLORS = ["#E8A0BF", "#C45B7C", "#D4B8E0", "#D4A853", "#F9E4E4"];

export default function Confetti({
  active,
  count = 20,
  originX = 50,
  originY = 50,
}: ConfettiProps) {
  const [particles, setParticles] = useState<ConfettiParticle[]>([]);

  useEffect(() => {
    if (!active) return;

    const newParticles: ConfettiParticle[] = Array.from(
      { length: count },
      (_, i) => ({
        id: Date.now() + i,
        x: (Math.random() - 0.5) * 300,
        y: (Math.random() - 0.5) * 300 - 100,
        rotation: Math.random() * 720 - 360,
        scale: Math.random() * 0.8 + 0.4,
        color: COLORS[Math.floor(Math.random() * COLORS.length)],
        emoji: EMOJIS[Math.floor(Math.random() * EMOJIS.length)],
      })
    );

    setParticles(newParticles);

    // Clear particles after animation
    const timer = setTimeout(() => setParticles([]), 2000);
    return () => clearTimeout(timer);
  }, [active, count]);

  return (
    <div
      className="absolute pointer-events-none"
      style={{
        left: `${originX}%`,
        top: `${originY}%`,
        zIndex: 50,
      }}
    >
      <AnimatePresence>
        {particles.map((p) => (
          <motion.span
            key={p.id}
            className="absolute text-lg"
            initial={{ x: 0, y: 0, scale: 0, rotate: 0, opacity: 1 }}
            animate={{
              x: p.x,
              y: p.y,
              scale: p.scale,
              rotate: p.rotation,
              opacity: 0,
            }}
            exit={{ opacity: 0 }}
            transition={{
              duration: 1.5,
              ease: [0.25, 0.46, 0.45, 0.94],
            }}
          >
            {p.emoji}
          </motion.span>
        ))}
      </AnimatePresence>
    </div>
  );
}
