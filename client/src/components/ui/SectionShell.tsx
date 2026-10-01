/**
 * SectionShell — the frame every chapter sits in.
 *
 * Holds the eyebrow / title / lede rhythm and the light-vs-dark text
 * treatment, so sections differ in *composition* without each one
 * re-deciding typography and colour. Alignment is a prop because
 * centring everything is the fastest way to make a page forgettable.
 */
import type { ReactNode } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { toneBackground, type ChapterTone } from "../../lib/chapters";
import AnimatedText from "./AnimatedText";

interface SectionShellProps {
  id: string;
  tone?: ChapterTone;
  eyebrow?: string;
  title?: ReactNode;
  lede?: ReactNode;
  children: ReactNode;
  /** `left` is the editorial default; `center` is reserved for two beats. */
  align?: "left" | "center";
  /** Vertical padding scale. */
  spacing?: "tight" | "default" | "tall";
  className?: string;
}

const SPACING = {
  tight: "py-20 sm:py-24",
  default: "py-24 sm:py-32 lg:py-40",
  tall: "py-28 sm:py-36 lg:py-48",
};

export default function SectionShell({
  id,
  tone = "light",
  eyebrow,
  title,
  lede,
  children,
  align = "left",
  spacing = "default",
  className = "",
}: SectionShellProps) {
  const reduced = useReducedMotion();
  const isNight = tone === "night";
  const centered = align === "center";

  const headingId = `${id}-title`;

  return (
    <section
      id={id}
      aria-labelledby={title ? headingId : undefined}
      data-tone={tone}
      className={`relative isolate overflow-clip ${SPACING[spacing]} ${className}`}
      style={{ backgroundColor: toneBackground[tone] }}
    >
      <div className={`shell relative ${centered ? "text-center" : ""}`}>
        {(eyebrow || title || lede) && (
          <header
            className={`mb-12 sm:mb-16 ${centered ? "mx-auto max-w-2xl" : "max-w-3xl"}`}
          >
            {eyebrow && (
              <motion.p
                className={`eyebrow mb-5 flex items-center gap-3 ${centered ? "justify-center" : ""} ${
                  isNight ? "text-brass-light/80" : "text-rose"
                }`}
                initial={{ opacity: 0, y: reduced ? 0 : 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.6 }}
                transition={{ duration: 0.7 }}
              >
                <span
                  aria-hidden="true"
                  className={`h-px w-8 ${isNight ? "bg-brass-light/40" : "bg-rose/40"}`}
                />
                {eyebrow}
              </motion.p>
            )}

            {typeof title === "string" ? (
              <h2
                id={headingId}
                className={`font-display text-[clamp(2.1rem,1.5rem+2.6vw,4rem)] ${
                  isNight ? "text-porcelain" : "text-ink-text"
                }`}
              >
                <AnimatedText text={title} mode="mask" trigger="view" lines />
              </h2>
            ) : (
              title && (
                <h2
                  id={headingId}
                  className={`font-display text-[clamp(2.1rem,1.5rem+2.6vw,4rem)] ${
                    isNight ? "text-porcelain" : "text-ink-text"
                  }`}
                >
                  {title}
                </h2>
              )
            )}

            {lede && (
              <motion.p
                className={`mt-6 max-w-xl text-[0.975rem] leading-relaxed sm:text-base ${
                  centered ? "mx-auto" : ""
                } ${isNight ? "text-porcelain/60" : "text-muted"}`}
                initial={{ opacity: 0, y: reduced ? 0 : 14 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.5 }}
                transition={{ duration: 0.8, delay: 0.15 }}
              >
                {lede}
              </motion.p>
            )}
          </header>
        )}

        {children}
      </div>
    </section>
  );
}
