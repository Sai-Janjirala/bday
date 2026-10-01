/**
 * WaxSeal — the recurring "this is sealed, open me" affordance.
 *
 * A pressed-metal disc with an embossed monogram. When it breaks it
 * splits and fades, which is the whole point of putting it there.
 */
import { motion, useReducedMotion } from "framer-motion";

interface WaxSealProps {
  /** Broken or intact. */
  broken?: boolean;
  /** Letters pressed into the wax. Defaults to her initial. */
  monogram?: string;
  className?: string;
  size?: number;
  /** Only render the wax — no button semantics. */
  decorative?: boolean;
}

export default function WaxSeal({
  broken = false,
  monogram = "S",
  className = "",
  size = 92,
  decorative = false,
}: WaxSealProps) {
  const reduced = useReducedMotion();

  const content = (
    <motion.span
      className={`relative grid place-items-center ${decorative ? "" : "cursor-pointer"} ${className}`}
      style={{ width: size, height: size }}
      aria-hidden={decorative ? "true" : undefined}
      initial={false}
      animate={
        reduced
          ? { opacity: broken ? 0 : 1, scale: 1, rotate: 0 }
          : broken
            ? { opacity: 0, scale: 1.45, rotate: -14 }
            : { opacity: 1, scale: 1, rotate: 0 }
      }
      transition={{ duration: reduced ? 0.2 : 0.75, ease: [0.16, 1, 0.3, 1] }}
      whileHover={decorative || broken ? undefined : { scale: 1.04 }}
      whileTap={decorative || broken ? undefined : { scale: 0.94 }}
    >
      {/* Irregular wax edge */}
      <span
        aria-hidden="true"
        className="absolute inset-0 rounded-full"
        style={{
          background:
            "radial-gradient(circle at 34% 28%, #d78ea4 0%, #b0657c 42%, #8d4a5e 78%, #6d3a4a 100%)",
          boxShadow:
            "0 8px 22px -10px rgba(141,74,94,0.9), inset 0 1px 1px rgba(255,255,255,0.35), inset 0 -2px 4px rgba(0,0,0,0.25)",
        }}
      />
      {/* Inner bevel + pressed monogram */}
      <span
        aria-hidden="true"
        className="absolute inset-[11%] grid place-items-center rounded-full"
        style={{
          border: `1px solid rgba(255,255,255,0.22)`,
          boxShadow: "inset 0 1px 2px rgba(255,255,255,0.18), inset 0 -1px 2px rgba(0,0,0,0.3)",
        }}
      >
        <span
          className="font-display leading-none text-porcelain/90"
          style={{
            fontSize: size * 0.4,
            textShadow: "0 1px 1px rgba(0,0,0,0.35), 0 -1px 0 rgba(255,255,255,0.2)",
          }}
        >
          {monogram}
        </span>
      </span>
      {/* Light sweep */}
      <span
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 overflow-hidden rounded-full"
      >
        <span
          className="absolute -inset-x-1/3 inset-y-0 -rotate-12 bg-[linear-gradient(90deg,transparent,rgba(255,255,255,0.22),transparent)]"
          style={{ animation: "sheen 7s ease-in-out infinite" }}
        />
      </span>
    </motion.span>
  );

  // The wax itself is never interactive on its own — the caller wraps
  // it in a real button when it needs to be pressable.
  return content;
}
