/**
 * AnimatedText — Letter-by-letter or word-by-word text reveal
 * Used for romantic headings and emotional messages
 */
import { motion } from "framer-motion";

interface AnimatedTextProps {
  text: string;
  /** Animation mode */
  mode?: "letter" | "word" | "line";
  className?: string;
  /** Delay before animation starts */
  delay?: number;
  /** Duration per character/word */
  staggerDuration?: number;
  /** HTML tag to render */
  as?: "h1" | "h2" | "h3" | "p" | "span";
  /** Trigger on scroll into view instead of on mount */
  scrollTriggered?: boolean;
}

export default function AnimatedText({
  text,
  mode = "letter",
  className = "",
  delay = 0,
  staggerDuration = 0.04,
  as: Tag = "span",
  scrollTriggered = false,
}: AnimatedTextProps) {
  const items = mode === "letter"
    ? text.split("")
    : mode === "word"
    ? text.split(" ")
    : text.split("\n");

  const container = {
    hidden: { opacity: 1 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: staggerDuration,
        delayChildren: delay,
      },
    },
  };

  const child = {
    hidden: {
      opacity: 0,
      y: mode === "line" ? 20 : 8,
      filter: "blur(4px)",
    },
    visible: {
      opacity: 1,
      y: 0,
      filter: "blur(0px)",
      transition: {
        duration: mode === "line" ? 0.6 : 0.3,
        ease: [0.25, 0.46, 0.45, 0.94],
      },
    },
  };

  const viewportProps = scrollTriggered
    ? { whileInView: "visible", viewport: { once: true, margin: "-80px" } }
    : { animate: "visible" };

  return (
    <motion.div
      className={`inline-block ${className}`}
      variants={container}
      initial="hidden"
      {...viewportProps}
      aria-label={text}
    >
      {items.map((item, index) => (
        <motion.span
          key={index}
          variants={child}
          className={`inline-block ${mode === "letter" && item === " " ? "mr-[0.25em]" : ""} ${
            mode === "word" ? "mr-[0.3em]" : ""
          } ${mode === "line" ? "block" : ""}`}
        >
          {/* Render as proper tag for SEO */}
          {index === 0 && Tag !== "span" ? (
            <Tag className={className}>{item}</Tag>
          ) : (
            item
          )}
        </motion.span>
      ))}
    </motion.div>
  );
}
