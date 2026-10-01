/**
 * ScrollProgress — a hairline that fills as she moves through the
 * story, with a soft head so the current position is legible without
 * having to read a number.
 */
import { motion, useScroll, useSpring, useTransform } from "framer-motion";
import type { MotionValue } from "framer-motion";

export default function ScrollProgress() {
  const { scrollYProgress } = useScroll();

  const fill = useSpring(scrollYProgress, {
    stiffness: 120,
    damping: 34,
    restDelta: 0.001,
  });
  const head = useSpring(scrollYProgress, {
    stiffness: 220,
    damping: 30,
    restDelta: 0.001,
  });

  // A MotionValue can't be handed to `left`, so map it to a percentage.
  const headLeft = useTransform(head, (value) => `${value * 100}%`);

  return (
    <div
      aria-hidden="true"
      className="pointer-events-none fixed inset-x-0 top-0 z-[65] h-px bg-porcelain/10"
    >
      <motion.div
        className="h-full origin-left"
        style={{
          scaleX: fill,
          background:
            "linear-gradient(90deg, var(--color-rose), var(--color-brass-light))",
        }}
      />
      <motion.div
        className="absolute top-1/2 h-1.5 w-1.5 -translate-x-1/2 -translate-y-1/2 rounded-full"
        style={{
          left: headLeft as MotionValue<string>,
          background: "var(--color-brass-light)",
          boxShadow: "0 0 12px 2px rgba(217,195,145,0.5)",
        }}
      />
    </div>
  );
}
