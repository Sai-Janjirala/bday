/**
 * FinalReveal — the last thing she sees.
 *
 * Full height, night, and almost empty on purpose. The petals drift once
 * and then stop, because the section's job is to end the evening, not
 * to keep performing. Everything else on the page has been building to
 * this one screen.
 */
import { useState } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { config } from "../../config/content";
import { todayLabel } from "../../lib/date";
import AnimatedText from "../ui/AnimatedText";
import Petals from "../ui/Petals";
import FloatingHearts from "../ui/FloatingHearts";

const EASE = [0.16, 1, 0.3, 1] as const;

interface FinalRevealProps {
  onReplay: () => void;
}

export default function FinalReveal({ onReplay }: FinalRevealProps) {
  const reduced = useReducedMotion();
  const [petalsOn, setPetalsOn] = useState(false);

  return (
    <section
      id="birthday"
      aria-labelledby="finale-title"
      data-tone="night"
      className="relative isolate flex min-h-[100svh] flex-col justify-between overflow-clip bg-ink py-16"
    >
      {/* ── Light sources ── */}
      <div
        aria-hidden="true"
        data-decorative="true"
        className="aura top-[-14rem] left-1/2 h-[38rem] w-[38rem] -translate-x-1/2"
        style={{
          background:
            "radial-gradient(circle, rgba(176,101,124,0.24) 0%, rgba(176,101,124,0) 68%)",
        }}
      />
      <div
        aria-hidden="true"
        data-decorative="true"
        className="aura bottom-[-16rem] left-[-10rem] h-[30rem] w-[30rem]"
        style={{
          background:
            "radial-gradient(circle, rgba(169,138,86,0.18) 0%, rgba(169,138,86,0) 70%)",
        }}
      />
      <FloatingHearts count={18} density={0.8} />
      <Petals active={petalsOn} mode="fall" count={46} duration={6000} />

      {/* ── Main ── */}
      <div className="shell relative z-10 flex flex-1 flex-col items-center justify-center py-16 text-center">
        <motion.p
          className="eyebrow mb-8 text-brass-light/75"
          initial={{ opacity: 0, y: reduced ? 0 : 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.6 }}
          transition={{ duration: 0.9 }}
          onAnimationComplete={() => setPetalsOn(true)}
        >
          {config.finale.eyebrow}
        </motion.p>

        <h2
          id="finale-title"
          className="font-display text-[clamp(2.5rem,1.4rem+5.4vw,6rem)] leading-[0.98]"
        >
          <span className="block font-light text-porcelain/55 italic">
            <AnimatedText text={config.finale.title} delay={0.15} stagger={0.03} />
          </span>
          <span className="mt-2 block text-rose-mist sm:mt-3">
            <AnimatedText text={config.herName} delay={0.7} stagger={0.05} />
          </span>
        </h2>

        <motion.div
          className="mt-10 h-px w-24 origin-center bg-gradient-to-r from-transparent via-brass-light/60 to-transparent"
          initial={{ scaleX: 0 }}
          whileInView={{ scaleX: 1 }}
          viewport={{ once: true, amount: 0.6 }}
          transition={{ duration: 1.2, delay: 1.1, ease: EASE }}
        />

        <motion.p
          className="mt-10 max-w-lg text-[0.975rem] leading-[1.8] text-pretty text-porcelain/60 sm:text-base"
          initial={{ opacity: 0, y: reduced ? 0 : 14 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.5 }}
          transition={{ duration: 1, delay: 1.25 }}
        >
          {config.finale.closing}
        </motion.p>

        <motion.button
          type="button"
          onClick={onReplay}
          className="focus-inset group mt-12 inline-flex min-h-14 cursor-pointer items-center gap-3 rounded-full border border-porcelain/20 px-8 text-[0.6875rem] font-medium tracking-[0.2em] text-porcelain/70 uppercase transition-colors duration-700 hover:border-brass-light/60 hover:text-brass-light"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true, amount: 0.5 }}
          transition={{ duration: 0.9, delay: 1.5 }}
        >
          {config.finale.replay}
          <motion.span
            aria-hidden="true"
            className="inline-block"
            animate={reduced ? {} : { x: [0, 4, 0] }}
            transition={{ duration: 2.4, repeat: Infinity, ease: "easeInOut" }}
          >
            →
          </motion.span>
        </motion.button>
      </div>

      {/* ── Colophon ── */}
      <motion.div
        className="shell relative z-10"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true, amount: 0.2 }}
        transition={{ duration: 1.1 }}
      >
        <div className="flex flex-wrap items-center justify-between gap-x-6 gap-y-2 border-t border-porcelain/10 pt-5 text-[0.625rem] tracking-[0.22em] text-porcelain/30 uppercase">
          <span>{config.chapterTitle}</span>
          <span className="hidden h-px flex-1 bg-porcelain/10 sm:block" />
          <span>{todayLabel}</span>
        </div>
      </motion.div>
    </section>
  );
}
