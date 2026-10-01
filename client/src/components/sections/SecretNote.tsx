/**
 * SecretNote — the last thing, and the whole point.
 *
 * The note is hidden under a film of scratched-over paper (drawn on a
 * canvas in the section's own ink). She rubs it away with her finger
 * the way you'd scratch the wax off a lottery card, and what's under
 * it is not a candle or a countdown but his actual words to her.
 *
 * Keyboard and reduced-motion visitors get the same reveal through the
 * button — the canvas is a surface to play with, not a barrier.
 */
import { useCallback, useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { config } from "../../config/content";
import SectionShell from "../ui/SectionShell";
import Flowers from "../ui/Flowers";

const EASE = [0.16, 1, 0.3, 1] as const;
const CLEAR_RADIUS = 26;
/** Below this share of covered paper remaining, finish the reveal. */
const AUTO_REVEAL_AT = 0.25;

export default function SecretNote() {
  const [revealed, setRevealed] = useState(false);
  const [dragging, setDragging] = useState(false);
  const wrapRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const lastRef = useRef<{ x: number; y: number } | null>(null);
  const lastSampleRef = useRef(0);

  const paintCover = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const cssWidth = canvas.clientWidth;
    const cssHeight = canvas.clientHeight;
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    canvas.width = Math.max(1, Math.round(cssWidth * dpr));
    canvas.height = Math.max(1, Math.round(cssHeight * dpr));
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

    // Paper wash.
    const wash = ctx.createLinearGradient(0, 0, 0, cssHeight);
    wash.addColorStop(0, "#f2e9df");
    wash.addColorStop(1, "#e5d9c8");
    ctx.fillStyle = wash;
    ctx.fillRect(0, 0, cssWidth, cssHeight);

    // Diagonal hatching, like chalk scraped over paper.
    ctx.strokeStyle = "rgba(61,44,38,0.09)";
    ctx.lineWidth = 1;
    for (let x = -cssHeight; x < cssWidth; x += 11) {
      ctx.beginPath();
      ctx.moveTo(x, 0);
      ctx.lineTo(x + cssHeight, cssHeight);
      ctx.stroke();
    }

    // Ink flecks scattered at random — enough noise that the covered
    // area doesn't read as a flat solid.
    const flecks = Math.round((cssWidth * cssHeight) / 2600);
    for (let i = 0; i < flecks; i += 1) {
      ctx.fillStyle =
        Math.random() < 0.5 ? "rgba(61,44,38,0.06)" : "rgba(141,74,94,0.05)";
      ctx.beginPath();
      ctx.arc(
        Math.random() * cssWidth,
        Math.random() * cssHeight,
        Math.random() * 2.4 + 0.6,
        0,
        Math.PI * 2,
      );
      ctx.fill();
    }
  }, []);

  useEffect(() => {
    paintCover();
    const observer = new ResizeObserver(paintCover);
    if (wrapRef.current) observer.observe(wrapRef.current);
    return () => observer.disconnect();
  }, [paintCover]);

  const carve = (clientX: number, clientY: number) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const rect = canvas.getBoundingClientRect();
    const x = clientX - rect.left;
    const y = clientY - rect.top;
    const last = lastRef.current;

    // Erase a disc, plus a stroke between here and the previous point
    // so a fast finger never leaves dotted gaps.
    ctx.globalCompositeOperation = "destination-out";
    ctx.fillStyle = "rgba(0,0,0,1)";
    ctx.beginPath();
    ctx.arc(x, y, CLEAR_RADIUS, 0, Math.PI * 2);
    ctx.fill();
    if (last) {
      ctx.lineWidth = CLEAR_RADIUS * 2;
      ctx.lineCap = "round";
      ctx.beginPath();
      ctx.moveTo(last.x, last.y);
      ctx.lineTo(x, y);
      ctx.stroke();
    }
    lastRef.current = { x, y };

    // Sample the cover a few times a second and finish when she's
    // cleared more than three quarters of it.
    const now = performance.now();
    if (now - lastSampleRef.current < 90) return;
    lastSampleRef.current = now;

    const alpha = ctx.getImageData(0, 0, canvas.width, canvas.height).data;
    // Stride in device pixels so the read stays cheap on retina.
    const step = Math.max(4, Math.round(Math.max(canvas.width, canvas.height) / 90));
    let opaque = 0;
    let total = 0;
    for (let y = 0; y < canvas.height; y += step) {
      for (let x = 0; x < canvas.width; x += step) {
        total += 1;
        if (alpha[(y * canvas.width + x) * 4 + 3] > 200) opaque += 1;
      }
    }
    if (opaque / total < AUTO_REVEAL_AT) {
      setRevealed(true);
      lastRef.current = null;
    }
  };

  const scratch = (event: React.PointerEvent<HTMLCanvasElement>) => {
    if (revealed || !dragging) return;
    carve(event.clientX, event.clientY);
  };

  const revealAll = () => {
    setRevealed(true);
    lastRef.current = null;
  };

  const hideAgain = () => {
    setRevealed(false);
    paintCover();
  };

  const initial = config.herName.charAt(0).toUpperCase();
  const watchRef = useRef<HTMLDivElement>(null);

  return (
    <SectionShell
      id="secret"
      tone="linen"
      marker="IX"
      eyebrow={config.secretNote.eyebrow}
      title={config.secretNote.title}
      lede={config.secretNote.lede}
      spacing="tall"
    >
      <Flowers variant="rose" className="-bottom-8 -left-10 w-44 opacity-60 sm:w-56" />
      <Flowers variant="blossom" className="-right-8 top-8 w-32 opacity-50" />

      <div className="mx-auto mt-6 max-w-2xl">
        <div className="paper-edge relative rounded-lg bg-porcelain/70 p-7 sm:p-12">
          <div ref={wrapRef} className="relative">
            {/* The note itself — hidden until the cover is cleared. */}
            <motion.div
              ref={watchRef}
              animate={{ scale: revealed ? 1 : 0.995, y: revealed ? 0 : 2 }}
              transition={{ duration: 0.9, ease: EASE }}
            >
              {config.secretNote.note.split("\n\n").map((paragraph, i) => (
                <p
                  key={i}
                  className={
                    i === 0
                      ? "font-display text-[1.45rem] leading-snug text-rose sm:text-2xl"
                      : "mt-6 font-serif text-[1.06rem] leading-8 text-ink-text sm:text-lg sm:leading-9"
                  }
                >
                  {paragraph}
                </p>
              ))}

              {/* The stamp — hers. */}
              <div className="pointer-events-none mt-10 flex justify-end">
                <div className="-rotate-[7deg]">
                  <div className="flex h-22 w-22 items-center justify-center rounded-full border border-rose/45 p-1.5">
                    <div className="flex h-full w-full flex-col items-center justify-center gap-0.5 rounded-full border border-rose/35">
                      <span className="font-display text-2xl text-rose">{initial}</span>
                      <span className="text-[0.5rem] font-medium tracking-[0.24em] text-rose/75 uppercase">
                        {config.secretNote.stamped}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* The scratch cover, erased as she rubs. */}
            <AnimatePresence>
              {!revealed && (
                <motion.canvas
                  ref={canvasRef}
                  role="img"
                  aria-label={config.secretNote.hint}
                  className="absolute inset-0 h-full w-full cursor-crosshair rounded-md selection:bg-transparent"
                  style={{ touchAction: "none" }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.7, ease: "easeOut" }}
                  onPointerDown={(event) => {
                    event.preventDefault();
                    setDragging(true);
                    lastRef.current = { x: event.clientX, y: event.clientY };
                    carve(event.clientX, event.clientY);
                  }}
                  onPointerMove={scratch}
                  onPointerUp={() => setDragging(false)}
                  onPointerLeave={() => setDragging(false)}
                />
              )}
            </AnimatePresence>

            {/* Hint chip while there's still paper to clear. */}
            <AnimatePresence>
              {!revealed && (
                <motion.p
                  className="pointer-events-none absolute bottom-4 left-1/2 z-10 rounded-full bg-ink-soft/90 px-4 py-1.5 text-[0.625rem] font-medium tracking-[0.18em] text-porcelain uppercase backdrop-blur-sm"
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 8 }}
                  transition={{ duration: 0.6 }}
                >
                  {config.secretNote.hint}
                </motion.p>
              )}
            </AnimatePresence>
          </div>

          <div className="mt-10 text-center">
            <AnimatePresence mode="wait">
              {!revealed ? (
                <motion.button
                  key="reveal"
                  type="button"
                  onClick={revealAll}
                  className="focus-inset font-medium text-rose underline decoration-rose/40 underline-offset-4 transition-colors hover:decoration-rose cursor-pointer"
                  exit={{ opacity: 0 }}
                >
                  {config.secretNote.revealNow}
                </motion.button>
              ) : (
                <motion.button
                  key="hide"
                  type="button"
                  onClick={hideAgain}
                  className="focus-inset font-medium text-muted-light underline decoration-muted-light/40 underline-offset-4 transition-colors hover:text-rose hover:decoration-rose cursor-pointer"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                >
                  {config.secretNote.hide}
                </motion.button>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </SectionShell>
  );
}