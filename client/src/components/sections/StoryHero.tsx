/**
 * StoryHero — the keepsake opening.
 *
 * Art direction: "keepsake book" — warm paper, ink, and pressed flowers.
 * The composition leans with pointer parallax, individual letters of POTTI
 * react on hover, and the scroll cue invites her to "Turn the page ↓".
 */
import { useRef, useState } from "react";
import {
  motion,
  AnimatePresence,
  useReducedMotion,
  useSpring,
  useMotionValue,
  useTransform,
} from "framer-motion";
import { config } from "../../config/content";
import { todayLabel } from "../../lib/date";
import AnimatedText from "../ui/AnimatedText";
import Petals from "../ui/Petals";
import Flowers from "../ui/Flowers";
import FloatingHearts from "../ui/FloatingHearts";
import Deckle from "../ui/Deckle";

interface StoryHeroProps {
  replayToken?: number;
}

const EASE = [0.16, 1, 0.3, 1] as const;

export default function StoryHero({ replayToken = 0 }: StoryHeroProps) {
  const reduced = useReducedMotion();
  const [seenToken, setSeenToken] = useState(replayToken);

  const stageRef = useRef<HTMLDivElement>(null);

  // Pointer position over stage, normalised to -1..1
  const mx = useMotionValue(0);
  const my = useMotionValue(0);
  const mxSpring = useSpring(mx, { stiffness: 70, damping: 18 });
  const mySpring = useSpring(my, { stiffness: 70, damping: 18 });

  const nameX = useTransform(mxSpring, [-1, 1], [-16, 16]);
  const nameY = useTransform(mySpring, [-1, 1], [-10, 10]);
  const flowerX = useTransform(mxSpring, [-1, 1], [-8, 8]);
  const lightX = useTransform(mxSpring, [-1, 1], [-18, 18]);

  if (seenToken !== replayToken) {
    setSeenToken(replayToken);
  }

  const onStageMove = (event: React.PointerEvent<HTMLDivElement>) => {
    if (reduced) return;
    const rect = event.currentTarget.getBoundingClientRect();
    const px = ((event.clientX - rect.left) / rect.width) * 2 - 1;
    const py = ((event.clientY - rect.top) / rect.height) * 2 - 1;
    mx.set(px);
    my.set(py);
  };

  return (
    <section
      id="opening"
      aria-labelledby="hero-title"
      data-tone="light"
      onPointerMove={onStageMove}
      className="relative isolate flex min-h-[100svh] flex-col justify-between overflow-clip bg-porcelain pt-16 pb-12"
    >
      {/* ── Warm ambient lights ── */}
      <motion.div
        aria-hidden="true"
        data-decorative="true"
        className="aura -top-[8rem] -left-[10rem] h-[30rem] w-[30rem] sm:h-[44rem] sm:w-[44rem]"
        style={{
          x: lightX,
          background:
            "radial-gradient(circle, rgba(232,204,211,0.5) 0%, rgba(232,204,211,0) 70%)",
        }}
      />
      <motion.div
        aria-hidden="true"
        data-decorative="true"
        className="aura -right-[12rem] bottom-[-10rem] h-[26rem] w-[26rem] sm:h-[36rem] sm:w-[36rem]"
        style={{
          x: flowerX,
          background:
            "radial-gradient(circle, rgba(169,138,86,0.15) 0%, rgba(169,138,86,0) 70%)",
        }}
      />
      <FloatingHearts count={14} density={0.7} />
      <Petals active mode="fall" count={12} duration={16000} />

      {/* ── Top Colophon & Hand-drawn Double Rule ── */}
      <motion.div
        className="shell relative z-10 flex items-center justify-between gap-4"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1, delay: 0.2 }}
      >
        <p className="eyebrow text-rose">{config.hero.eyebrow}</p>
        <p className="eyebrow text-right text-ink-text/50">For {config.herName}</p>
      </motion.div>

      {/* ── Main Stage ── */}
      <div ref={stageRef} className="shell relative z-10 flex flex-1 flex-col justify-center py-12">
        <AnimatePresence mode="wait">
          <motion.div
            key={`reveal-${seenToken}`}
            className="relative flex flex-col items-start"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.6 }}
          >
            {/* Pressed-flower motif stamp badge */}
            <motion.div
              className="mb-4 flex items-center gap-2.5 rounded-full border border-rose/25 bg-porcelain/80 px-3.5 py-1 backdrop-blur-sm"
              initial={{ opacity: 0, y: reduced ? 0 : 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.1 }}
            >
              <span className="text-rose">❦</span>
              <span className="eyebrow text-rose-deep">{config.hero.eyebrow}</span>
            </motion.div>

            <motion.h2
              id="hero-title"
              className="font-display text-[clamp(2.5rem,1.4rem+5.4vw,5.8rem)] leading-[0.98] text-ink-text"
              style={{ x: nameX, y: nameY }}
            >
              <span className="block font-light text-ink-text/50 italic">
                <AnimatedText
                  text={config.finale.title.replace(",", "")}
                  delay={0.2}
                  stagger={0.03}
                />
              </span>
              {/* Letters that hover-tilt */}
              <span className="mt-1 flex text-rose-deep sm:mt-2" style={{ perspective: 420 }}>
                {config.herName.toUpperCase().split("").map((letter, index) => (
                  <motion.span
                    key={`${letter}-${index}`}
                    className="inline-block cursor-default select-none transition-colors duration-300 hover:text-brass"
                    initial={{ opacity: 0, y: reduced ? 0 : 26, rotateZ: reduced ? 0 : -6 }}
                    animate={{ opacity: 1, y: 0, rotateZ: 0 }}
                    transition={{ duration: 0.9, delay: 0.5 + index * 0.06, ease: EASE }}
                    whileHover={reduced ? undefined : { y: -10, rotateZ: 8, scale: 1.14 }}
                    whileTap={reduced ? undefined : { scale: 0.92 }}
                  >
                    {letter}
                  </motion.span>
                ))}
              </span>
            </motion.h2>

            {/* Hand-drawn double rule */}
            <div className="mt-8 w-full max-w-md space-y-1">
              <motion.div
                className="h-px w-full origin-left bg-ink-text/20"
                initial={{ scaleX: 0 }}
                animate={{ scaleX: 1 }}
                transition={{ duration: 1.1, delay: 1.0, ease: EASE }}
              />
              <motion.div
                className="h-px w-3/4 origin-left bg-rose/30"
                initial={{ scaleX: 0 }}
                animate={{ scaleX: 1 }}
                transition={{ duration: 1.1, delay: 1.15, ease: EASE }}
              />
            </div>

            <motion.p
              className="mt-7 max-w-lg text-[0.975rem] leading-relaxed text-pretty text-muted sm:text-base"
              initial={{ opacity: 0, y: reduced ? 0 : 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.9, delay: 1.3 }}
            >
              {config.hero.subtitle}
            </motion.p>
          </motion.div>
        </AnimatePresence>

        {/* Pressed botanical flowers in corners */}
        <motion.div style={{ x: flowerX }} aria-hidden="true">
          <Flowers variant="cluster" className="-right-6 -bottom-10 w-48 opacity-60 sm:-right-2 sm:w-64" />
          <Flowers variant="rose" className="-left-10 bottom-0 w-36 opacity-45 sm:-left-6 sm:w-48" />
        </motion.div>

        {/* Ambient sparkles */}
        <Sparkles />
      </div>

      {/* ── Footer colophon & scroll cue ── */}
      <motion.div
        className="shell relative z-10"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1, delay: 1.5 }}
      >
        <div className="flex flex-wrap items-center justify-between gap-x-6 gap-y-3 border-t border-ink-text/10 pt-5">
          <span className="text-[0.6875rem] tracking-[0.2em] text-muted-light uppercase">
            {todayLabel}
          </span>
          <p className="eyebrow flex items-center gap-2 text-muted-light">
            {config.hero.scrollCue}
            <motion.span
              aria-hidden="true"
              className="inline-block"
              animate={reduced ? {} : { y: [0, 5, 0] }}
              transition={{ duration: 2.2, repeat: Infinity, ease: "easeInOut" }}
            >
              ↓
            </motion.span>
          </p>
        </div>
      </motion.div>

      {/* Deckled edge transition to next section */}
      <Deckle position="bottom" fillColor="var(--color-porcelain)" />
    </section>
  );
}

const glints = Array.from({ length: 8 }, () => ({
  left: 20 + Math.random() * 60,
  top: 6 + Math.random() * 45,
  size: 7 + Math.random() * 9,
  delay: Math.random() * 4.5,
  duration: 3 + Math.random() * 3,
}));

function Sparkles() {
  const reduced = useReducedMotion();

  return (
    <div aria-hidden="true" data-decorative="true" className="pointer-events-none absolute inset-0 z-0">
      {glints.map((glint, index) => (
        <motion.svg
          key={index}
          viewBox="0 0 24 24"
          className="absolute"
          style={{ left: `${glint.left}%`, top: `${glint.top}%`, width: glint.size, height: glint.size }}
          fill="none"
          initial={{ opacity: 0 }}
          animate={reduced ? { opacity: 0.3 } : { opacity: [0, 0.8, 0] }}
          transition={{ duration: glint.duration, repeat: Infinity, delay: glint.delay, ease: "easeInOut" }}
        >
          <path
            d="M12 3v18M3 12h18"
            stroke="var(--color-brass)"
            strokeWidth="1.5"
            strokeLinecap="round"
            opacity="0.75"
          />
        </motion.svg>
      ))}
    </div>
  );
}