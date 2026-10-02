/**
 * Curtain.tsx — The Redesigned Interactive Landing Experience.
 *
 * Art direction: "Keepsake Book Gateway"
 * Velvet portico with antique brass rod, hanging silk tassel, interactive
 * golden wax seal, floating stardust fireflies, and seamless drag/tap entrance.
 */
import { useEffect, useState } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { config } from "../../config/content";
import { useDragOpen } from "../../hooks/useDragOpen";
import { useChimeSound } from "../../hooks/useChimeSound";
import AnimatedText from "./AnimatedText";
import FloatingHearts from "./FloatingHearts";
import Petals from "./Petals";
import Stars from "./Stars";
import StardustCanvas from "./StardustCanvas";
import WaxSeal from "./WaxSeal";

interface CurtainProps {
  ready: boolean;
  onOpen: () => void;
}

const EASE = [0.76, 0, 0.24, 1] as const;

export default function Curtain({ ready, onOpen }: CurtainProps) {
  const reduced = useReducedMotion();
  const [cueIndex, setCueIndex] = useState(0);
  const [isHoveringSeal, setIsHoveringSeal] = useState(false);
  const { playCelestialChime, playSoftBell } = useChimeSound();

  // Rotate through honest loading captions while warming assets
  useEffect(() => {
    if (ready) return;
    const interval = window.setInterval(() => {
      setCueIndex((prev) => (prev + 1) % config.intro.loadingCues.length);
    }, 2000);
    return () => window.clearInterval(interval);
  }, [ready]);

  const handleOpenWithSound = () => {
    playCelestialChime();
    onOpen();
  };

  const {
    dragProgress,
    isDragging,
    handlePointerDown,
    handlePointerMove,
    handlePointerUp,
    handleKeyDown,
    triggerOpen,
  } = useDragOpen({
    onOpen: handleOpenWithSound,
    enabled: ready,
    threshold: 150,
    reducedMotion: reduced,
  });

  const liftY = dragProgress * -100;
  const foldCompression = 1 - dragProgress * 0.45;
  const bunchScale = 1 + dragProgress * 0.12;

  const handleSealClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!ready) return;
    playSoftBell(1.2);
    triggerOpen();
  };

  return (
    <motion.div
      role="region"
      aria-label="Birthday Keepsake Gateway"
      tabIndex={0}
      onKeyDown={handleKeyDown}
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerUp}
      onPointerCancel={handlePointerUp}
      className={`fixed inset-0 z-[75] flex flex-col justify-between overflow-hidden select-none touch-none ${
        ready ? (isDragging ? "cursor-grabbing" : "cursor-grab") : "cursor-wait"
      }`}
      style={{
        backgroundColor: "var(--color-ink)",
        backgroundImage: `
          radial-gradient(ellipse at 50% 10%, rgba(85, 45, 75, 0.4) 0%, rgba(20, 14, 21, 0.98) 80%),
          repeating-linear-gradient(90deg, rgba(255,255,255,0.015) 0px, rgba(0,0,0,0.2) 36px, rgba(255,255,255,0.018) 72px)
        `,
      }}
      initial={false}
      exit={{ y: "-100%" }}
      transition={{ duration: reduced ? 0.35 : 1.15, ease: EASE }}
    >
      {/* ── Interactive Stardust & Fireflies ── */}
      <StardustCanvas particleCount={50} />

      {/* ── Ambient Glow Auras ── */}
      <div
        aria-hidden="true"
        data-decorative="true"
        className="aura left-[-15%] top-[-10%] h-[34rem] w-[34rem] sm:h-[48rem] sm:w-[48rem]"
        style={{
          background:
            "radial-gradient(circle, rgba(183,110,121,0.28) 0%, rgba(183,110,121,0) 68%)",
        }}
      />
      <div
        aria-hidden="true"
        data-decorative="true"
        className="aura bottom-[-20%] right-[-15%] h-[32rem] w-[32rem] sm:h-[44rem] sm:w-[44rem]"
        style={{
          background:
            "radial-gradient(circle, rgba(212,175,55,0.22) 0%, rgba(212,175,55,0) 70%)",
        }}
      />

      <FloatingHearts count={16} density={0.8} />
      <Petals active mode="fall" count={28} duration={14000} />
      <Stars count={65} />

      {/* ── Top Brass Rod & Hanging Silk Tassel ── */}
      <div className="relative z-30 w-full pt-3 px-4 sm:px-8">
        <div className="relative mx-auto flex max-w-5xl items-center">
          {/* Left Finial */}
          <div
            aria-hidden="true"
            className="h-5 w-5 rounded-full border border-brass-light/70 shadow-[0_2px_10px_rgba(0,0,0,0.6)]"
            style={{
              background:
                "radial-gradient(circle at 35% 35%, #fff5ea 0%, #d9c391 45%, #7a5e29 100%)",
            }}
          />
          {/* Polished Rod Bar */}
          <div
            aria-hidden="true"
            className="h-2 flex-1 rounded-sm border-y border-brass-light/50 shadow-inner"
            style={{
              background:
                "linear-gradient(180deg, #fffcf5 0%, #d9c391 35%, #a98a56 70%, #523f1c 100%)",
            }}
          />
          {/* Right Finial */}
          <div
            aria-hidden="true"
            className="h-5 w-5 rounded-full border border-brass-light/70 shadow-[0_2px_10px_rgba(0,0,0,0.6)]"
            style={{
              background:
                "radial-gradient(circle at 35% 35%, #fff5ea 0%, #d9c391 45%, #7a5e29 100%)",
            }}
          />

          {/* Golden Silk Tassel with Physics Sway */}
          <div
            aria-hidden="true"
            className="pointer-events-none absolute right-8 top-3 flex flex-col items-center origin-top transition-transform duration-300"
            style={{
              transform: `rotate(${dragProgress * 16 - 3}deg) translateY(${dragProgress * -12}px)`,
            }}
          >
            <div className="h-12 w-0.5 bg-gradient-to-b from-brass-light via-brass to-brass-light/70" />
            <div
              className="h-4 w-4 rounded-full border border-brass-light/60 shadow-md"
              style={{
                background: "radial-gradient(circle at 30% 30%, #fff8eb, #a98a56)",
              }}
            />
            <div
              className="h-10 w-4.5 rounded-b-md opacity-95 shadow-lg"
              style={{
                background:
                  "repeating-linear-gradient(90deg, #e6ca85 0px, #a98a56 2px, #fff8eb 4px)",
              }}
            />
          </div>
        </div>

        {/* Velvet Valance Scallops */}
        <div
          aria-hidden="true"
          className="mx-auto max-w-5xl overflow-hidden pt-1"
          style={{
            transform: `scaleY(${bunchScale})`,
            transformOrigin: "top center",
          }}
        >
          <div className="flex justify-around opacity-30">
            {Array.from({ length: 9 }).map((_, i) => (
              <div
                key={i}
                className="h-4 w-16 -mx-1 rounded-b-full border-b border-porcelain/20 bg-gradient-to-b from-ink/30 to-ink-raised"
              />
            ))}
          </div>
        </div>
      </div>

      {/* ── Main Typography & Interactive Wax Seal Stage ── */}
      <motion.div
        className="relative z-20 flex flex-1 flex-col items-center justify-center px-6 py-6 text-center"
        style={{
          transform: `translateY(${liftY * 0.3}px) scale(${foldCompression})`,
          transformOrigin: "center top",
        }}
      >
        {/* Keepsake Ribbon Tag */}
        <motion.div
          className="mb-8 inline-flex items-center gap-2 rounded-full border border-brass-light/30 bg-porcelain/5 px-4 py-1.5 shadow-sm backdrop-blur-md"
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <span className="text-brass-light">❦</span>
          <span className="eyebrow text-brass-light/90">{config.intro.badge}</span>
        </motion.div>

        {/* Main Heading */}
        <h1 className="max-w-2xl text-balance">
          <span className="block font-display text-[clamp(2.3rem,1.4rem+3.4vw,4rem)] leading-[1.12] text-porcelain/95">
            <AnimatedText text={config.intro.firstLine} delay={0.2} stagger={0.04} />
          </span>
          <span className="mt-3 block font-display text-[clamp(1.65rem,1.2rem+2.2vw,2.8rem)] leading-[1.2] font-light text-porcelain/70 italic">
            <AnimatedText
              text={config.intro.secondLine}
              mode="blur"
              delay={0.65}
              stagger={0.02}
            />
          </span>
        </h1>

        {/* ── Interactive 3D Golden Wax Seal & Pull Prompt ── */}
        <div className="mt-10 flex flex-col items-center gap-4">
          {ready ? (
            <motion.div
              className="flex flex-col items-center gap-4"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8 }}
            >
              {/* Interactive Wax Seal Button */}
              <button
                type="button"
                onClick={handleSealClick}
                onMouseEnter={() => setIsHoveringSeal(true)}
                onMouseLeave={() => setIsHoveringSeal(false)}
                aria-label="Break wax seal and open the birthday keepsake"
                className="group relative cursor-pointer outline-none transition-transform duration-500 hover:scale-105 active:scale-95"
              >
                {/* Golden Halo Glow on hover */}
                <div
                  aria-hidden="true"
                  className="absolute -inset-4 rounded-full opacity-60 blur-xl transition-opacity duration-500 group-hover:opacity-100"
                  style={{
                    background:
                      "radial-gradient(circle, rgba(217,195,145,0.4) 0%, rgba(183,110,121,0.2) 50%, transparent 70%)",
                  }}
                />

                {/* Wax Seal Component with custom size */}
                <div className="relative shadow-[0_12px_32px_rgba(0,0,0,0.6)] rounded-full">
                  <WaxSeal size={96} monogram="★" />
                </div>

                {/* Subtle Ribbon Tail behind seal */}
                <div
                  aria-hidden="true"
                  className="pointer-events-none absolute -bottom-3 left-1/2 -translate-x-1/2 h-6 w-12 rounded-b-md bg-gradient-to-b from-[#8d4a5e] to-[#5a2e3c] opacity-80 shadow-md"
                  style={{ clipPath: "polygon(0 0, 100% 0, 85% 100%, 50% 70%, 15% 100%)" }}
                />
              </button>

              {/* Intuitive Drag & Tap Hint */}
              <div className="mt-2 flex flex-col items-center gap-1.5">
                <p className="eyebrow flex items-center gap-2 text-porcelain/90">
                  <motion.span
                    animate={reduced ? {} : { y: [0, -4, 0] }}
                    transition={{ duration: 1.6, repeat: Infinity, ease: "easeInOut" }}
                    className="inline-block text-brass-light"
                  >
                    ↑
                  </motion.span>
                  {isDragging ? "Keep dragging up…" : isHoveringSeal ? "Click seal to open" : config.intro.dragHint}
                </p>
                <p className="text-[0.625rem] tracking-[0.16em] text-porcelain/40 uppercase">
                  {config.intro.keyboardPrompt}
                </p>
              </div>
            </motion.div>
          ) : (
            <div className="flex flex-col items-center gap-3 py-6">
              <span className="eyebrow text-porcelain/60">
                {config.intro.loadingCues[cueIndex]}
              </span>
            </div>
          )}
        </div>
      </motion.div>

      {/* ── Lower Curtain Hem & Drawing Hairline ── */}
      <div className="relative z-20 w-full px-6 pb-8">
        <div className="mx-auto max-w-xl">
          {/* Hairline rule */}
          <div className="relative h-[2px] w-full overflow-hidden rounded-full bg-porcelain/10">
            <motion.div
              className="h-full bg-gradient-to-r from-transparent via-brass-light to-transparent"
              initial={{ x: "-100%" }}
              animate={
                ready
                  ? { x: "0%", width: "100%" }
                  : { x: ["-100%", "100%"] }
              }
              transition={
                ready
                  ? { duration: 0.6 }
                  : { repeat: Infinity, duration: 2.2, ease: "easeInOut" }
              }
            />
          </div>

          {/* Hem Fringe Ripple effect when ready */}
          {ready && (
            <motion.div
              aria-hidden="true"
              className="mt-2.5 flex justify-between px-2 text-brass-light/40"
              animate={reduced ? {} : { opacity: [0.35, 0.75, 0.35] }}
              transition={{ duration: 2.2, repeat: Infinity }}
            >
              {Array.from({ length: 17 }).map((_, i) => (
                <span
                  key={i}
                  className="inline-block h-3.5 w-px bg-current"
                  style={{
                    transformOrigin: "top",
                  }}
                />
              ))}
            </motion.div>
          )}
        </div>

        {/* ── Colophon ── */}
        <div className="mt-4 flex items-center justify-between gap-4 text-[0.625rem] tracking-[0.22em] text-porcelain/35 uppercase">
          <span>For {config.herName}</span>
          <span className="h-px flex-1 bg-porcelain/10" />
          <span>Keepsake Book</span>
        </div>
      </div>
    </motion.div>
  );
}
