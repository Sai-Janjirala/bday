/**
 * MagicButton — Romantic CTA button with glow pulse and hover effects
 */
import { motion } from "framer-motion";
import type { ReactNode } from "react";

interface MagicButtonProps {
  children: ReactNode;
  onClick?: () => void;
  className?: string;
  /** Delay before entrance animation */
  delay?: number;
  /** Size variant */
  size?: "sm" | "md" | "lg";
}

export default function MagicButton({
  children,
  onClick,
  className = "",
  delay = 0,
  size = "md",
}: MagicButtonProps) {
  const sizeClasses = {
    sm: "px-6 py-2.5 text-sm",
    md: "px-8 py-3.5 text-base",
    lg: "px-10 py-4 text-lg",
  };

  return (
    <motion.button
      className={`
        relative overflow-hidden
        ${sizeClasses[size]}
        font-serif font-medium tracking-wide
        text-white
        rounded-full
        cursor-pointer
        border-none outline-none
        ${className}
      `}
      style={{
        background: "linear-gradient(135deg, #C45B7C, #E8A0BF, #D4B8E0)",
      }}
      initial={{ opacity: 0, y: 20, scale: 0.9 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{
        duration: 0.8,
        delay,
        ease: [0.25, 0.46, 0.45, 0.94],
      }}
      whileHover={{
        scale: 1.05,
        boxShadow: "0 8px 30px rgba(196, 91, 124, 0.4), 0 0 60px rgba(232, 160, 191, 0.2)",
      }}
      whileTap={{ scale: 0.95 }}
      onClick={onClick}
    >
      {/* Shimmer overlay */}
      <motion.span
        className="absolute inset-0 opacity-0"
        style={{
          background:
            "linear-gradient(90deg, transparent, rgba(255,255,255,0.3), transparent)",
        }}
        animate={{
          x: ["-100%", "200%"],
          opacity: [0, 1, 0],
        }}
        transition={{
          duration: 2.5,
          repeat: Infinity,
          repeatDelay: 3,
          ease: "easeInOut",
        }}
      />
      {/* Glow pulse */}
      <span className="absolute inset-0 rounded-full animate-pulse-glow pointer-events-none" />
      {/* Content */}
      <span className="relative z-10">{children}</span>
    </motion.button>
  );
}
