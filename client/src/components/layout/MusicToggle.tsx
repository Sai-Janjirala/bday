/**
 * MusicToggle — the score, on her terms.
 *
 * Nothing plays until she presses this. When `config.music.src` is
 * empty the hook synthesises a slow ambient pad instead, so the
 * control is never a dead end and the site never needs an audio file
 * to feel finished.
 */
import { motion, useReducedMotion } from "framer-motion";
import { useState } from "react";
import { useAmbientMusic } from "../../hooks/useAmbientMusic";

interface MusicToggleProps {
  label: string;
  src: string | null;
  visible: boolean;
}

export default function MusicToggle({ label, src, visible }: MusicToggleProps) {
  const reduced = useReducedMotion();
  const { isPlaying, isSupported, error, toggle } = useAmbientMusic(src);
  const [expanded, setExpanded] = useState(false);

  return (
    <motion.div
      className="fixed right-4 bottom-4 z-[62] sm:right-6 sm:bottom-6"
      style={{ paddingBottom: "env(safe-area-inset-bottom, 0px)" }}
      initial={{ opacity: 0, y: 16 }}
      animate={visible ? { opacity: 1, y: 0 } : { opacity: 0, y: 16 }}
      transition={{ duration: 0.7, delay: 0.5 }}
    >
      <div className="flex flex-col items-end gap-2">
        {/* Label, shown briefly on first appearance then on hover/focus */}
        <motion.p
          className={`pointer-events-none max-w-[13rem] rounded-full bg-ink/85 px-4 py-2 text-right text-[0.6875rem] leading-snug text-porcelain/80 backdrop-blur-sm ${
            expanded || error ? "opacity-100" : "opacity-0"
          }`}
          initial={false}
          animate={{ opacity: expanded || error ? 1 : 0 }}
          transition={{ duration: 0.4 }}
        >
          {error ?? (src ? label : `${label} — a soft piano bed, generated in your browser`)}
        </motion.p>

        <button
          type="button"
          onClick={() => {
            if (!isSupported) return;
            toggle();
            setExpanded((prev) => !prev);
          }}
          onBlur={() => setExpanded(false)}
          disabled={!isSupported}
          aria-pressed={isPlaying}
          aria-label={isPlaying ? `Pause ${label}` : label}
          className="focus-inset group flex min-h-11 items-center gap-2.5 rounded-full border border-porcelain/15 bg-ink/80 py-2.5 pr-4 pl-3 text-porcelain/85 shadow-[0_10px_30px_-14px_rgba(36,27,34,0.9)] backdrop-blur-md transition-colors duration-500 hover:border-porcelain/35 hover:text-porcelain disabled:opacity-40"
        >
          {/* Three bars: still when paused, breathing when playing. */}
          <span
            aria-hidden="true"
            className="flex h-3.5 items-end gap-[3px]"
            style={{ opacity: isSupported ? 1 : 0.4 }}
          >
            {[0, 1, 2].map((bar) => (
              <motion.span
                key={bar}
                className="block w-[2px] rounded-full bg-current"
                animate={
                  isPlaying && !reduced
                    ? { height: ["5px", "14px", "7px", "12px", "5px"] }
                    : { height: isPlaying ? "10px" : ["5px", "5px", "5px"] }
                }
                transition={
                  isPlaying && !reduced
                    ? {
                        duration: 1.6,
                        repeat: Infinity,
                        ease: "easeInOut",
                        delay: bar * 0.22,
                      }
                    : { duration: 0.4 }
                }
                style={{ height: 5 }}
              />
            ))}
          </span>
          <span className="text-[0.6875rem] font-medium tracking-[0.16em] whitespace-nowrap uppercase">
            {isPlaying ? "Pause" : "Play"}
          </span>
        </button>
      </div>
    </motion.div>
  );
}
