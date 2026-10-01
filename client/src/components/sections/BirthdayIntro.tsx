/**
 * BirthdayIntro — the arrival.
 *
 * Night, almost empty, one line of text at a time. The only job here
 * is to make her curious enough to open the evening, so it stays
 * quiet: no emoji, no fake loading spinner. The progress hairline is
 * real — it tracks the fonts and photos actually warming up.
 *
 * Entering is now its own small ritual: a wax seal she holds until a
 * ring fills. A quick press completes on its own, and the whole panel
 * then lifts away like a curtain, taking the site from night to day.
 * Flower and dust drift across the screen the whole time.
 */
import { motion, useReducedMotion } from "framer-motion";
import { config } from "../../config/content";
import { useHoldProgress } from "../../hooks/useHoldProgress";
import AnimatedText from "../ui/AnimatedText";
import WaxSeal from "../ui/WaxSeal";
import FloatingHearts from "../ui/FloatingHearts";
import Petals from "../ui/Petals";
import Stars from "../ui/Stars";

interface BirthdayIntroProps {
  /** False until fonts and the first photos are ready. */
  ready: boolean;
  onBegin: () => void;
}

const EASE = [0.76, 0, 0.24, 1] as const;
const OPEN_MS = 2000;

export default function BirthdayIntro({ ready, onBegin }: BirthdayIntroProps) {
  const reduced = useReducedMotion();
  const { progress, start } = useHoldProgress(onBegin, {
    duration: OPEN_MS,
    enabled: ready,
  });

  return (
    <motion.div
      className="fixed inset-0 z-[75] flex flex-col overflow-hidden bg-ink"
      initial={false}
      exit={{ y: "-100%" }}
      transition={{ duration: reduced ? 0.3 : 1.15, ease: EASE }}
    >
      {/* ── Light sources ── */}
      <div
        aria-hidden="true"
        data-decorative="true"
        className="aura left-[-18%] top-[-14%] h-[34rem] w-[34rem] sm:h-[46rem] sm:w-[46rem]"
        style={{
          background:
            "radial-gradient(circle, rgba(176,101,124,0.22) 0%, rgba(176,101,124,0) 68%)",
        }}
      />
      <div
        aria-hidden="true"
        data-decorative="true"
        className="aura bottom-[-22%] right-[-16%] h-[30rem] w-[30rem] sm:h-[40rem] sm:w-[40rem]"
        style={{
          background:
            "radial-gradient(circle, rgba(169,138,86,0.16) 0%, rgba(169,138,86,0) 70%)",
        }}
      />
      <FloatingHearts count={20} density={0.85} />
      <Petals active mode="fall" count={40} duration={11000} />
      <Stars count={70} />

      {/* ── Content ── */}
      <div className="relative z-10 flex flex-1 flex-col items-center justify-center px-6 py-16 text-center">
        <motion.p
          className="eyebrow mb-12 text-porcelain/35"
          initial={false}
          animate={{ opacity: 1 }}
        >
          {ready ? `For ${config.herName}` : config.intro.preparing}
        </motion.p>

        <h1 className="max-w-2xl text-balance">
          <span className="block font-display text-[clamp(2rem,1.4rem+3vw,3.5rem)] leading-[1.14] text-porcelain/95">
            <AnimatedText text={config.intro.firstLine} delay={0.25} stagger={0.045} />
          </span>
          <span className="mt-2 block font-display text-[clamp(1.75rem,1.2rem+2.6vw,3rem)] leading-[1.18] font-light text-porcelain/60 italic">
            <AnimatedText
              text={config.intro.secondLine}
              mode="blur"
              delay={0.85}
              stagger={0.02}
            />
          </span>
        </h1>

        <motion.p
          className="mt-10 max-w-md text-[0.9rem] leading-relaxed text-pretty text-porcelain/45"
          initial={{ opacity: 0, y: reduced ? 0 : 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 1.6 }}
        >
          {config.intro.aside}
        </motion.p>

        <motion.div
          className="mt-10 flex flex-col items-center gap-3"
          initial={{ opacity: 0, y: reduced ? 0 : 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 2.1 }}
        >
          <IntroSeal
            ready={ready}
            progress={progress}
            onPress={start}
            label={config.intro.cta}
          />

          <p className="text-[0.6875rem] tracking-[0.18em] text-porcelain/30 uppercase">
            {config.intro.prompt}
          </p>
        </motion.div>
      </div>

      {/* ── Colophon ── */}
      <motion.div
        className="relative z-10 flex items-center justify-between gap-4 px-6 pb-7 text-[0.625rem] tracking-[0.22em] text-porcelain/25 uppercase"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1, delay: 2.6 }}
      >
        <span>For {config.herName}</span>
        <span className="h-px flex-1 bg-porcelain/10" />
        <span>One evening</span>
      </motion.div>
    </motion.div>
  );
}

/** The seal that opens the evening. */
function IntroSeal({
  ready,
  progress,
  onPress,
  label,
}: {
  ready: boolean;
  progress: number;
  onPress: () => void;
  label: string;
}) {
  const reduced = useReducedMotion();

  return (
    <button
      type="button"
      onPointerDown={onPress}
      onKeyDown={(event) => {
        if (event.key === " " || event.key === "Enter") {
          event.preventDefault();
          onPress();
        }
      }}
      onContextMenu={(event) => event.preventDefault()}
      disabled={!ready}
      aria-label={`${label} — hold to fill ${Math.round(progress * 100)} percent`}
      className="focus-inset group relative grid cursor-pointer place-items-center rounded-full disabled:cursor-wait"
      style={{ width: 148, height: 148 }}
    >
      {/* Ring track + fill */}
      <svg viewBox="0 0 100 100" className="absolute inset-0 -rotate-90" aria-hidden="true">
        <circle
          cx="50"
          cy="50"
          r="47"
          fill="none"
          stroke="rgba(252,249,245,0.14)"
          strokeWidth="1"
        />
        <circle
          cx="50"
          cy="50"
          r="47"
          fill="none"
          stroke="var(--color-brass-light)"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeDasharray={2 * Math.PI * 47}
          strokeDashoffset={2 * Math.PI * 47 * (1 - progress)}
          style={{ transition: "stroke-dashoffset 110ms linear" }}
        />
      </svg>

      {/* The wax */}
      <motion.span
        className="grid place-items-center rounded-full transition-transform duration-500 group-hover:scale-[1.03] group-active:scale-95"
        animate={reduced ? {} : { y: [0, -3, 0] }}
        transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
      >
        <WaxSeal size={104} className="opacity-90" />
      </motion.span>

      {/* Sits above while preparing */}
      {!ready && (
        <span className="absolute inset-0 grid place-items-center rounded-full bg-ink/60">
          <span className="eyebrow text-porcelain/70">{config.intro.preparing}</span>
        </span>
      )}
    </button>
  );
}