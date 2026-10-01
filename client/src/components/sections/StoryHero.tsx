/**
 * StoryHero — the birthday moment, and the strongest first impression
 * on the page.
 *
 * A sealed envelope-wax disc is the only thing on screen to begin with.
 * Breaking it is what releases the name, and the name is the whole
 * point, so the site makes her do the revealing.
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
} from "framer-motion";
import { config } from "../../config/content";
import { todayLabel } from "../../lib/date";
import { useCountdown } from "../../hooks/useCountdown";
import AnimatedText from "../ui/AnimatedText";
import WaxSeal from "../ui/WaxSeal";
import Petals from "../ui/Petals";
import FloatingHearts from "../ui/FloatingHearts";

interface StoryHeroProps {
  /** Bumped by the finale to put the seal back and replay the reveal. */
  replayToken?: number;
}

export default function StoryHero({ replayToken = 0 }: StoryHeroProps) {
  const reduced = useReducedMotion();
  const [sealed, setSealed] = useState(true);
  const [burst, setBurst] = useState<{ x: number; y: number } | null>(null);
  const [seenToken, setSeenToken] = useState(replayToken);
  const sealRef = useRef<HTMLButtonElement>(null);

  // Gentle tilt that follows the pointer, like turning the seal in your
  // hand. Springs keep it from ever feeling twitchy.
  const tiltX = useSpring(0, { stiffness: 180, damping: 20 });
  const tiltY = useSpring(0, { stiffness: 180, damping: 20 });

  const initial = config.herName.charAt(0).toUpperCase();

  // Resetting state when a prop changes belongs in render, not in an
  // effect — this way there is never a frame with the old seal and the
  // new token.
  if (seenToken !== replayToken) {
    setSeenToken(replayToken);
    setSealed(true);
    setBurst(null);
  }

  const onTilt = (event: React.PointerEvent<HTMLDivElement>) => {
    if (reduced) return;
    const bounds = event.currentTarget.getBoundingClientRect();
    const px = (event.clientX - bounds.left) / bounds.width - 0.5;
    const py = (event.clientY - bounds.top) / bounds.height - 0.5;
    tiltX.set(py * -14);
    tiltY.set(px * 14);
  };

  const resetTilt = () => {
    tiltX.set(0);
    tiltY.set(0);
  };

  const breakSeal = () => {
    if (!sealed) return;
    const rect = sealRef.current?.getBoundingClientRect();
    setBurst(
      rect
        ? { x: rect.left + rect.width / 2, y: rect.top + rect.height / 2 }
        : { x: window.innerWidth / 2, y: window.innerHeight / 2 },
    );
    window.setTimeout(() => setBurst(null), 1800);
    setSealed(false);
  };

  return (
    <section
      id="opening"
      aria-labelledby="hero-title"
      data-tone="light"
      className="relative isolate flex min-h-[100svh] flex-col justify-between overflow-clip bg-porcelain pt-16 pb-10"
    >
      {/* ── Light sources ── */}
      <div
        aria-hidden="true"
        data-decorative="true"
        className="aura -top-[10rem] -left-[12rem] h-[30rem] w-[30rem] sm:h-[44rem] sm:w-[44rem]"
        style={{
          background:
            "radial-gradient(circle, rgba(232,204,211,0.55) 0%, rgba(232,204,211,0) 70%)",
        }}
      />
      <div
        aria-hidden="true"
        data-decorative="true"
        className="aura -right-[14rem] bottom-[-12rem] h-[26rem] w-[26rem] sm:h-[36rem] sm:w-[36rem]"
        style={{
          background:
            "radial-gradient(circle, rgba(169,138,86,0.16) 0%, rgba(169,138,86,0) 70%)",
        }}
      />
      <FloatingHearts count={16} density={0.7} />

      <Petals active={burst !== null} mode="burst" count={30} origin={burst ?? undefined} duration={1500} />

      {/* ── Top rule ── */}
      <motion.div
        className="shell relative z-10 flex items-center justify-between gap-4"
        initial={{ opacity: 0 }}
        animate={{ opacity: sealed ? 1 : 0.35 }}
        transition={{ duration: 1, delay: 0.2 }}
      >
        <p className="eyebrow text-rose">{config.hero.eyebrow}</p>
        <p className="eyebrow text-muted-light">{config.chapterTitle}</p>
      </motion.div>

      {/* ── Main ── */}
      <div className="shell relative z-10 flex flex-1 flex-col justify-center py-12">
        <AnimatePresence mode="wait">
          {sealed ? (
            <motion.div
              key="sealed"
              className="flex flex-col items-start"
              exit={{ opacity: 0, y: reduced ? 0 : -20, scale: reduced ? 1 : 0.97 }}
              transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
            >
              <motion.div
                className="relative"
                style={{ transformPerspective: 900, rotateX: tiltX, rotateY: tiltY }}
                onPointerMove={onTilt}
                onPointerLeave={resetTilt}
              >
                {/* A slow pan around the seal — like text stamped on a
                    pressed disc of wax. */}
                <motion.div
                  aria-hidden="true"
                  className="pointer-events-none absolute -inset-8 -z-10 sm:-inset-10"
                  animate={{ rotate: reduced ? 0 : 360 }}
                  transition={{ duration: 36, repeat: Infinity, ease: "linear" }}
                >
                  <svg viewBox="0 0 100 100" className="h-full w-full" fill="none">
                    <defs>
                      <path
                        id="seal-ring"
                        d="M50,50 m-44,0 a44,44 0 1,1 88,0 a44,44 0 1,1 -88,0"
                      />
                    </defs>
                    <text
                      fontSize="6.6"
                      letterSpacing="3"
                      fill="rgba(141,74,94,0.55)"
                      style={{ fontFamily: "var(--font-sans)" }}
                    >
                      <textPath href="#seal-ring">
                        HAPPY BIRTHDAY · A BIRTHDAY, MADE BY HAND · HAPPY BIRTHDAY · A BIRTHDAY, MADE BY HAND ·
                      </textPath>
                    </text>
                  </svg>
                </motion.div>

                <motion.button
                  ref={sealRef}
                  type="button"
                  onClick={breakSeal}
                  aria-label={config.hero.sealLabel}
                  className="focus-inset group relative -ml-2 cursor-pointer rounded-full"
                  initial={{ opacity: 0, scale: 0.8, rotate: -8 }}
                  animate={{ opacity: 1, scale: 1, rotate: 0 }}
                  transition={{ duration: 1.1, delay: 0.35, ease: [0.16, 1, 0.3, 1] }}
                  whileHover={reduced ? undefined : { scale: 1.04, rotate: -2 }}
                  whileTap={reduced ? undefined : { scale: 0.95 }}
                >
                  <WaxSeal monogram={initial} size={112} />
                  <span
                    aria-hidden="true"
                    className="absolute inset-0 -z-10 rounded-full opacity-0 blur-2xl transition-opacity duration-700 group-hover:opacity-100"
                    style={{ background: "rgba(176,101,124,0.5)" }}
                  />
                </motion.button>
              </motion.div>

              <motion.p
                className="mt-7 flex items-center gap-2.5 text-[0.8125rem] tracking-[0.2em] text-muted uppercase"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.9, delay: 1.1 }}
              >
                <span className="h-px w-6 bg-rose/40" />
                {config.hero.sealLabel}
              </motion.p>
            </motion.div>
          ) : (
            <motion.div
              key="revealed"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
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

              <h2
                id="hero-title"
                className="font-display text-[clamp(2.4rem,1.3rem+5.2vw,5.5rem)] leading-[0.98] text-ink-text"
              >
                <span className="block font-light text-ink-text/45 italic">
                  <AnimatedText
                    text={config.finale.title.replace(",", "")}
                    delay={0.2}
                    stagger={0.03}
                  />
                </span>
                <span className="mt-1 block text-rose-deep sm:mt-2">
                  <AnimatedText text={config.herName} delay={0.55} stagger={0.045} />
                </span>
              </h2>

              <motion.div
                className="mt-8 h-px w-full max-w-md origin-left bg-ink-text/15"
                initial={{ scaleX: 0 }}
                animate={{ scaleX: 1 }}
                transition={{ duration: 1.1, delay: 1.2, ease: [0.16, 1, 0.3, 1] }}
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
          )}
        </AnimatePresence>
      </div>

      {/* ── Colophon + scroll cue ── */}
      <motion.div
        className="shell relative z-10"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1, delay: sealed ? 1.6 : 1.8 }}
      >
        <div className="flex flex-wrap items-center justify-between gap-x-6 gap-y-3 border-t border-ink-text/10 pt-5">
          <Colophon />
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

function Colophon() {
  const countdown = useCountdown(config.birthday.month, config.birthday.day);

  return (
    <div className="flex flex-wrap items-center gap-x-5 gap-y-1.5">
      <span className="text-[0.6875rem] tracking-[0.2em] text-muted-light uppercase">
        {todayLabel}
      </span>

      {countdown.isActive ? (
        <span className="flex items-baseline gap-2 text-[0.6875rem] tracking-[0.2em] text-rose uppercase">
          <span>{config.hero.countdownPrefix}</span>
          <span className="font-display text-base tracking-normal text-ink-text tabular-nums">
            {countdown.days}d {String(countdown.hours).padStart(2, "0")}
            <span className="mx-0.5 text-muted-light">:</span>
            {String(countdown.minutes).padStart(2, "0")}
          </span>
        </span>
      ) : (
        <span className="text-[0.6875rem] tracking-[0.2em] text-muted-light/70 uppercase">
          Made for {config.nickname}
        </span>
      )}
    </div>
  );
}
