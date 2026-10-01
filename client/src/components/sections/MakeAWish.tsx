/**
 * MakeAWish — the ritual, and the one real game in the experience.
 *
 * Placed on the night background on purpose: a dark room is what makes
 * candlelight read as candlelight. The glow behind the candles is tied
 * to the wish progress, so the light literally grows as the wish takes
 * shape, then drops to embers when it lands.
 *
 * Press and hold to fill the ring — or just tap, and it finishes on its
 * own, which keeps it usable with a keyboard and with a screen reader.
 * Individual candles can also be blown out one at a time for a smaller
 * version of the same payoff.
 */
import { useCallback, useRef, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { config } from "../../config/content";
import { useHoldProgress } from "../../hooks/useHoldProgress";
import SectionShell from "../ui/SectionShell";
import Petals from "../ui/Petals";

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

  // Same hold mechanic as the intro — a quick press completes on its own.
  const landWish = useCallback(() => {
    setWished(true);
    setBurst(true);
    extinguish();
  }, [extinguish]);

  const { progress, start, reset } = useHoldProgress(landWish, {
    duration: FILL_MS,
  });

  const blowOne = (id: number) => {
    if (wished) return;
    extinguish(id);
  };

  const relight = () => {
    reset();
    setCandles(freshCandles());
    setWished(false);
    setBurst(false);
    railRef.current?.focus();
  };

  // The light: brightest with every candle lit, warmest at full wish.
  const glow = wished ? 0.35 : 0.45 + progress * 0.55;
  const glowScale = wished ? 0.9 : 1 + progress * 0.12;

  return (
    <SectionShell
      id="wish"
      tone="night"
      marker="V"
      align="center"
      eyebrow={config.wish.eyebrow}
      title={config.wish.title}
      lede={config.wish.lede}
      spacing="tall"
      className="isolate"
    >
      <Petals active={burst} mode="burst" count={40} duration={2200} />

      {/* Candlelight spilling onto the page. */}
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
        {/* ── The candles ── */}
        <div className="mb-2 flex items-end justify-center gap-4 sm:gap-7">
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
                    className="relative mb-1.5 block"
                    style={{ width: 13, height: 22 }}
                    initial={{ opacity: 0, scale: 0.4 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.2, y: -10 }}
                    transition={{ duration: 0.35 }}
                  >
                    <span
                      className="absolute -inset-3 rounded-full blur-md"
                      style={{
                        background:
                          "radial-gradient(circle, rgba(255,196,120,0.55) 0%, rgba(255,170,80,0) 70%)",
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

              {/* Smoke, once per candle */}
              <AnimatePresence>
                {candle.smoking && !candle.lit && (
                  <motion.span
                    aria-hidden="true"
                    className="pointer-events-none absolute -top-7 left-1/2 h-5 w-2 -translate-x-1/2 rounded-full bg-porcelain/25 blur-[3px]"
                    initial={{ opacity: 0, y: 0, scale: 0.5 }}
                    animate={{
                      opacity: [0, 0.55, 0],
                      y: [0, -14, -30],
                      scale: [0.5, 1.4, 2.4],
                      x: [0, 3, -2],
                    }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: reduced ? 0.2 : 2, ease: "easeOut" }}
                  />
                )}
              </AnimatePresence>

              {/* Wick */}
              <span aria-hidden="true" className="-mb-px block h-1.5 w-px bg-porcelain/35" />

              {/* Candle */}
              <button
                type="button"
                onClick={() => blowOne(candle.id)}
                disabled={wished || !candle.lit}
                aria-label={`Blow out candle ${candle.id + 1}`}
                className="focus-inset block h-12 w-2.5 cursor-pointer rounded-t-[3px] transition-all duration-500 disabled:cursor-default sm:h-14"
                style={{
                  background:
                    candle.id % 2 === 0
                      ? "linear-gradient(180deg,#F6E7DC 0%,#E3CDBB 100%)"
                      : "linear-gradient(180deg,#F3DDE4 0%,#DCB7C4 100%)",
                  boxShadow: "inset -1px 0 2px rgba(43,33,41,0.14), inset 1px 0 1px rgba(255,255,255,0.4)",
                  transform: candle.lit ? undefined : "scaleY(0.97)",
                  opacity: candle.lit ? 1 : 0.75,
                }}
              />
            </div>
          ))}
        </div>

        {/* Holder */}
        <div
          aria-hidden="true"
          className="h-px w-[15rem] bg-porcelain/20 transition-all duration-1000 sm:w-[19rem]"
          style={{ opacity: 0.4 + glow * 0.4 }}
        />

        {/* ── The control ── */}
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
                <p className="mt-4 text-[0.9375rem] leading-relaxed text-pretty text-porcelain/60">
                  {config.wish.blownBody}
                </p>
                <button
                  type="button"
                  onClick={relight}
                  className="focus-inset mt-7 min-h-11 cursor-pointer rounded-full border border-porcelain/25 px-6 text-[0.6875rem] font-medium tracking-[0.18em] text-porcelain/80 uppercase transition-colors duration-500 hover:border-brass-light/70 hover:text-brass-light"
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
                style={{ width: 132, height: 132 }}
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
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeDasharray={2 * Math.PI * 46}
                    strokeDashoffset={2 * Math.PI * 46 * (1 - progress)}
                    style={{ transition: "stroke-dashoffset 120ms linear" }}
                  />
                </svg>

                {/* Core */}
                <span
                  className="grid place-items-center rounded-full border border-porcelain/25 transition-all duration-500 group-hover:border-brass-light/60"
                  style={{
                    width: 92,
                    height: 92,
                    background: `rgba(252,249,245,${0.04 + progress * 0.1})`,
                    boxShadow: `0 0 ${20 + progress * 46}px rgba(217,195,145,${0.08 + progress * 0.24})`,
                  }}
                >
                  <span className="px-3 text-center text-[0.625rem] leading-snug font-medium tracking-[0.16em] text-porcelain/75 uppercase">
                    {progress > 0.02 ? config.wish.holdingLabel : config.wish.holdLabel}
                  </span>
                </span>
              </motion.button>
            )}
          </AnimatePresence>
        </div>

        {/* ── Hint ── */}
        <AnimatePresence>
          {!wished && (
            <motion.p
              className="mt-2 text-[0.75rem] tracking-[0.12em] text-porcelain/30 uppercase"
              initial={{ opacity: 0 }}
              animate={{ opacity: litCount === CANDLE_COUNT ? 1 : 0 }}
              exit={{ opacity: 0 }}
            >
              Or tap a candle to blow it out
            </motion.p>
          )}
        </AnimatePresence>
      </div>
    </SectionShell>
  );
}
