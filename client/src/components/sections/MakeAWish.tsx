/**
 * MakeAWish — Chapter III: The Interactive Birthday Cake & Candle Blowing Ritual.
 *
 * Features:
 * - Real Microphone Blowing Detection via Web Audio API (AnalyserNode & getUserMedia)
 * - Swipe / Drag across candle flames to blow them out in a wave
 * - Tap individual flames or hold the ritual ring
 * - Multi-tier romantic birthday cake with golden frosting & realistic flickering candles
 * - Realistic flame physics (tilts & flickers with blow strength)
 * - Rising smoke particles, fireworks & stardust burst on wish completion
 */
import { useCallback, useEffect, useRef, useState } from "react";
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
  tilt: number; // flame tilt angle in degrees (-35 to +35)
}

const freshCandles = (): Candle[] =>
  Array.from({ length: CANDLE_COUNT }, (_, i) => ({
    id: i,
    lit: true,
    smoking: false,
    tilt: 0,
  }));

export default function MakeAWish() {
  const reduced = useReducedMotion();
  const [candles, setCandles] = useState<Candle[]>(freshCandles);
  const [wished, setWished] = useState(false);
  const [burst, setBurst] = useState(false);
  const [micActive, setMicActive] = useState(false);
  const [micError, setMicError] = useState<string | null>(null);
  const [blowIntensity, setBlowIntensity] = useState(0); // 0 to 1
  const [swipeActive, setSwipeActive] = useState(false);

  const railRef = useRef<HTMLButtonElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const audioCtxRef = useRef<AudioContext | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const animFrameRef = useRef<number | null>(null);
  const blowCountRef = useRef(0);

  const { playCelestialChime, playCandleBlow, playSoftBell } = useChimeSound();

  const litCount = candles.filter((c) => c.lit).length;

  const extinguish = useCallback((id?: number) => {
    setCandles((current) => {
      return current.map((candle) => {
        if (id === undefined || candle.id === id) {
          if (!candle.lit) return candle;
          return { ...candle, lit: false, smoking: true, tilt: 0 };
        }
        return candle;
      });
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

  const blowOne = useCallback(
    (id: number) => {
      if (wished) return;
      playCandleBlow();
      extinguish(id);
      setCandles((current) => {
        const remainingLit = current.filter((c) => c.id !== id && c.lit).length;
        if (remainingLit === 0) {
          setWished(true);
          setBurst(true);
          playCelestialChime();
        }
        return current;
      });
    },
    [wished, extinguish, playCandleBlow, playCelestialChime],
  );

  // ── Microphone Blow Detection ──
  const toggleMicrophone = async () => {
    if (micActive) {
      // Stop mic
      if (streamRef.current) {
        streamRef.current.getTracks().forEach((track) => track.stop());
      }
      if (animFrameRef.current) {
        cancelAnimationFrame(animFrameRef.current);
      }
      setMicActive(false);
      setBlowIntensity(0);
      return;
    }

    try {
      setMicError(null);
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true, video: false });
      streamRef.current = stream;

      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      const audioCtx = new AudioCtx();
      audioCtxRef.current = audioCtx;

      const source = audioCtx.createMediaStreamSource(stream);
      const analyser = audioCtx.createAnalyser();
      analyser.fftSize = 256;
      source.connect(analyser);
      analyserRef.current = analyser;

      setMicActive(true);

      const buffer = new Uint8Array(analyser.frequencyBinCount);

      const detectBlow = () => {
        if (!analyserRef.current) return;
        analyserRef.current.getByteFrequencyData(buffer);

        // Blow sounds produce high energy across low-mid frequencies (100Hz - 1500Hz)
        let sum = 0;
        const lowMidBins = Math.min(buffer.length, 32);
        for (let i = 0; i < lowMidBins; i++) {
          sum += buffer[i];
        }
        const avg = sum / lowMidBins;
        const rawIntensity = Math.min(1, Math.max(0, (avg - 35) / 110));

        setBlowIntensity(rawIntensity);

        // If intensity is strong enough, tilt candles and blow out
        if (rawIntensity > 0.25) {
          const tiltAngle = (rawIntensity * 40 - 15) * (Math.random() > 0.5 ? 1 : -1);
          setCandles((current) =>
            current.map((c) => (c.lit ? { ...c, tilt: tiltAngle } : c)),
          );

          if (rawIntensity > 0.45) {
            blowCountRef.current += 1;
            if (blowCountRef.current > 4) {
              blowCountRef.current = 0;
              // Blow out candles one by one or all
              setCandles((current) => {
                const litCandles = current.filter((c) => c.lit);
                if (litCandles.length > 0) {
                  const target = litCandles[Math.floor(Math.random() * litCandles.length)];
                  playCandleBlow();
                  const next = current.map((c) =>
                    c.id === target.id ? { ...c, lit: false, smoking: true } : c,
                  );
                  if (next.every((c) => !c.lit)) {
                    setWished(true);
                    setBurst(true);
                    playCelestialChime();
                  }
                  return next;
                }
                return current;
              });
            }
          }
        } else {
          blowCountRef.current = 0;
          setCandles((current) => current.map((c) => ({ ...c, tilt: 0 })));
        }

        animFrameRef.current = requestAnimationFrame(detectBlow);
      };

      detectBlow();
    } catch (err) {
      console.warn("Microphone access failed or denied", err);
      setMicError("Mic access denied or unsupported. Tap or swipe candles to blow!");
      setMicActive(false);
    }
  };

  useEffect(() => {
    return () => {
      if (streamRef.current) {
        streamRef.current.getTracks().forEach((track) => track.stop());
      }
      if (animFrameRef.current) {
        cancelAnimationFrame(animFrameRef.current);
      }
      if (audioCtxRef.current) {
        audioCtxRef.current.close();
      }
    };
  }, []);

  // ── Swipe / Drag Over Flame Gesture ──
  const handlePointerMove = (e: React.PointerEvent) => {
    if (!swipeActive || wished) return;
    const elements = document.elementsFromPoint(e.clientX, e.clientY);
    elements.forEach((el) => {
      const candleIdAttr = el.getAttribute("data-candle-id");
      if (candleIdAttr !== null) {
        const id = parseInt(candleIdAttr, 10);
        if (!isNaN(id)) {
          const candle = candles.find((c) => c.id === id);
          if (candle && candle.lit) {
            blowOne(id);
          }
        }
      }
    });
  };

  const relight = () => {
    playSoftBell(1.2);
    reset();
    setCandles(freshCandles());
    setWished(false);
    setBurst(false);
    setBlowIntensity(0);
    railRef.current?.focus();
  };

  const glow = wished ? 0.25 : 0.45 + progress * 0.55 + blowIntensity * 0.3;
  const glowScale = wished ? 0.9 : 1 + progress * 0.12 + blowIntensity * 0.15;

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
      <StardustCanvas particleCount={45} glowColor="255, 196, 120" />
      <Petals active={burst} mode="burst" count={50} duration={2600} />
      <Stars count={60} />
      <Flowers variant="sprig" tone="night" className="-top-12 -left-12 w-44 opacity-35 sm:w-52" />
      <Flowers variant="cluster" tone="night" className="-right-12 -bottom-12 w-52 opacity-30 sm:w-60" />

      {/* Atmospheric candle lighting glow */}
      <div
        aria-hidden="true"
        data-decorative="true"
        className="pointer-events-none absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full transition-all duration-700"
        style={{
          width: "min(48rem, 135vw)",
          height: "min(48rem, 135vw)",
          background:
            "radial-gradient(circle, rgba(255,180,100,0.32) 0%, rgba(210,130,70,0.12) 40%, rgba(36,27,34,0) 70%)",
          opacity: glow,
          transform: `translate(-50%, -50%) scale(${glowScale})`,
        }}
      />

      <div className="relative z-10 mx-auto flex max-w-2xl flex-col items-center">
        {/* Chapter badge */}
        <div className="mb-4 inline-flex items-center gap-2 rounded-full bg-porcelain/10 px-3.5 py-1 backdrop-blur-sm">
          <span className="text-brass-light text-xs">✨</span>
          <span className="eyebrow text-brass-light/80">{config.wish.chapter}</span>
        </div>

        {/* ── Microphone Blow Toggle Control Bar ── */}
        <div className="mb-8 flex flex-col items-center gap-2">
          <button
            type="button"
            onClick={toggleMicrophone}
            disabled={wished}
            className={`focus-inset group relative inline-flex items-center gap-2.5 rounded-full border px-5 py-2 text-xs font-medium tracking-wider uppercase transition-all duration-300 ${
              micActive
                ? "border-rose-300 bg-rose-900/40 text-rose-100 shadow-[0_0_20px_rgba(225,100,120,0.4)]"
                : "border-brass-light/40 bg-porcelain/10 text-porcelain/90 hover:border-brass-light hover:bg-porcelain/20"
            }`}
          >
            <span className={`inline-block text-sm ${micActive ? "animate-pulse" : ""}`}>
              {micActive ? "🎙️" : "🎤"}
            </span>
            <span>{micActive ? "Microphone Blow Active" : "Enable Microphone Blow"}</span>
            {micActive && (
              <span className="relative flex h-2 w-2">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-rose-400 opacity-75" />
                <span className="relative inline-flex h-2 w-2 rounded-full bg-rose-500" />
              </span>
            )}
          </button>

          {/* Blow Intensity Visual Meter */}
          {micActive && (
            <div className="flex items-center gap-2 text-[0.6875rem] text-porcelain/70">
              <span>Blow meter:</span>
              <div className="h-2 w-28 overflow-hidden rounded-full bg-porcelain/20">
                <div
                  className="h-full bg-gradient-to-r from-amber-400 via-rose-400 to-rose-600 transition-all duration-75"
                  style={{ width: `${Math.round(blowIntensity * 100)}%` }}
                />
              </div>
            </div>
          )}

          {micError && <p className="text-xs text-rose-300/80">{micError}</p>}
        </div>

        {/* ── Realistic Birthday Cake & Interactive Candles Stage ── */}
        <div
          ref={containerRef}
          onPointerDown={() => setSwipeActive(true)}
          onPointerUp={() => setSwipeActive(false)}
          onPointerLeave={() => setSwipeActive(false)}
          onPointerMove={handlePointerMove}
          className="relative mb-8 flex flex-col items-center select-none"
        >
          {/* ── The 5 Interactive Candles ── */}
          <div className="relative z-20 mb-[-12px] flex items-end justify-center gap-5 sm:gap-9">
            {candles.map((candle) => (
              <div
                key={candle.id}
                data-candle-id={candle.id}
                onClick={() => blowOne(candle.id)}
                className="group relative flex cursor-pointer flex-col items-center"
              >
                {/* Flame */}
                <AnimatePresence>
                  {candle.lit && (
                    <motion.span
                      aria-hidden="true"
                      className="relative mb-1 block cursor-pointer"
                      style={{
                        width: 18,
                        height: 28,
                        transformOrigin: "50% 100%",
                        transform: `rotate(${candle.tilt}deg)`,
                      }}
                      initial={{ opacity: 0, scale: 0.4 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.2, y: -16 }}
                      transition={{ duration: 0.35 }}
                    >
                      {/* Outer Flame Glow Halo */}
                      <span
                        className="absolute -inset-4 rounded-full blur-md"
                        style={{
                          background:
                            "radial-gradient(circle, rgba(255,196,100,0.75) 0%, rgba(255,140,50,0) 70%)",
                          animation: reduced
                            ? undefined
                            : "breathe 1.8s ease-in-out infinite alternate",
                        }}
                      />
                      {/* Outer Flame Shape */}
                      <span
                        data-decorative="true"
                        className="absolute inset-0 block"
                        style={{
                          background:
                            "radial-gradient(ellipse at 50% 80%, #FFFCE0 0%, #FFC966 35%, #F07A28 72%, rgba(198,70,30,0) 100%)",
                          borderRadius: "50% 50% 45% 45% / 65% 65% 35% 35%",
                          transformOrigin: "50% 100%",
                          animation: reduced
                            ? undefined
                            : `flicker ${2.8 + candle.id * 0.3}s ease-in-out infinite alternate`,
                          filter: "drop-shadow(0 0 6px rgba(255, 180, 50, 0.8))",
                        }}
                      />
                      {/* Inner Flame Core */}
                      <span
                        className="absolute bottom-1 left-1/2 h-3.5 w-2 -translate-x-1/2 rounded-full"
                        style={{ background: "#FFFFFF", opacity: 0.95 }}
                      />
                    </motion.span>
                  )}
                </AnimatePresence>

                {/* Smoke physics on blowout */}
                <AnimatePresence>
                  {candle.smoking && !candle.lit && (
                    <motion.span
                      aria-hidden="true"
                      className="pointer-events-none absolute -top-10 left-1/2 h-8 w-3 -translate-x-1/2 rounded-full bg-porcelain/35 blur-[3px]"
                      initial={{ opacity: 0, y: 0, scale: 0.4 }}
                      animate={{
                        opacity: [0, 0.75, 0],
                        y: [-2, -24, -48],
                        scale: [0.4, 1.8, 3.2],
                        x: [0, (candle.id % 2 === 0 ? 8 : -8), 4],
                      }}
                      exit={{ opacity: 0 }}
                      transition={{ duration: reduced ? 0.3 : 2.5, ease: "easeOut" }}
                    />
                  )}
                </AnimatePresence>

                {/* Candle Wick */}
                <span aria-hidden="true" className="-mb-px block h-2.5 w-0.5 bg-zinc-800" />

                {/* Candle Body */}
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    blowOne(candle.id);
                  }}
                  disabled={wished || !candle.lit}
                  aria-label={`Blow out candle ${candle.id + 1}`}
                  className="focus-inset relative block h-16 w-3.5 cursor-pointer rounded-t-[4px] transition-all duration-500 disabled:cursor-default sm:h-20 sm:w-4"
                  style={{
                    background:
                      candle.id % 2 === 0
                        ? "linear-gradient(180deg,#F9E5D9 0%,#E4C3B2 60%,#D1A995 100%)"
                        : "linear-gradient(180deg,#F5DFE8 0%,#DFB0C2 60%,#C890A5 100%)",
                    boxShadow:
                      "inset -1px 0 2px rgba(43,33,41,0.22), inset 1px 0 2px rgba(255,255,255,0.6)",
                    opacity: candle.lit ? 1 : 0.7,
                  }}
                >
                  {/* Wax Drips Detail */}
                  <span className="absolute top-1 left-0.5 h-3 w-1 rounded-full bg-white/40" />
                </button>
              </div>
            ))}
          </div>

          {/* ── Multi-Tiered Birthday Cake SVG Graphic ── */}
          <div className="relative z-10 w-64 sm:w-80">
            <svg viewBox="0 0 320 180" className="w-full drop-shadow-2xl" fill="none">
              <defs>
                {/* Cake Top Tier Gradient */}
                <linearGradient id="cakeTop" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#FFF1E8" />
                  <stop offset="50%" stopColor="#F8D7C4" />
                  <stop offset="100%" stopColor="#E2B199" />
                </linearGradient>
                {/* Cake Bottom Tier Gradient */}
                <linearGradient id="cakeBottom" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#F8E6ED" />
                  <stop offset="50%" stopColor="#EAB3C8" />
                  <stop offset="100%" stopColor="#C9819D" />
                </linearGradient>
                {/* Gold Icing Frosting */}
                <linearGradient id="goldIcing" x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%" stopColor="#FDF0D5" />
                  <stop offset="50%" stopColor="#D4AF37" />
                  <stop offset="100%" stopColor="#AA7C11" />
                </linearGradient>
                <linearGradient id="plateGrad" x1="0%" y1="0%" x2="0%" y2="100%">
                  <stop offset="0%" stopColor="#FFFFFF" stopOpacity="0.8" />
                  <stop offset="100%" stopColor="#D9D9D9" stopOpacity="0.3" />
                </linearGradient>
              </defs>

              {/* Cake Stand Plate */}
              <ellipse cx="160" cy="168" rx="145" ry="12" fill="url(#plateGrad)" />
              <ellipse cx="160" cy="165" rx="135" ry="10" fill="#FCF9F5" opacity="0.9" />

              {/* Bottom Tier */}
              <rect x="50" y="95" width="220" height="65" rx="12" fill="url(#cakeBottom)" />
              {/* Bottom Tier Frosting Swags */}
              <path
                d="M 50 100 Q 77.5 118 105 100 Q 132.5 118 160 100 Q 187.5 118 215 100 Q 242.5 118 270 100 L 270 95 L 50 95 Z"
                fill="#FFF9F5"
                opacity="0.95"
              />

              {/* Top Tier */}
              <rect x="80" y="38" width="160" height="60" rx="10" fill="url(#cakeTop)" />
              {/* Top Tier Cream Drips */}
              <path
                d="M 80 42 Q 96 56 112 42 Q 128 58 144 42 Q 160 56 176 42 Q 192 58 208 42 Q 224 56 240 42 L 240 38 L 80 38 Z"
                fill="#FFFFFF"
              />

              {/* Decorative Strawberries / Cherries on Top */}
              <circle cx="95" cy="38" r="6" fill="#D9534F" />
              <circle cx="127" cy="38" r="6" fill="#D9534F" />
              <circle cx="160" cy="38" r="7" fill="#C9302C" />
              <circle cx="193" cy="38" r="6" fill="#D9534F" />
              <circle cx="225" cy="38" r="6" fill="#D9534F" />

              {/* Gold Pearl Sprinkles */}
              <circle cx="90" cy="125" r="2.5" fill="url(#goldIcing)" />
              <circle cx="125" cy="135" r="2.5" fill="url(#goldIcing)" />
              <circle cx="160" cy="122" r="3" fill="url(#goldIcing)" />
              <circle cx="195" cy="135" r="2.5" fill="url(#goldIcing)" />
              <circle cx="230" cy="125" r="2.5" fill="url(#goldIcing)" />
            </svg>
          </div>
        </div>

        {/* ── Central Ritual Hold Control ── */}
        <div className="mt-4 flex min-h-[7.5rem] flex-col items-center justify-center">
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
                {/* Ring Track */}
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
                    strokeWidth="2.5"
                    strokeLinecap="round"
                    strokeDasharray={2 * Math.PI * 46}
                    strokeDashoffset={2 * Math.PI * 46 * (1 - progress)}
                    style={{ transition: "stroke-dashoffset 120ms linear" }}
                  />
                </svg>

                {/* Core Button */}
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
              className="mt-3 text-[0.75rem] tracking-[0.12em] text-porcelain/50 uppercase"
              initial={{ opacity: 0 }}
              animate={{ opacity: litCount > 0 ? 1 : 0 }}
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
