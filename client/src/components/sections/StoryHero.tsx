/**
 * StoryHero — the birthday moment, and the strongest first impression
 * on the page.
 *
 * No button here. The evening has already been opened by the intro's
 * ritual, so this screen just welcomes her — and it's alive: the whole
 * composition leans and drifts toward the cursor in parallax, the
 * letters of her name shy away one by one when she moves over them,
 * sparkles glint, flowers sway, and petals fall from nowhere in
 * particular. Everything is a response; nothing is a click target.
 *
 * Composition is deliberately left-weighted rather than centred — the
 * rest of the story is centred often enough, and this beat reads far
 * better anchored to the margin.
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

interface StoryHeroProps {
  /** Bumped by the finale to put the seal back and replay the reveal. */
  replayToken?: number;
}

const EASE = [0.16, 1, 0.3, 1] as const;

export default function StoryHero({ replayToken = 0 }: StoryHeroProps) {
  const reduced = useReducedMotion();
  const [seenToken, setSeenToken] = useState(replayToken);

  const stageRef = useRef<HTMLDivElement>(null);

  // Pointer position over the stage, normalised to -1..1 on each axis.
  const mx = useMotionValue(0);
  const my = useMotionValue(0);
  const mxSpring = useSpring(mx, { stiffness: 70, damping: 18 });
  const mySpring = useSpring(my, { stiffness: 70, damping: 18 });

  // Parallax drift for the layers — the name travels farthest, the
  // flowers a step behind, the light the least, like depth in a room.
  const nameX = useTransform(mxSpring, [-1, 1], [-18, 18]);
  const nameY = useTransform(mySpring, [-1, 1], [-12, 12]);
  const flowerX = useTransform(mxSpring, [-1, 1], [-8, 8]);
  const lightX = useTransform(mxSpring, [-1, 1], [-20, 20]);

  // Resetting state when a prop changes belongs in render, not in an
  // effect — this way there is never a frame with the old reveal and
  // the new token.
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
      className="relative isolate flex min-h-[100svh] flex-col justify-between overflow-clip bg-porcelain pt-16 pb-10"
    >
      {/* ── Light sources, drifting with the pointer ── */}
      <motion.div
        aria-hidden="true"
        data-decorative="true"
        className="aura -top-[10rem] -left-[12rem] h-[30rem] w-[30rem] sm:h-[44rem] sm:w-[44rem]"
        style={{ x: lightX, background: "radial-gradient(circle, rgba(232,204,211,0.55) 0%, rgba(232,204,211,0) 70%)" }}
      />
      <motion.div
        aria-hidden="true"
        data-decorative="true"
        className="aura -right-[14rem] bottom-[-12rem] h-[26rem] w-[26rem] sm:h-[36rem] sm:w-[36rem]"
        style={{ x: flowerX, background: "radial-gradient(circle, rgba(169,138,86,0.16) 0%, rgba(169,138,86,0) 70%)" }}
      />
      <FloatingHearts count={16} density={0.7} />
      <Petals active mode="fall" count={10} duration={16000} />

      {/* ── Top rule ── */}
      <motion.div
        className="shell relative z-10 flex items-center justify-between gap-4"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1, delay: 0.2 }}
      >
        <p className="eyebrow text-rose">{config.hero.eyebrow}</p>
        <motion.p className="eyebrow text-right text-ink-text/50">{config.herName}</motion.p>
      </motion.div>

      {/* ── Main ── */}
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
            <motion.p
              className="eyebrow mb-5 text-rose"
              initial={{ opacity: 0, y: reduced ? 0 : 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.1 }}
            >
              {config.hero.eyebrow}
            </motion.p>

            <motion.h2
              id="hero-title"
              className="font-display text-[clamp(2.4rem,1.3rem+5.2vw,5.5rem)] leading-[0.98] text-ink-text"
              style={{ x: nameX, y: nameY }}
            >
              <span className="block font-light text-ink-text/45 italic">
                <AnimatedText
                  text={config.finale.title.replace(",", "")}
                  delay={0.2}
                  stagger={0.03}
                />
              </span>
              {/* Letters that lean away from the cursor, one at a time. */}
              <span className="mt-1 flex text-rose-deep sm:mt-2" style={{ perspective: 420 }}>
                {config.herName.toUpperCase().split("").map((letter, index) => (
                  <motion.span
                    key={`${letter}-${index}`}
                    className="inline-block cursor-default select-none"
                    initial={{ opacity: 0, y: reduced ? 0 : 26, rotateZ: reduced ? 0 : -6 }}
                    animate={{ opacity: 1, y: 0, rotateZ: 0 }}
                    transition={{ duration: 0.9, delay: 0.55 + index * 0.06, ease: EASE }}
                    whileHover={reduced ? undefined : { y: -10, rotateZ: 8, scale: 1.12 }}
                    whileTap={reduced ? undefined : { scale: 0.9 }}
                  >
                    {letter}
                  </motion.span>
                ))}
              </span>
            </motion.h2>

            <motion.div
              className="mt-8 h-px w-full max-w-md origin-left bg-ink-text/15"
              initial={{ scaleX: 0 }}
              animate={{ scaleX: 1 }}
              transition={{ duration: 1.1, delay: 1.2, ease: EASE }}
            />

            <motion.p
              className="mt-7 max-w-md text-[0.975rem] leading-relaxed text-pretty text-muted sm:text-base"
              initial={{ opacity: 0, y: reduced ? 0 : 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.9, delay: 1.35 }}
            >
              {config.hero.subtitle}
            </motion.p>
          </motion.div>
        </AnimatePresence>

        {/* Flowers tucked into the stage — none of them a button. */}
        <motion.div style={{ x: flowerX }} aria-hidden="true">
          <Flowers variant="cluster" className="-right-6 -bottom-12 w-48 opacity-55 sm:-right-2 sm:w-60" />
          <Flowers variant="rose" className="-left-10 bottom-0 w-36 opacity-45 sm:-left-6 sm:w-44" />
        </motion.div>

        {/* A few warm glints over the name. */}
        <Sparkles />
      </div>

      {/* ── Colophon + scroll cue ── */}
      <motion.div
        className="shell relative z-10"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1, delay: 1.6 }}
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
    </section>
  );
}

/**
 * Glint positions are generated once per module load, not per render —
 * a random layout that reshuffles on every re-render would make the
 * sparkles flicker in place instead of holding still.
 */
const glints = Array.from({ length: 7 }, () => ({
  left: 22 + Math.random() * 56,
  top: 8 + Math.random() * 40,
  size: 6 + Math.random() * 8,
  delay: Math.random() * 5,
  duration: 3.2 + Math.random() * 3.4,
}));

/**
 * A few four-point glints scattered near the heading, each twinkling
 * on its own slow cycle. Decorative and inert — this page no longer
 * asks her to click anything up here.
 */
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
          animate={reduced ? { opacity: 0.3 } : { opacity: [0, 0.75, 0] }}
          transition={{ duration: glint.duration, repeat: Infinity, delay: glint.delay, ease: "easeInOut" }}
        >
          <path
            d="M12 3v18M3 12h18"
            stroke="var(--color-brass)"
            strokeWidth="1.4"
            strokeLinecap="round"
            opacity="0.7"
          />
        </motion.svg>
      ))}
    </div>
  );
}