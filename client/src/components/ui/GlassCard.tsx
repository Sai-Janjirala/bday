/**
 * GlassCard — Glassmorphic card with hover/tap animations
 * Used throughout the site for memory cards, dream cards, etc.
 */
import { motion } from "framer-motion";
import type { ReactNode } from "react";

interface GlassCardProps {
  children: ReactNode;
  className?: string;
  /** Whether to enable hover/tap scale animation */
  interactive?: boolean;
  /** Delay for staggered entrance */
  delay?: number;
  onClick?: () => void;
}

export default function GlassCard({
  children,
  className = "",
  interactive = true,
  delay = 0,
  onClick,
}: GlassCardProps) {
  return (
    <motion.div
      className={`glass-card p-6 ${className}`}
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{
        duration: 0.7,
        delay,
        ease: [0.25, 0.46, 0.45, 0.94],
      }}
      whileHover={
        interactive
          ? {
              scale: 1.03,
              boxShadow: "0 12px 40px rgba(232, 160, 191, 0.25)",
              borderColor: "rgba(232, 160, 191, 0.4)",
            }
          : undefined
      }
      whileTap={interactive ? { scale: 0.98 } : undefined}
      onClick={onClick}
      style={{ cursor: onClick ? "pointer" : undefined }}
    >
      {children}
    </motion.div>
  );
}
