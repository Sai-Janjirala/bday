/**
 * Curtain.tsx — A physical velvet curtain with brass rod & tassel.
 *
 * Replaces any standard button. She grabs the velvet anywhere and drags UP
 * to open the evening. Folds bunch up at the top as the curtain rises,
 * while an ink line draws itself across the hem with honest rotating cues
 * while fonts & photos warm.
 */
import { useEffect, useState } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { config } from "../../config/content";
import { useDragOpen } from "../../hooks/useDragOpen";
import AnimatedText from "./AnimatedText";
import FloatingHearts from "./FloatingHearts";
import Petals from "./Petals";
import Stars from "./Stars";

interface CurtainProps {
  ready: boolean;
  onOpen: () => void;
}

const EASE = [0.76, 0, 0.24, 1] as const;

export default function Curtain({ ready, onOpen }: CurtainProps) {
  const reduced = useReducedMotion();
  const [cueIndex, setCueIndex] = useState(0);

  // Rotate through honest loading captions every 1.8s while warming assets
  useEffect(() => {
    if (ready) return;
    const interval = window.setInterval(() => {
      setCueIndex((prev) => (prev + 1) % config.intro.loadingCues.length);
    }, 1800);
    return () => window.clearInterval(interval);
  }, [ready]);

  const {
    dragProgress,
    isDragging,
    handlePointerDown,
    handlePointerMove,
    handlePointerUp,
    handleKeyDown,
    triggerOpen,
  } = useDragOpen({
    onOpen,
    enabled: ready,
    threshold: 160,
    reducedMotion: reduced,
  });

  // Calculate bunching folds and vertical lift based on drag progress
  const liftY = dragProgress * -100; // percent
  const foldCompression = 1 - dragProgress * 0.45;
  const bunchScale = 1 + dragProgress * 0.12;

  return (
    <motion.div
      role="region"
      aria-label="Birthday Curtain Intro"
      tabIndex={0}
      onKeyDown={handleKeyDown}
      onClick={reduced && ready ? triggerOpen : undefined}
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
          radial-gradient(ellipse at 50% 0%, rgba(69, 51, 71, 0.45) 0%, rgba(36, 27, 34, 0.95) 75%),
          repeating-linear-gradient(90deg, rgba(255,255,255,0.012) 0px, rgba(0,0,0,0.18) 32px, rgba(255,255,255,0.015) 64px)
        `,
      }}
      initial={false}
      exit={{ y: "-100%" }}
      transition={{ duration: reduced ? 0.3 : 1.15, ease: EASE }}
    >
      {/* ── Velvet Fold Highlights & Ambient Glow ── */}
      <div
        aria-hidden="true"
        data-decorative="true"
        className="pointer-events-none absolute inset-0 opacity-40 mix-blend-overlay"
        style={{
          background: `repeating-linear-gradient(
            90deg,
            rgba(176, 101, 124, 0.15) 0px,
            rgba(36, 27, 34, 0.4) 40px,
            rgba(217, 195, 145, 0.08) 80px
          )`,
        }}
      />

      <div
        aria-hidden="true"
        data-decorative="true"
        className="aura left-[-15%] top-[-10%] h-[32rem] w-[32rem] sm:h-[44rem] sm:w-[44rem]"
        style={{
          background:
            "radial-gradient(circle, rgba(176,101,124,0.22) 0%, rgba(176,101,124,0) 68%)",
        }}
      />
      <div
        aria-hidden="true"
        data-decorative="true"
        className="aura bottom-[-20%] right-[-15%] h-[30rem] w-[30rem] sm:h-[40rem] sm:w-[40rem]"
        style={{
          background:
            "radial-gradient(circle, rgba(169,138,86,0.18) 0%, rgba(169,138,86,0) 70%)",
        }}
      />

      <FloatingHearts count={16} density={0.8} />
      <Petals active mode="fall" count={30} duration={12000} />
      <Stars count={60} />

      {/* ── Top Brass Rod & Finials ── */}
      <div className="relative z-30 w-full pt-3 px-4 sm:px-8">
        <div className="relative mx-auto flex max-w-5xl items-center">
          {/* Left Brass Finial */}
          <div
            aria-hidden="true"
            className="h-5 w-5 rounded-full border border-brass-light/60 shadow-[0_2px_8px_rgba(0,0,0,0.5)]"
            style={{
              background:
                "radial-gradient(circle at 35% 35%, #f6e7dc 0%, #d9c391 40%, #8c6e38 100%)",
            }}
          />
          {/* Rod Bar */}
          <div
            aria-hidden="true"
            className="h-2 flex-1 rounded-sm border-y border-brass-light/40 shadow-inner"
            style={{
              background:
                "linear-gradient(180deg, #fbf7ee 0%, #d9c391 35%, #a98a56 70%, #685227 100%)",
            }}
          />
          {/* Right Brass Finial */}
          <div
            aria-hidden="true"
            className="h-5 w-5 rounded-full border border-brass-light/60 shadow-[0_2px_8px_rgba(0,0,0,0.5)]"
            style={{
              background:
                "radial-gradient(circle at 35% 35%, #f6e7dc 0%, #d9c391 40%, #8c6e38 100%)",
            }}
          />

          {/* Golden Tassel hanging from rod on the right */}
          <div
            aria-hidden="true"
            className="pointer-events-none absolute right-8 top-3 flex flex-col items-center origin-top transition-transform duration-300"
            style={{
              transform: `rotate(${dragProgress * 14 - 4}deg) translateY(${dragProgress * -10}px)`,
            }}
          >
            {/* Cord */}
            <div className="h-10 w-0.5 bg-gradient-to-b from-brass-light via-brass to-brass-light/70" />
            {/* Knot / Cap */}
            <div
              className="h-3.5 w-3.5 rounded-full border border-brass-light/50"
              style={{
                background: "radial-gradient(circle at 30% 30%, #f6e7dc, #a98a56)",
              }}
            />
            {/* Silk Fringe */}
            <div
              className="h-9 w-4 rounded-b-md opacity-90 shadow-md"
              style={{
                background:
                  "repeating-linear-gradient(90deg, #d9c391 0px, #a98a56 2px, #f6e7dc 4px)",
              }}
            />
          </div>
        </div>

        {/* Drapery Valance / Scalloped gather top */}
        <div
          aria-hidden="true"
          className="mx-auto max-w-5xl overflow-hidden pt-1"
          style={{
            transform: `scaleY(${bunchScale})`,
            transformOrigin: "top center",
          }}
        >
          <div className="flex justify-around opacity-35">
            {Array.from({ length: 9 }).map((_, i) => (
              <div
                key={i}
                className="h-4 w-16 -mx-1 rounded-b-full border-b border-porcelain/15 bg-gradient-to-b from-ink/30 to-ink-raised"
              />
            ))}
          </div>
        </div>
      </div>

      {/* ── Main Typography Stage ── */}
      <motion.div
        className="relative z-20 flex flex-1 flex-col items-center justify-center px-6 py-8 text-center"
        style={{
          transform: `translateY(${liftY * 0.3}px) scale(${foldCompression})`,
          transformOrigin: "center top",
        }}
      >
        <p className="eyebrow mb-8 text-brass-light/70">
          {ready ? `For ${config.herName}` : config.intro.loadingCues[cueIndex]}
        </p>

        <h1 className="max-w-2xl text-balance">
          <span className="block font-display text-[clamp(2.2rem,1.4rem+3.2vw,3.8rem)] leading-[1.12] text-porcelain/95">
            <AnimatedText text={config.intro.firstLine} delay={0.2} stagger={0.04} />
          </span>
          <span className="mt-3 block font-display text-[clamp(1.75rem,1.2rem+2.6vw,3rem)] leading-[1.18] font-light text-porcelain/65 italic">
            <AnimatedText
              text={config.intro.secondLine}
              mode="blur"
              delay={0.7}
              stagger={0.02}
            />
          </span>
        </h1>

        {/* ── Drag & Pull Invitation ── */}
        <div className="mt-12 flex flex-col items-center gap-3">
          {ready ? (
            <motion.div
              className="flex flex-col items-center gap-3"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
            >
              {/* Animated Drag Arrow Icon */}
              <motion.div
                className="grid h-14 w-14 place-items-center rounded-full border border-brass-light/35 bg-porcelain/5 text-brass-light shadow-lg backdrop-blur-sm"
                animate={
                  reduced
                    ? {}
                    : {
                        y: [0, -8, 0],
                        boxShadow: [
                          "0 4px 12px rgba(217,195,145,0.15)",
                          "0 8px 24px rgba(217,195,145,0.35)",
                          "0 4px 12px rgba(217,195,145,0.15)",
                        ],
                      }
                }
                transition={{ duration: 1.8, repeat: Infinity, ease: "easeInOut" }}
              >
                <svg viewBox="0 0 24 24" className="h-6 w-6 fill-none stroke-current stroke-2">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M5 15l7-7 7 7" />
                </svg>
              </motion.div>

              <p className="eyebrow text-porcelain/75">
                {isDragging ? "Keep dragging up…" : config.intro.dragHint}
              </p>
              <p className="text-[0.625rem] tracking-[0.16em] text-porcelain/40 uppercase">
                {config.intro.keyboardPrompt}
              </p>
            </motion.div>
          ) : (
            <div className="flex flex-col items-center gap-2">
              <span className="eyebrow text-porcelain/40">
                {config.intro.loadingCues[cueIndex]}
              </span>
            </div>
          )}
        </div>
      </motion.div>

      {/* ── Lower Curtain Hem & Ink Drawing Line ── */}
      <div className="relative z-20 w-full px-6 pb-8">
        {/* The Ink Line / Loading Hairline rule across lower curtain */}
        <div className="mx-auto max-w-xl">
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
              className="mt-2 flex justify-between px-2 text-brass-light/40"
              animate={reduced ? {} : { opacity: [0.3, 0.7, 0.3] }}
              transition={{ duration: 2, repeat: Infinity }}
            >
              {Array.from({ length: 15 }).map((_, i) => (
                <span
                  key={i}
                  className="inline-block h-3 w-px bg-current"
                  style={{
                    animationDelay: `${i * 120}ms`,
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
          <span>Keepsake</span>
        </div>
      </div>
    </motion.div>
  );
}
