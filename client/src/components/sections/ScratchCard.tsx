/**
 * ScratchCard.tsx — Chapter III: The Golden Scratch Card Keepsake.
 *
 * Interactive feature:
 * A genuine canvas scratch-off card covered with shimmering gold foil.
 * She rubs her pointer/finger to scratch away the gold and reveal
 * a heartfelt hidden message underneath!
 */
import { useEffect, useRef, useState, useCallback } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { config } from "../../config/content";
import { useChimeSound } from "../../hooks/useChimeSound";
import SectionShell from "../ui/SectionShell";
import Flowers from "../ui/Flowers";
import Stars from "../ui/Stars";

export default function ScratchCard() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isRevealed, setIsRevealed] = useState(false);
  const [scratchedPercent, setScratchedPercent] = useState(0);
  const isDrawing = useRef(false);
  const reduced = useReducedMotion();
  const { playCelestialChime, playSoftBell } = useChimeSound();

  const handleCompleteReveal = useCallback(() => {
    if (isRevealed) return;
    setIsRevealed(true);
    setScratchedPercent(100);
    playCelestialChime();
  }, [isRevealed, playCelestialChime]);

  // Initialize canvas with shimmering gold foil
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || isRevealed) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const w = (canvas.width = canvas.offsetWidth);
    const h = (canvas.height = canvas.offsetHeight);

    // Draw shimmering metallic gold gradient
    const grad = ctx.createLinearGradient(0, 0, w, h);
    grad.addColorStop(0, "#E5C07B");
    grad.addColorStop(0.25, "#FFF4D4");
    grad.addColorStop(0.5, "#D4AF37");
    grad.addColorStop(0.75, "#AA8232");
    grad.addColorStop(1, "#E5C07B");

    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, w, h);

    // Add gold speckles / texture
    ctx.fillStyle = "rgba(255, 255, 255, 0.25)";
    for (let i = 0; i < 400; i++) {
      ctx.fillRect(Math.random() * w, Math.random() * h, 1.5, 1.5);
    }
    ctx.fillStyle = "rgba(100, 70, 20, 0.15)";
    for (let i = 0; i < 300; i++) {
      ctx.fillRect(Math.random() * w, Math.random() * h, 1, 1);
    }

    // Center foil seal prompt
    ctx.save();
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillStyle = "#5A3D14";
    ctx.font = "bold 13px 'Inter', sans-serif";
    ctx.letterSpacing = "0.2em";
    ctx.fillText("✨ SCRATCH WITH FINGER OR CURSOR ✨", w / 2, h / 2 - 12);
    ctx.fillStyle = "rgba(90, 61, 20, 0.7)";
    ctx.font = "italic 14px 'Cormorant Garamond', Georgia, serif";
    ctx.fillText("A private memory is hidden here", w / 2, h / 2 + 14);
    ctx.restore();
  }, [isRevealed]);

  // Scratch action
  const scratch = (clientX: number, clientY: number) => {
    if (isRevealed) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const rect = canvas.getBoundingClientRect();
    const x = clientX - rect.left;
    const y = clientY - rect.top;

    ctx.globalCompositeOperation = "destination-out";
    ctx.beginPath();
    ctx.arc(x, y, 28, 0, Math.PI * 2);
    ctx.fill();

    // Occasional sound
    if (Math.random() < 0.15) playSoftBell(1.4);

    // Sample pixels periodically to check progress
    if (Math.random() < 0.2) {
      try {
        const imgData = ctx.getImageData(0, 0, canvas.width, canvas.height);
        let clearCount = 0;
        const total = imgData.data.length / 4;
        for (let i = 3; i < imgData.data.length; i += 16) {
          if (imgData.data[i] === 0) clearCount += 4;
        }
        const pct = Math.round((clearCount / total) * 100);
        setScratchedPercent(pct);
        if (pct >= 42) {
          handleCompleteReveal();
        }
      } catch {
        /* Ignore canvas security errors if any */
      }
    }
  };

  const handlePointerDown = (e: React.PointerEvent) => {
    isDrawing.current = true;
    scratch(e.clientX, e.clientY);
  };
  const handlePointerMove = (e: React.PointerEvent) => {
    if (!isDrawing.current) return;
    scratch(e.clientX, e.clientY);
  };
  const handlePointerUp = () => {
    isDrawing.current = false;
  };

  return (
    <SectionShell
      id="secret"
      tone="linen"
      align="center"
      eyebrow={config.secret.eyebrow}
      title={config.secret.title}
      lede={config.secret.lede}
      spacing="tall"
      className="relative overflow-hidden"
    >
      <Stars count={40} />
      <Flowers variant="sprig" className="-left-8 top-12 w-44 opacity-40 sm:w-52" />
      <Flowers variant="blossom" className="-right-8 -bottom-8 w-48 opacity-40 sm:w-56" />

      <div className="relative mx-auto mt-6 max-w-xl">
        {/* Physical Paper Card with Golden Border */}
        <div className="relative overflow-hidden rounded-[8px] border-2 border-brass-light/40 bg-[#fdfaf5] p-8 shadow-[0_20px_50px_rgba(43,33,41,0.18)] sm:p-12">
          {/* Top Tag */}
          <div className="mb-6 flex items-center justify-between border-b border-ink-text/10 pb-3">
            <span className="eyebrow text-brass-light">{config.secret.badge}</span>
            <span className="text-xs font-serif text-muted">
              {isRevealed ? "Fully Revealed" : `${scratchedPercent}% Scratched`}
            </span>
          </div>

          {/* Hidden Message Content underneath */}
          <div className="relative min-h-[160px] flex flex-col items-center justify-center text-center">
            <span aria-hidden="true" className="text-2xl text-rose mb-3">
              ❦
            </span>
            <p className="font-display text-[clamp(1.2rem,1rem+1.2vw,1.65rem)] leading-relaxed text-ink-text italic">
              "{config.secret.secretNote}"
            </p>
            <p className="hand mt-6 text-xl text-rose-deep">
              — Written with all my heart
            </p>
          </div>

          {/* Shimmering Gold Foil Canvas Overlay */}
          {!isRevealed && (
            <canvas
              ref={canvasRef}
              onPointerDown={handlePointerDown}
              onPointerMove={handlePointerMove}
              onPointerUp={handlePointerUp}
              onPointerCancel={handlePointerUp}
              className="absolute inset-0 z-20 h-full w-full cursor-crosshair touch-none select-none transition-opacity duration-700"
              style={{
                opacity: isRevealed ? 0 : 1,
                pointerEvents: isRevealed ? "none" : "auto",
              }}
            />
          )}
        </div>

        {/* Action Controls & Accessible Fallback */}
        <div className="mt-6 flex flex-col items-center gap-3">
          <p className="eyebrow text-muted-light">
            {isRevealed ? "Secret Revealed ✨" : config.secret.revealHint}
          </p>
          {!isRevealed && (
            <button
              type="button"
              onClick={handleCompleteReveal}
              className="focus-inset rounded-full border border-ink-text/20 bg-porcelain px-5 py-2 text-[0.6875rem] font-medium tracking-[0.16em] text-ink-text/70 uppercase transition-colors hover:border-brass hover:text-ink-text"
            >
              Reveal Instant Message
            </button>
          )}
        </div>
      </div>
    </SectionShell>
  );
}
