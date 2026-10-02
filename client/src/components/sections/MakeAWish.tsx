/**
 * MakeAWish — Chapter IV: The Candle Ritual.
 *
 * Placed on the night background: a dark room is what makes candlelight
 * read as candlelight. Interactive blowout per candle with realistic audio
 * puff and rising smoke trails, or hold the central ring for a full wish
 * explosion of golden stardust and celestial petals!
 */
import { useCallback, useRef, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { config } from "../../config/content";
import { useHoldProgress } from "../../hooks/useHoldProgress";
import { useChimeSound } from "../../hooks/useChimeSound";
import SectionShell from "../ui/SectionShell";
import Flowers from "../ui/Flowers";
import Petals from "../ui/Petals";
import Stars from "../ui/Stars";
import StardustCanvas from "../ui/StardustCanvas";

const CANDLE_COUNT = 5;
const FILL_MS = 2200;

interface Candle {
  id: number;
  lit: boolean;
  smoking: boolean;
}

const freshCandles = (): Candle[] =>
  Array.from({ length: CANDLE_COUNT }, (_, i) => ({
    id: i,
    lit: true,
    smoking: false,
  }));

export default function MakeAWish() {
  const reduced = useReducedMotion();
  const [candles, setCandles] = useState<Candle[]>(freshCandles);
  const [wished, setWished] = useState(false);
  const [burst, setBurst] = useState(false);
  const railRef = useRef<HTMLButtonElement>(null);
  const { playCelestialChime, playCandleBlow, playSoftBell } = useChimeSound();

  const litCount = candles.filter((candle) => candle.lit).length;

  const extinguish = useCallback((id?: number) => {
    setCandles((current) => {
      const next = current.map((candle) =>
        id === undefined
          ? { ...candle, lit: false, smoking: true }
          : candle.id === id && candle.lit
            ? { ...candle, lit: false, smoking: true }
            : candle,
      );
      return next;
    });
  }, []);

  const landWish = useCallback(() => {
    setWished(true);
    setBurst(true);
    extinguish();
    playCelestialChime();
  }, [extinguish, playCelestialChime]);

  const { progress, start, reset } = useHoldProgress(landWish, {
    duration: FILL_MS,
  });

  const blowOne = (id: number) => {
    if (wished) return;
    playCandleBlow();
    extinguish(id);
    if (litCount <= 1) {
      setWished(true);
      setBurst(true);
      playCelestialChime();
    }
  };

  const relight = () => {
    playSoftBell(1.2);
    reset();
    setCandles(freshCandles());
    setWished(false);
    setBurst(false);
    railRef.current?.focus();
  };

  const glow = wished ? 0.35 : 0.45 + progress * 0.55;
  const glowScale = wished ? 0.9 : 1 + progress * 0.12;

  return (
    <SectionShell
      id="wish"
      tone="night"
      align="center"
      eyebrow={config.wish.eyebrow}
      title={config.wish.title}
      lede={config.wish.lede}
      spacing="tall"
      className="isolate relative"
    >
      <StardustCanvas particleCount={40} glowColor="255, 196, 120" />
      <Petals active={burst} mode="burst" count={45} duration={2400} />
      <Stars count={55} />
      <Flowers variant="sprig" tone="night" className="-top-12 -left-12 w-44 opacity-35 sm:w-52" />
      <Flowers variant="cluster" tone="night" className="-right-12 -bottom-12 w-52 opacity-30 sm:w-60" />

      {/* Candlelight spilling onto the page */}
      <div
        aria-hidden="true"
        data-decorative="true"
        className="pointer-events-none absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full transition-all duration-1000"
        style={{
          width: "min(46rem, 130vw)",
          height: "min(46rem, 130vw)",
          background:
            "radial-gradient(circle, rgba(214,150,96,0.30) 0%, rgba(196,120,90,0.10) 38%, rgba(36,27,34,0) 68%)",
          opacity: glow,
          transform: `translate(-50%, -50%) scale(${glowScale})`,
        }}
      />

      <div className="relative z-10 mx-auto flex max-w-2xl flex-col items-center">
        {/* Chapter badge */}
        <div className="mb-6 inline-flex items-center gap-2 rounded-full bg-porcelain/10 px-3 py-1 backdrop-blur-sm">
          <span className="text-brass-light text-xs">✨</span>
          <span className="eyebrow text-brass-light/80">{config.wish.chapter}</span>
        </div>

        {/* ── The 5 Interactive Candles ── */}
        <div className="mb-4 flex items-end justify-center gap-4 sm:gap-8">
          {candles.map((candle) => (
            <div
              key={candle.id}
              className="group relative flex flex-col items-center"
            >
              {/* Flame */}
              <AnimatePresence>
                {candle.lit && (
                  <motion.span
                    aria-hidden="true"
                    className="relative mb-1.5 block cursor-pointer"
                    style={{ width: 14, height: 24 }}
                    initial={{ opacity: 0, scale: 0.4 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.2, y: -12 }}
                    transition={{ duration: 0.35 }}
                    onClick={() => blowOne(candle.id)}
                  >
                    <span
                      className="absolute -inset-3 rounded-full blur-md"
                      style={{
                        background:
                          "radial-gradient(circle, rgba(255,196,120,0.6) 0%, rgba(255,170,80,0) 70%)",
                        animation: reduced ? undefined : "breathe 2.4s ease-in-out infinite",
                      }}
                    />
                    <span
                      data-decorative="true"
                      className="absolute inset-0 block"
                      style={{
                        background:
                          "radial-gradient(ellipse at 50% 78%, #FFF3D0 0%, #FFC978 32%, #F08A3C 68%, rgba(198,86,40,0) 100%)",
                        borderRadius: "50% 50% 46% 46% / 62% 62% 38% 38%",
                        transformOrigin: "50% 100%",
                        animation: reduced ? undefined : "flicker 3.4s ease-in-out infinite",
                      }}
                    />
                  </motion.span>
                )}
              </AnimatePresence>

              {/* Smoke puff on blowout */}
              <AnimatePresence>
                {candle.smoking && !candle.lit && (
                  <motion.span
                    aria-hidden="true"
                    className="pointer-events-none absolute -top-8 left-1/2 h-6 w-2.5 -translate-x-1/2 rounded-full bg-porcelain/30 blur-[3px]"
                    initial={{ opacity: 0, y: 0, scale: 0.5 }}
                    animate={{
                      opacity: [0, 0.65, 0],
                      y: [0, -18, -36],
                      scale: [0.5, 1.5, 2.6],
                      x: [0, 4, -3],
                    }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: reduced ? 0.2 : 2.2, ease: "easeOut" }}
                  />
                )}
              </AnimatePresence>

              {/* Wick */}
              <span aria-hidden="true" className="-mb-px block h-2 w-px bg-porcelain/40" />

              {/* Candle Body */}
              <button
                type="button"
                onClick={() => blowOne(candle.id)}
                disabled={wished || !candle.lit}
                aria-label={`Blow out candle ${candle.id + 1}`}
                className="focus-inset block h-14 w-3 cursor-pointer rounded-t-[3px] transition-all duration-500 disabled:cursor-default sm:h-16"
                style={{
                  background:
                    candle.id % 2 === 0
                      ? "linear-gradient(180deg,#F6E7DC 0%,#E3CDBB 100%)"
                      : "linear-gradient(180deg,#F3DDE4 0%,#DCB7C4 100%)",
                  boxShadow:
                    "inset -1px 0 2px rgba(43,33,41,0.18), inset 1px 0 1px rgba(255,255,255,0.45)",
                  transform: candle.lit ? undefined : "scaleY(0.97)",
                  opacity: candle.lit ? 1 : 0.75,
                }}
              />
            </div>
          ))}
        </div>

        {/* Brass Candle Holder Bar */}
        <div
          aria-hidden="true"
          className="h-1 w-[16rem] rounded-full bg-gradient-to-r from-transparent via-brass-light/40 to-transparent transition-all duration-1000 sm:w-[22rem]"
          style={{ opacity: 0.5 + glow * 0.4 }}
        />

        {/* ── Central Ritual Control ── */}
        <div className="mt-12 flex min-h-[7.5rem] flex-col items-center justify-center">
          <AnimatePresence mode="wait">
            {wished ? (
              <motion.div
                key="wished"
                className="max-w-md text-center"
                initial={{ opacity: 0, y: 18 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -12 }}
                transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
              >
                <p className="font-display text-[clamp(1.75rem,1.4rem+1.6vw,2.5rem)] leading-tight text-porcelain">
                  {config.wish.blown}
                </p>
                <p className="mt-4 text-[0.9375rem] leading-relaxed text-pretty text-porcelain/65">
                  {config.wish.blownBody}
                </p>
                <button
                  type="button"
                  onClick={relight}
                  className="focus-inset mt-7 min-h-11 cursor-pointer rounded-full border border-brass-light/35 bg-porcelain/5 px-7 text-[0.6875rem] font-medium tracking-[0.18em] text-porcelain/90 uppercase transition-all duration-500 hover:border-brass-light hover:bg-porcelain/10 hover:text-brass-light"
                >
                  {config.wish.again}
                </button>
              </motion.div>
            ) : (
              <motion.button
                key="hold"
                ref={railRef}
                type="button"
                onPointerDown={start}
                onKeyDown={(event) => {
                  if (event.key === " " || event.key === "Enter") {
                    event.preventDefault();
                    start();
                  }
                }}
                onContextMenu={(event) => event.preventDefault()}
                className="focus-inset group relative grid cursor-pointer place-items-center rounded-full"
                style={{ width: 140, height: 140 }}
                aria-label={`${config.wish.holdLabel}. ${Math.round(progress * 100)}% complete.`}
              >
                {/* Track */}
                <svg viewBox="0 0 100 100" className="absolute inset-0 -rotate-90" aria-hidden="true">
                  <circle
                    cx="50"
                    cy="50"
                    r="46"
                    fill="none"
                    stroke="rgba(252,249,245,0.14)"
                    strokeWidth="1"
                  />
                  <circle
                    cx="50"
                    cy="50"
                    r="46"
                    fill="none"
                    stroke="var(--color-brass-light)"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeDasharray={2 * Math.PI * 46}
                    strokeDashoffset={2 * Math.PI * 46 * (1 - progress)}
                    style={{ transition: "stroke-dashoffset 120ms linear" }}
                  />
                </svg>

                {/* Core */}
                <span
                  className="grid place-items-center rounded-full border border-porcelain/25 transition-all duration-500 group-hover:border-brass-light/70"
                  style={{
                    width: 98,
                    height: 98,
                    background: `rgba(252,249,245,${0.05 + progress * 0.12})`,
                    boxShadow: `0 0 ${20 + progress * 50}px rgba(217,195,145,${0.1 + progress * 0.3})`,
                  }}
                >
                  <span className="px-3 text-center text-[0.625rem] leading-snug font-medium tracking-[0.16em] text-porcelain/85 uppercase">
                    {progress > 0.02 ? config.wish.holdingLabel : config.wish.holdLabel}
                  </span>
                </span>
              </motion.button>
            )}
          </AnimatePresence>
        </div>

        {/* Hint text */}
        <AnimatePresence>
          {!wished && (
            <motion.p
              className="mt-3 text-[0.75rem] tracking-[0.12em] text-porcelain/40 uppercase"
              initial={{ opacity: 0 }}
              animate={{ opacity: litCount === CANDLE_COUNT ? 1 : 0 }}
              exit={{ opacity: 0 }}
            >
              {config.wish.tapBlowLabel}
            </motion.p>
          )}
        </AnimatePresence>
      </div>
    </SectionShell>
  );
}
