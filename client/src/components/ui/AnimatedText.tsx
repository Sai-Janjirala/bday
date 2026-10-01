/**
 * AnimatedText — typographic reveal.
 *
 * Letters rise out of a clipped line ("mask" mode) or simply resolve
 * from blur ("blur" mode). Either way the *real* string is always in
 * the DOM for screen readers — the animated spans are marked
 * aria-hidden so nobody hears a word spelled out letter by letter.
 */
import { motion, useReducedMotion } from "framer-motion";

interface AnimatedTextProps {
  text: string;
  /** `mask` clips each line as it rises; `blur` is the softer option. */
  mode?: "mask" | "blur" | "word";
  className?: string;
  delay?: number;
  /** Seconds between each unit of animation. */
  stagger?: number;
  /** Animate on mount (default) or only when scrolled into view. */
  trigger?: "mount" | "view";
  /** Respect newlines in `text` as hard breaks. */
  lines?: boolean;
}

const EASE = [0.16, 1, 0.3, 1] as const;

export default function AnimatedText({
  text,
  mode = "mask",
  className = "",
  delay = 0,
  stagger = 0.028,
  trigger = "mount",
  lines = false,
}: AnimatedTextProps) {
  const reduced = useReducedMotion();

  const groups = lines ? text.split("\n") : [text];
  const units = (value: string) =>
    mode === "word" ? value.split(/(\s+)/) : Array.from(value);

  const container = {
    hidden: {},
    visible: {
      transition: { staggerChildren: stagger, delayChildren: delay },
    },
  };

  const maskChild = {
    hidden: { y: "112%" },
    visible: {
      y: "0%",
      transition: { duration: 1.05, ease: EASE },
    },
  };

  const blurChild = {
    hidden: { opacity: 0, y: 10, filter: "blur(8px)" },
    visible: {
      opacity: 1,
      y: 0,
      filter: "blur(0px)",
      transition: { duration: 0.85, ease: EASE },
    },
  };

  const variants = mode === "mask" ? maskChild : blurChild;

  if (reduced) {
    return <span className={className}>{text}</span>;
  }

  const triggerProps =
    trigger === "view"
      ? { whileInView: "visible" as const, viewport: { once: true, amount: 0.4 } }
      : { animate: "visible" as const };

  return (
    <motion.span
      className={className}
      variants={container}
      initial="hidden"
      {...triggerProps}
    >
      {groups.map((group, groupIndex) => (
        <span
          key={groupIndex}
          className={`${lines ? "block" : "inline"} ${mode === "mask" ? "overflow-hidden" : ""}`}
          style={mode === "mask" ? { paddingBottom: "0.08em" } : undefined}
        >
          {units(group).map((unit, unitIndex) => (
            <span
              key={unitIndex}
              aria-hidden="true"
              className={
                mode === "mask"
                  ? "inline-block will-change-transform"
                  : "inline-block will-change-[opacity,transform,filter]"
              }
            >
              <motion.span
                variants={variants}
                className={
                  mode === "mask"
                    ? "inline-block"
                    : mode === "word" && /^\s+$/.test(unit)
                      ? "inline-block w-[0.32em]"
                      : "inline-block"
                }
              >
                {unit === " " ? " " : unit}
              </motion.span>
            </span>
          ))}
        </span>
      ))}
      {/* The accessible copy of the string. */}
      <span className="sr-only">{text.replace(/\n/g, " ")}</span>
    </motion.span>
  );
}
