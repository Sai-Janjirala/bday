/**
 * Flowers — drawn botanicals for the light sections.
 *
 * The sculptures of the garden are the sections themselves, so the
 * flowers stay quiet: faint line-art in the section's own blush and
 * sage, tucked into corners, never centred, never competing with a
 * photograph. They bloom in as the section arrives, then sway very
 * slowly, the way a real arrangement does in a room.
 *
 * All decorative — rendered behind content and hidden from the
 * accessibility tree.
 */
import { motion, useReducedMotion } from "framer-motion";

type FlowerVariant = "rose" | "blossom" | "sprig" | "cluster";

interface FlowersProps {
  variant?: FlowerVariant;
  className?: string;
}

const EASE = [0.16, 1, 0.3, 1] as const;

export default function Flowers({
  variant = "cluster",
  className = "",
}: FlowersProps) {
  const reduced = useReducedMotion();

  return (
    <motion.svg
      viewBox="0 0 160 160"
      aria-hidden="true"
      data-decorative="true"
      className={`pointer-events-none absolute z-0 ${className}`}
      style={{ color: "var(--color-rose)", touchAction: "none" }}
      initial={{ opacity: 0, scale: reduced ? 1 : 0.6 }}
      whileInView={{ opacity: 1, scale: 1 }}
      viewport={{ once: true, amount: 0.3 }}
      transition={{ duration: 1.4, ease: EASE }}
    >
      <motion.g
        style={{ transformOrigin: "80px 150px" }}
        initial={false}
        animate={reduced ? {} : { y: [0, -3, 0], rotate: [-1.6, 1.4, -1.6] }}
        transition={{ duration: 9, repeat: Infinity, ease: "easeInOut" }}
      >
        {variant === "rose" && <Rose />}
        {variant === "blossom" && <Blossom />}
        {variant === "sprig" && <Sprig />}
        {variant === "cluster" && <Cluster />}
      </motion.g>
    </motion.svg>
  );
}

function Rose() {
  return (
    <g>
      {/* Bloom */}
      <path
        d="M80 82C80 56 102 44 122 62c15 16-8 40-34 33C62 88 54 57 76 44c22-13 53 1 53 32 0 33-32 50-57 32"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.4"
        strokeLinecap="round"
      />
      <circle cx="80" cy="78" r="5" fill="var(--color-rose)" opacity="0.7" />
      {/* Leaves */}
      <path
        d="M74 116C54 116 42 122 40 134c18 0 30-4 34-18Z"
        fill="none"
        stroke="var(--color-sage)"
        strokeWidth="1.3"
        strokeLinejoin="round"
      />
      <path
        d="M74 116c-9 4-15 5-22 6"
        stroke="var(--color-sage)"
        strokeWidth="1"
        strokeLinecap="round"
      />
      <path
        d="M90 118c16-2 26 0 31 10-16 1-25-1-31-10Z"
        fill="none"
        stroke="var(--color-sage)"
        strokeWidth="1.3"
        strokeLinejoin="round"
      />
      <path
        d="M90 118c9-1 15-1 20 0"
        stroke="var(--color-sage)"
        strokeWidth="1"
        strokeLinecap="round"
      />
    </g>
  );
}

function Blossom() {
  return (
    <g>
      {[0, 72, 144, 216, 288].map((angle) => (
        <ellipse
          key={angle}
          cx="80"
          cy="50"
          rx="9"
          ry="19"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.3"
          transform={`rotate(${angle} 80 72)`}
        />
      ))}
      <circle cx="80" cy="72" r="4" fill="var(--color-rose)" opacity="0.7" />
      <path
        d="M72 112c-12-2-21 0-25 8 12 1 20 0 25-8Z"
        fill="none"
        stroke="var(--color-sage)"
        strokeWidth="1.3"
        strokeLinejoin="round"
      />
      <path
        d="M88 114c10-4 18-3 23 3-11 2-18 1-23-3Z"
        fill="none"
        stroke="var(--color-sage)"
        strokeWidth="1.3"
        strokeLinejoin="round"
      />
    </g>
  );
}

function Sprig() {
  return (
    <g>
      <path
        d="M78 158c-2-38 4-74 0-112"
        fill="none"
        stroke="var(--color-sage)"
        strokeWidth="1.4"
        strokeLinecap="round"
      />
      <path
        d="M78 128c-12-1-22 2-27 9 13 2 21 0 27-9Z"
        fill="none"
        stroke="var(--color-sage)"
        strokeWidth="1.3"
        strokeLinejoin="round"
      />
      <path
        d="M78 100c10-4 18-3 22 3-11 1-18 0-22-3Z"
        fill="none"
        stroke="var(--color-sage)"
        strokeWidth="1.3"
        strokeLinejoin="round"
      />
      <path
        d="M78 72l8-9 3 9Z"
        fill="none"
        stroke="var(--color-sage)"
        strokeWidth="1.2"
        strokeLinejoin="round"
      />
      <path
        d="M78 52c-7-3-13-1-15 3 8 1 12 0 15-3Z"
        fill="none"
        stroke="var(--color-sage)"
        strokeWidth="1.2"
        strokeLinejoin="round"
      />
      {/* Bud */}
      <circle cx="78" cy="44" r="4.5" fill="var(--color-rose)" opacity="0.65" />
    </g>
  );
}

function Cluster() {
  return (
    <g>
      <g transform="translate(-18 -10) scale(0.62)">
        <Rose />
      </g>
      <g transform="translate(48 -14) scale(0.55)">
        <Blossom />
      </g>
      <g transform="translate(-14 8) scale(0.5)">
        <Sprig />
      </g>
      <g transform="translate(46 18) scale(0.42)">
        <Rose />
      </g>
    </g>
  );
}