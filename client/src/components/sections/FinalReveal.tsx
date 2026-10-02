/**
 * FinalReveal — The closing page of the keepsake book.
 *
 * Full height, night tone, candlelit atmosphere with embossed gold name,
 * tap-anywhere rising heart blooms, and a quiet replay invitation.
 */
import { useCallback, useEffect, useRef, useState } from "react";
import { motion, useReducedMotion, useInView } from "framer-motion";
import confetti from "canvas-confetti";
import { config } from "../../config/content";
import { todayLabel } from "../../lib/date";
import AnimatedText from "../ui/AnimatedText";
import Petals from "../ui/Petals";
import FloatingHearts from "../ui/FloatingHearts";
import Flowers from "../ui/Flowers";
import Stars from "../ui/Stars";

const EASE = [0.16, 1, 0.3, 1] as const;
const BLOOM_MS = 1400;

interface Bloom {
  id: number;
  x: number;
  y: number;
  size: number;
  drift: number;
  spin: number;
}

interface FinalRevealProps {
  onReplay: () => void;
}

let bloomSeed = 0;

export default function FinalReveal({ onReplay }: FinalRevealProps) {
  const reduced = useReducedMotion();
  const [petalsOn, setPetalsOn] = useState(false);
  const [fireworksFired, setFireworksFired] = useState(false);
  const [blooms, setBlooms] = useState<Bloom[]>([]);
  const timers = useRef<number[]>([]);
  const sectionRef = useRef<HTMLElement>(null);
  const inView = useInView(sectionRef, { once: true, amount: 0.4 });

  // Fire confetti fireworks when section comes into view
  useEffect(() => {
    if (!inView || fireworksFired || reduced) return;
    setFireworksFired(true);

    const fireConfetti = (particleRatio: number, opts: Record<string, unknown>) => {
      confetti({
        ...opts,
        origin: { y: 0.6 },
        particleCount: Math.floor(200 * particleRatio),
        disableForReducedMotion: true,
      });
    };

    // Staggered bursts for drama
    const delay1 = window.setTimeout(() => {
      fireConfetti(0.25, { spread: 26, startVelocity: 55, colors: ["#b0657c", "#d9c391", "#fcf9f5"] });
    }, 600);
    const delay2 = window.setTimeout(() => {
      fireConfetti(0.2, { spread: 60, colors: ["#a98a56", "#f8ecec", "#e6ccd3"] });
    }, 1100);
    const delay3 = window.setTimeout(() => {
      fireConfetti(0.35, { spread: 100, decay: 0.91, scalar: 0.8, colors: ["#b0657c", "#d9c391", "#7d8a78"] });
      fireConfetti(0.1, { spread: 120, startVelocity: 25, decay: 0.92, scalar: 1.2, colors: ["#fcf9f5", "#b0657c"] });
      fireConfetti(0.1, { spread: 120, startVelocity: 45, colors: ["#a98a56", "#fcf9f5"] });
    }, 1700);

    return () => {
      window.clearTimeout(delay1);
      window.clearTimeout(delay2);
      window.clearTimeout(delay3);
    };
  }, [inView, fireworksFired, reduced]);

  useEffect(() => {
    const pending = timers.current;
    return () => {
      for (const timer of pending) window.clearTimeout(timer);
      pending.length = 0;
    };
  }, []);

  const spawnBloom = useCallback(
    (clientX: number, clientY: number) => {
      const host = hostRef.current;
      if (!host) return;
      const rect = host.getBoundingClientRect();
      const id = (bloomSeed += 1);
      const bloom: Bloom = {
        id,
        x: clientX - rect.left,
        y: clientY - rect.top,
        size: 14 + Math.random() * 14,
        drift: (Math.random() - 0.5) * 60,
        spin: (Math.random() - 0.5) * 40,
      };
      setBlooms((current) => [...current.slice(-11), bloom]);
      const timer = window.setTimeout(() => {
        setBlooms((current) => current.filter((item) => item.id !== id));
        timers.current = timers.current.filter((item) => item !== timer);
      }, BLOOM_MS);
      timers.current.push(timer);
    },
    [],
  );

  const hostRef = useRef<HTMLDivElement>(null);

  return (
    <div
      ref={hostRef}
      onPointerDown={(event) => spawnBloom(event.clientX, event.clientY)}
      className="relative cursor-pointer"
    >
      <section
        ref={sectionRef}
        id="birthday"
        aria-labelledby="finale-title"
        data-tone="night"
        className="relative isolate flex min-h-[100svh] flex-col justify-between overflow-clip bg-ink py-16"
      >
        {/* ── Ambient Light Sources ── */}
        <div
          aria-hidden="true"
          data-decorative="true"
          className="aura top-[-14rem] left-1/2 h-[38rem] w-[38rem] -translate-x-1/2"
          style={{
            background:
              "radial-gradient(circle, rgba(176,101,124,0.25) 0%, rgba(176,101,124,0) 68%)",
          }}
        />
        <div
          aria-hidden="true"
          data-decorative="true"
          className="aura bottom-[-16rem] left-[-10rem] h-[30rem] w-[30rem]"
          style={{
            background:
              "radial-gradient(circle, rgba(169,138,86,0.2) 0%, rgba(169,138,86,0) 70%)",
          }}
        />
        <FloatingHearts count={18} density={0.8} />
        <Petals active={petalsOn} mode="fall" count={46} duration={6000} />
        <Stars count={60} />
        <Flowers variant="cluster" tone="night" className="-top-10 -right-10 w-52 opacity-45 sm:w-64" />
        <Flowers variant="rose" tone="night" className="-bottom-8 -left-10 w-44 opacity-35 sm:w-52" />

        {/* ── Tap Rising Hearts Blooms ── */}
        <div aria-hidden="true" data-decorative="true" className="pointer-events-none absolute inset-0 z-20">
          {blooms.map((bloom) => (
            <motion.svg
              key={bloom.id}
              viewBox="0 0 24 24"
              className="absolute"
              style={{ left: bloom.x, top: bloom.y, width: bloom.size, height: bloom.size }}
              initial={{ opacity: 0, y: 0, x: 0, scale: 0.2, rotate: 0 }}
              animate={{
                opacity: [0, 1, 1, 0],
                y: -80 - bloom.size * 3,
                x: bloom.drift,
                scale: [0.2, 1.2, 1],
                rotate: bloom.spin,
              }}
              transition={{ duration: BLOOM_MS / 1000, ease: "easeOut" }}
              fill="none"
            >
              <path
                d="M12 20s-7.5-4.7-7.5-9.6A4.4 4.4 0 0 1 12 7.7a4.4 4.4 0 0 1 7.5 2.7C19.5 15.3 12 20 12 20Z"
                fill="var(--color-brass-light)"
                opacity="0.9"
              />
            </motion.svg>
          ))}
        </div>

        {/* ── Main Finale Typography Stage ── */}
        <div className="shell relative z-10 flex flex-1 flex-col items-center justify-center py-16 text-center">
          <motion.p
            className="eyebrow mb-8 text-brass-light/80"
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
            className="font-display text-[clamp(2.6rem,1.5rem+5.6vw,6.4rem)] leading-[0.98]"
          >
            <span className="block font-light text-porcelain/60 italic">
              <AnimatedText text={config.finale.title} delay={0.15} stagger={0.03} />
            </span>
            {/* Embossed Gold Metallic Name */}
            <span
              className="mt-3 block font-semibold tracking-wide sm:mt-4"
              style={{
                background:
                  "linear-gradient(135deg, #FFF6E5 0%, #F3D59B 30%, #C99B4B 60%, #FDF4E1 90%)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                filter: "drop-shadow(0 2px 14px rgba(201, 155, 75, 0.4))",
                letterSpacing: "0.02em",
              }}
            >
              <AnimatedText text={config.herName} delay={0.65} stagger={0.05} />
            </span>
          </h2>

          <motion.div
            className="mt-10 h-px w-28 origin-center bg-gradient-to-r from-transparent via-brass-light/70 to-transparent"
            initial={{ scaleX: 0 }}
            whileInView={{ scaleX: 1 }}
            viewport={{ once: true, amount: 0.6 }}
            transition={{ duration: 1.2, delay: 1.0, ease: EASE }}
          />

          <motion.p
            className="mt-10 max-w-lg text-[0.975rem] leading-[1.8] text-pretty text-porcelain/65 sm:text-base"
            initial={{ opacity: 0, y: reduced ? 0 : 14 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.5 }}
            transition={{ duration: 1, delay: 1.2 }}
          >
            {config.finale.closing}
          </motion.p>

          <motion.button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              onReplay();
            }}
            className="focus-inset group mt-12 inline-flex min-h-14 cursor-pointer items-center gap-3 rounded-full border border-brass-light/35 bg-porcelain/5 px-8 text-[0.6875rem] font-medium tracking-[0.2em] text-porcelain/80 uppercase shadow-lg backdrop-blur-sm transition-all duration-500 hover:border-brass-light hover:bg-porcelain/10 hover:text-brass-light"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true, amount: 0.5 }}
            transition={{ duration: 0.9, delay: 1.45 }}
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

          <motion.p
            className="mt-10 text-[0.625rem] tracking-[0.2em] text-porcelain/30 uppercase"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 1, delay: 1.8 }}
          >
            Tap anywhere to send up a bloom of hearts
          </motion.p>
        </div>

        {/* ── Colophon ── */}
        <motion.div
          className="shell relative z-10"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 1.1 }}
        >
          <div className="flex flex-wrap items-center justify-between gap-x-6 gap-y-2 border-t border-porcelain/10 pt-5 text-[0.625rem] tracking-[0.22em] text-porcelain/35 uppercase">
            <span>For {config.herName}</span>
            <span className="hidden h-px flex-1 bg-porcelain/10 sm:block" />
            <span>{todayLabel}</span>
          </div>
        </motion.div>
      </section>
    </div>
  );
}