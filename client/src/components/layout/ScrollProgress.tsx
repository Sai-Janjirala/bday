/**
 * ScrollProgress — Thin romantic progress bar at the top of the page
 * Shows how far through the love story the user has scrolled
 */
import { motion, useScroll, useSpring } from "framer-motion";

export default function ScrollProgress() {
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001,
  });

  return (
    <motion.div
      className="fixed top-0 left-0 right-0 h-[3px] z-[90] origin-left"
      style={{
        scaleX,
        background:
          "linear-gradient(90deg, #C45B7C, #E8A0BF, #D4B8E0, #D4A853)",
      }}
    />
  );
}
