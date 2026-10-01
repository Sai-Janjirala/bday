/**
 * Envelope — the physical object, nothing else.
 *
 * Layering, back to front: back panel → interior → top flap → wax
 * seal → front pocket. The flap's triangle and the pocket's V-notch
 * are cut to the same depth, so a sealed envelope reads as one
 * continuous sheet and the seam disappears.
 *
 * The envelope deliberately contains no children. The letter is
 * revealed by the section that owns this, which keeps the geometry
 * here simple and means the reading column is never trapped inside a
 * clipping box.
 */
import { motion, useReducedMotion } from "framer-motion";
import WaxSeal from "./WaxSeal";

interface EnvelopeProps {
  open: boolean;
  onToggle: () => void;
  monogram?: string;
  openLabel: string;
  closeLabel: string;
  /** Recedes slightly once the letter is out. */
  settled?: boolean;
  className?: string;
}

const EASE = [0.16, 1, 0.3, 1] as const;
/** Depth of the V — shared by the flap triangle and the pocket notch. */
const NOTCH = 58;

export default function Envelope({
  open,
  onToggle,
  monogram = "S",
  openLabel,
  closeLabel,
  settled = false,
  className = "",
}: EnvelopeProps) {
  const reduced = useReducedMotion();
  const flapDuration = reduced ? 0.01 : 0.85;

  return (
    <div
      className={`relative mx-auto w-full max-w-lg transition-all duration-1000 ${
        settled ? "scale-[0.9] opacity-70" : ""
      } ${className}`}
      style={{ transitionTimingFunction: "cubic-bezier(0.16,1,0.3,1)" }}
    >
      <div
        className="relative w-full"
        style={{ perspective: "1400px", aspectRatio: "16 / 10" }}
      >
        {/* ── Back panel ── */}
        <div
          aria-hidden="true"
          className="absolute inset-0 rounded-[5px] bg-[linear-gradient(165deg,#F4E9E0,#E4D3C6)]"
          style={{ boxShadow: "0 26px 60px -36px rgba(43,33,41,0.65)" }}
        />

        {/* ── Interior, revealed when the flap lifts ── */}
        <div
          aria-hidden="true"
          className="absolute inset-0 rounded-[5px] transition-opacity duration-700"
          style={{
            opacity: open ? 1 : 0,
            background:
              "linear-gradient(180deg, rgba(43,33,41,0.20) 0%, rgba(43,33,41,0.04) 45%)",
          }}
        />

        {/* ── Top flap ── */}
        <motion.div
          className="pointer-events-none absolute inset-x-0 top-0 origin-top"
          style={{ height: `${NOTCH}%`, transformStyle: "preserve-3d" }}
          initial={false}
          animate={{ rotateX: open ? -170 : 0 }}
          transition={{ duration: flapDuration, ease: EASE }}
        >
          <div
            aria-hidden="true"
            className="h-full w-full"
            style={{
              clipPath: "polygon(0 0, 100% 0, 50% 100%)",
              background: "linear-gradient(175deg, #F7EDE5 0%, #E6D4C5 100%)",
            }}
          />
        </motion.div>

        {/* ── Wax seal on the flap's point ── */}
        <div
          className="absolute inset-x-0 z-[4] flex justify-center"
          style={{ top: `${NOTCH - 8}%`, pointerEvents: open ? "none" : "auto" }}
        >
          <WaxSeal broken={open} monogram={monogram} size={84} />
        </div>

        {/* ── Front pocket ── */}
        <div
          aria-hidden="true"
          className="absolute inset-0 z-[5]"
          style={{
            clipPath: `polygon(0 0, 50% ${NOTCH}%, 100% 0, 100% 100%, 0 100%)`,
            background: "linear-gradient(172deg, #F0E1D6 0%, #DCC5B4 100%)",
          }}
        />
        {/* Edge highlights: the pocket should read as a separate sheet */}
        <div
          aria-hidden="true"
          className="absolute inset-x-0 bottom-0 z-[6] h-px"
          style={{
            background:
              "linear-gradient(90deg, transparent, rgba(43,33,41,0.16) 20%, rgba(43,33,41,0.16) 80%, transparent)",
          }}
        />
        <div
          aria-hidden="true"
          className="absolute inset-y-0 right-0 z-[6] w-px"
          style={{
            background:
              "linear-gradient(180deg, transparent, rgba(43,33,41,0.12) 25%, rgba(43,33,41,0.12) 75%, transparent)",
          }}
        />

        {/* ── The control ── */}
        <button
          type="button"
          onClick={onToggle}
          aria-expanded={open}
          className="focus-inset absolute inset-0 z-[7] cursor-pointer"
          style={{ background: "transparent" }}
        >
          <span className="sr-only">{open ? closeLabel : openLabel}</span>
        </button>
      </div>
    </div>
  );
}
