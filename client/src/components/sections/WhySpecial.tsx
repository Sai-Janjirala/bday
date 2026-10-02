/**
 * WhySpecial — Chapter IV: Why You're Special.
 *
 * Six interactive appreciation cards in a responsive grid.
 * Each card has a front label and an emoji, and when tapped/clicked
 * it expands (modal-style overlay) to reveal a personalized message
 * with a beautiful entrance animation.
 *
 * Mobile-first: the expanded card is a full-screen-friendly overlay
 * that works with one thumb. No hover-only interactions.
 */
import { useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { config } from "../../config/content";
import { useChimeSound } from "../../hooks/useChimeSound";
import SectionShell from "../ui/SectionShell";
import Stars from "../ui/Stars";
import FloatingHearts from "../ui/FloatingHearts";

const EASE = [0.16, 1, 0.3, 1] as const;

const COLOR_MAP: Record<string, { bg: string; glow: string; text: string; border: string }> = {
  rose: {
    bg: "linear-gradient(135deg, rgba(176,101,124,0.18) 0%, rgba(176,101,124,0.06) 100%)",
    glow: "rgba(176,101,124,0.3)",
    text: "var(--color-rose-deep)",
    border: "rgba(176,101,124,0.35)",
  },
  brass: {
    bg: "linear-gradient(135deg, rgba(169,138,86,0.18) 0%, rgba(169,138,86,0.06) 100%)",
    glow: "rgba(169,138,86,0.3)",
    text: "var(--color-brass)",
    border: "rgba(169,138,86,0.35)",
  },
  sage: {
    bg: "linear-gradient(135deg, rgba(125,138,120,0.18) 0%, rgba(125,138,120,0.06) 100%)",
    glow: "rgba(125,138,120,0.3)",
    text: "var(--color-sage)",
    border: "rgba(125,138,120,0.35)",
  },
};

export default function WhySpecial() {
  const reduced = useReducedMotion();
  const [activeIndex, setActiveIndex] = useState<number | null>(null);
  const { playSoftBell, playCelestialChime } = useChimeSound();

  const cards = config.appreciationCards;

  const open = (index: number) => {
    playSoftBell(1.3);
    setActiveIndex(index);
  };

  const close = () => {
    setActiveIndex(null);
  };

  return (
    <SectionShell
      id="special"
      tone="night"
      align="center"
      eyebrow={config.appreciation.eyebrow}
      title={config.appreciation.title}
      lede={config.appreciation.lede}
      spacing="tall"
      className="relative overflow-hidden"
    >
      <Stars count={40} />
      <FloatingHearts count={12} density={0.6} />

      {/* Ambient warm glow in the center */}
      <div
        aria-hidden="true"
        data-decorative="true"
        className="aura left-1/2 top-1/2 h-[40rem] w-[40rem] -translate-x-1/2 -translate-y-1/2 opacity-50"
        style={{
          background:
            "radial-gradient(circle, rgba(176,101,124,0.18) 0%, rgba(169,138,86,0.1) 40%, rgba(36,27,34,0) 70%)",
        }}
      />

      {/* Cards Grid */}
      <div className="relative z-10 grid grid-cols-2 gap-3 sm:grid-cols-3 sm:gap-4 lg:gap-5">
        {cards.map((card, index) => {
          const colors = COLOR_MAP[card.color] ?? COLOR_MAP.rose;

          return (
            <motion.button
              key={card.label}
              type="button"
              onClick={() => open(index)}
              aria-label={`Learn about: ${card.label}`}
              className="group relative flex min-h-[9rem] cursor-pointer flex-col items-center justify-center gap-3 rounded-2xl border p-5 text-center backdrop-blur-sm transition-all duration-500 sm:min-h-[11rem]"
              style={{
                background: colors.bg,
                borderColor: colors.border,
                boxShadow: "0 4px 20px rgba(0,0,0,0.2)",
              }}
              initial={{ opacity: 0, y: reduced ? 0 : 28, scale: 0.95 }}
              whileInView={{ opacity: 1, y: 0, scale: 1 }}
              viewport={{ once: true, amount: 0.3 }}
              transition={{ duration: 0.7, delay: index * 0.09, ease: EASE }}
              whileHover={
                reduced
                  ? undefined
                  : {
                      scale: 1.04,
                      boxShadow: `0 8px 32px ${colors.glow}`,
                    }
              }
              whileTap={reduced ? undefined : { scale: 0.97 }}
            >
              {/* Glow on hover */}
              <div
                aria-hidden="true"
                className="pointer-events-none absolute inset-0 rounded-2xl opacity-0 transition-opacity duration-500 group-hover:opacity-100"
                style={{
                  background: `radial-gradient(circle at center, ${colors.glow} 0%, transparent 70%)`,
                }}
              />

              <span
                className="relative z-10 text-3xl sm:text-4xl"
                role="img"
                aria-hidden="true"
              >
                {card.emoji}
              </span>

              <span
                className="relative z-10 font-display text-[1rem] leading-tight sm:text-[1.15rem]"
                style={{ color: colors.text }}
              >
                {card.label}
              </span>

              {/* Subtle tap hint */}
              <span className="relative z-10 text-[0.6rem] tracking-[0.15em] text-porcelain/30 uppercase opacity-0 transition-opacity duration-300 group-hover:opacity-100 group-active:opacity-100">
                Tap to read
              </span>
            </motion.button>
          );
        })}
      </div>

      {/* Expanded Card Overlay */}
      <AnimatePresence>
        {activeIndex !== null && (
          <>
            {/* Backdrop */}
            <motion.div
              key="backdrop"
              className="fixed inset-0 z-[70] cursor-pointer bg-ink/75 backdrop-blur-sm"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.35 }}
              onClick={close}
              aria-hidden="true"
            />

            {/* Card */}
            <motion.div
              key={`card-${activeIndex}`}
              role="dialog"
              aria-modal="true"
              aria-label={cards[activeIndex].label}
              className="fixed inset-x-4 top-1/2 z-[71] mx-auto max-w-sm -translate-y-1/2 rounded-3xl border p-8 shadow-2xl sm:inset-x-8"
              style={{
                background: `linear-gradient(145deg, var(--color-ink-raised) 0%, var(--color-ink) 100%)`,
                borderColor: (COLOR_MAP[cards[activeIndex].color] ?? COLOR_MAP.rose).border,
                boxShadow: `0 32px 80px rgba(0,0,0,0.7), 0 0 60px ${(COLOR_MAP[cards[activeIndex].color] ?? COLOR_MAP.rose).glow}`,
              }}
              initial={
                reduced
                  ? { opacity: 0 }
                  : { opacity: 0, scale: 0.88, y: "-40%" }
              }
              animate={
                reduced
                  ? { opacity: 1 }
                  : { opacity: 1, scale: 1, y: "-50%" }
              }
              exit={
                reduced
                  ? { opacity: 0 }
                  : { opacity: 0, scale: 0.92, y: "-45%" }
              }
              transition={{ duration: 0.45, ease: EASE }}
              onAnimationStart={() => {
                if (activeIndex !== null) playCelestialChime();
              }}
            >
              {/* Close button */}
              <button
                type="button"
                onClick={close}
                aria-label="Close"
                className="absolute top-4 right-4 flex h-9 w-9 items-center justify-center rounded-full border border-porcelain/20 text-porcelain/50 transition-all duration-300 hover:border-porcelain/50 hover:text-porcelain active:scale-90"
              >
                ✕
              </button>

              {/* Card Content */}
              <div className="flex flex-col items-center text-center">
                <motion.span
                  className="mb-4 text-5xl"
                  role="img"
                  aria-hidden="true"
                  initial={{ scale: 0.5, rotate: -15 }}
                  animate={{ scale: 1, rotate: 0 }}
                  transition={{ duration: 0.5, delay: 0.1, ease: EASE }}
                >
                  {cards[activeIndex].emoji}
                </motion.span>

                <motion.h3
                  className="mb-1 font-display text-[1.5rem] leading-tight"
                  style={{
                    color: (COLOR_MAP[cards[activeIndex].color] ?? COLOR_MAP.rose).text,
                  }}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.45, delay: 0.15, ease: EASE }}
                >
                  {cards[activeIndex].label}
                </motion.h3>

                <motion.div
                  className="mb-6 mt-2 h-px w-16 rounded-full"
                  style={{
                    background: `linear-gradient(90deg, transparent, ${(COLOR_MAP[cards[activeIndex].color] ?? COLOR_MAP.rose).text}, transparent)`,
                    opacity: 0.5,
                  }}
                  initial={{ scaleX: 0 }}
                  animate={{ scaleX: 1 }}
                  transition={{ duration: 0.5, delay: 0.2 }}
                />

                <motion.p
                  className="font-display text-[1.05rem] leading-[1.75] text-porcelain/80 italic"
                  initial={{ opacity: 0, y: 14 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.25, ease: EASE }}
                >
                  {cards[activeIndex].message}
                </motion.p>

                <motion.button
                  type="button"
                  onClick={close}
                  className="mt-8 rounded-full border border-porcelain/20 px-7 py-2.5 text-[0.75rem] font-medium tracking-[0.18em] text-porcelain/60 uppercase transition-all duration-300 hover:border-porcelain/50 hover:text-porcelain active:scale-95"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.5, delay: 0.4 }}
                >
                  Close
                </motion.button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </SectionShell>
  );
}
