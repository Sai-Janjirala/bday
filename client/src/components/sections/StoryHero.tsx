/**
 * StoryHero — Chapter I: The Opening of the Keepsake Book.
 *
 * Creative scroll-driven interactions:
 * - 3D parallax drift linked to pointer & scroll
 * - Letter-by-letter hover physics for her name
 * - Hand-drawn gold double rules and deckled paper aesthetics
 * - Subtle ambient stardust and swaying pressed botanicals
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

  // Normalised pointer coordinates: -1..1
  const mx = useMotionValue(0);
  const my = useMotionValue(0);
  const mxSpring = useSpring(mx, { stiffness: 65, damping: 16 });
  const mySpring = useSpring(my, { stiffness: 65, damping: 16 });

  // Multi-tier parallax for realistic 3D room depth
  const nameX = useTransform(mxSpring, [-1, 1], [-18, 18]);
  const nameY = useTransform(mySpring, [-1, 1], [-12, 12]);
  const flowerX = useTransform(mxSpring, [-1, 1], [-10, 10]);
  const lightX = useTransform(mxSpring, [-1, 1], [-22, 22]);

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
      style={{
        backgroundImage: `
          radial-gradient(ellipse at 80% 20%, rgba(248, 236, 236, 0.7) 0%, rgba(252, 249, 245, 0.98) 75%),
          radial-gradient(circle at 20% 80%, rgba(244, 237, 229, 0.6) 0%, rgba(252, 249, 245, 0) 60%)
        `,
      }}
    >
      {/* ── Warm Ambient Lights ── */}
      <motion.div
        aria-hidden="true"
        data-decorative="true"
        className="aura -top-[8rem] -left-[10rem] h-[32rem] w-[32rem] sm:h-[46rem] sm:w-[46rem]"
        style={{
          x: lightX,
          background:
            "radial-gradient(circle, rgba(232,204,211,0.55) 0%, rgba(232,204,211,0) 70%)",
        }}
      />
      <motion.div
        aria-hidden="true"
        data-decorative="true"
        className="aura -right-[12rem] bottom-[-10rem] h-[28rem] w-[28rem] sm:h-[38rem] sm:w-[38rem]"
        style={{
          x: flowerX,
          background:
            "radial-gradient(circle, rgba(169,138,86,0.18) 0%, rgba(169,138,86,0) 70%)",
        }}
      />
      <FloatingHearts count={14} density={0.7} />
      <Petals active mode="fall" count={14} duration={16000} />

      {/* ── Top Header & Chapter Badge ── */}
      <motion.div
        className="shell relative z-10 flex items-center justify-between gap-4"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1, delay: 0.2 }}
      >
        <div className="flex items-center gap-3">
          <span className="rounded-full bg-rose/10 px-2.5 py-0.5 text-[0.625rem] font-medium tracking-[0.2em] text-rose-deep uppercase">
            {config.hero.chapter}
          </span>
          <p className="eyebrow text-rose">{config.hero.eyebrow}</p>
        </div>
        <p className="eyebrow text-right text-ink-text/50">For {config.herName}</p>
      </motion.div>

      {/* ── Main Editorial Stage ── */}
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
            {/* Tagline stamp badge */}
            <motion.div
              className="mb-4 flex items-center gap-2.5 rounded-full border border-rose/30 bg-porcelain/90 px-4 py-1.5 shadow-sm backdrop-blur-md"
              initial={{ opacity: 0, y: reduced ? 0 : 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.1 }}
            >
              <span className="text-rose text-sm">❦</span>
              <span className="text-[0.6875rem] font-medium tracking-[0.16em] text-rose-deep italic">
                {config.hero.tagline}
              </span>
            </motion.div>

            {/* Dynamic Typography with Hover Letter Interaction */}
            <motion.h2
              id="hero-title"
              className="font-display text-[clamp(2.6rem,1.5rem+5.6vw,6rem)] leading-[0.98] text-ink-text"
              style={{ x: nameX, y: nameY }}
            >
              <span className="block font-light text-ink-text/50 italic">
                <AnimatedText
                  text={config.hero.titlePrefix}
                  delay={0.2}
                  stagger={0.03}
                />
              </span>
              {/* Letters of her name with hover physics & 3D perspective */}
              <span className="mt-1 flex flex-wrap text-rose-deep sm:mt-2" style={{ perspective: 480 }}>
                {config.herName.split("").map((letter, index) => (
                  <motion.span
                    key={`${letter}-${index}`}
                    className="inline-block cursor-default select-none transition-colors duration-300 hover:text-brass"
                    initial={{ opacity: 0, y: reduced ? 0 : 26, rotateZ: reduced ? 0 : -6 }}
                    animate={{ opacity: 1, y: 0, rotateZ: 0 }}
                    transition={{ duration: 0.9, delay: 0.45 + index * 0.05, ease: EASE }}
                    whileHover={reduced ? undefined : { y: -12, rotateZ: 10, scale: 1.15 }}
                    whileTap={reduced ? undefined : { scale: 0.9 }}
                  >
                    {letter === " " ? "\u00A0" : letter}
                  </motion.span>
                ))}
              </span>
            </motion.h2>

            {/* Hand-drawn double rule */}
            <div className="mt-8 w-full max-w-md space-y-1.5">
              <motion.div
                className="h-px w-full origin-left bg-ink-text/20"
                initial={{ scaleX: 0 }}
                animate={{ scaleX: 1 }}
                transition={{ duration: 1.1, delay: 0.95, ease: EASE }}
              />
              <motion.div
                className="h-px w-2/3 origin-left bg-gradient-to-r from-rose/40 to-transparent"
                initial={{ scaleX: 0 }}
                animate={{ scaleX: 1 }}
                transition={{ duration: 1.1, delay: 1.1, ease: EASE }}
              />
            </div>

            <motion.p
              className="mt-7 max-w-lg text-[1rem] leading-relaxed text-pretty text-muted sm:text-lg"
              initial={{ opacity: 0, y: reduced ? 0 : 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.9, delay: 1.25 }}
            >
              {config.hero.subtitle}
            </motion.p>
          </motion.div>
        </AnimatePresence>

        {/* Pressed Botanicals Swaying in Corners */}
        <motion.div style={{ x: flowerX }} aria-hidden="true">
          <Flowers variant="cluster" className="-right-6 -bottom-10 w-48 opacity-65 sm:-right-2 sm:w-64" />
          <Flowers variant="rose" className="-left-10 bottom-0 w-36 opacity-50 sm:-left-6 sm:w-48" />
        </motion.div>

        {/* Ambient Twinkling Sparkles */}
        <Sparkles />
      </div>

      {/* ── Footer Colophon & Magnetic Scroll Cue ── */}
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
          <a
            href="#photos"
            className="focus-inset eyebrow group flex items-center gap-2 text-muted-light transition-colors hover:text-rose-deep"
          >
            {config.hero.scrollCue}
            <motion.span
              aria-hidden="true"
              className="inline-block text-rose transition-transform group-hover:translate-y-1"
              animate={reduced ? {} : { y: [0, 5, 0] }}
              transition={{ duration: 2.2, repeat: Infinity, ease: "easeInOut" }}
            >
              ↓
            </motion.span>
          </a>
        </div>
      </motion.div>

      {/* Torn-paper Deckle Divider */}
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
          animate={reduced ? { opacity: 0.3 } : { opacity: [0, 0.85, 0] }}
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