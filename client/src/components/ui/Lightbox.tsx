/**
 * Lightbox — full-screen photo viewing.
 *
 * Swipe, drag, arrow keys, and large tap targets, because this has to
 * work with a thumb. Focus moves into the dialog on open and returns
 * to the trigger on close, and the page behind is locked so a stray
 * scroll doesn't move the gallery out from under her.
 */
import { useCallback, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import PhotoPlaceholder from "./PhotoPlaceholder";

export interface LightboxItem {
  image: string;
  caption: string;
  date: string;
  tag: string;
}

interface LightboxProps {
  memories: LightboxItem[];
  index: number | null;
  onClose: () => void;
  onNavigate: (index: number) => void;
  labels: { close: string; previous: string; next: string };
}

const DRAG_THRESHOLD = 60;

export default function Lightbox({
  memories,
  index,
  onClose,
  onNavigate,
  labels,
}: LightboxProps) {
  const isOpen = index !== null;
  const panelRef = useRef<HTMLDivElement>(null);
  const closeRef = useRef<HTMLButtonElement>(null);
  const returnFocusRef = useRef<HTMLElement | null>(null);
  const dragX = useRef(0);

  const go = useCallback(
    (delta: number) => {
      if (index === null) return;
      const next = (index + delta + memories.length) % memories.length;
      onNavigate(next);
    },
    [index, memories.length, onNavigate],
  );

  // ── Keyboard ──
  useEffect(() => {
    if (!isOpen) return;
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
      if (event.key === "ArrowRight") go(1);
      if (event.key === "ArrowLeft") go(-1);
      if (event.key === "Tab") {
        // Small, fixed set of controls — cycle them so focus can't
        // escape into the page behind the dialog.
        const focusables = panelRef.current?.querySelectorAll<HTMLElement>(
          "button:not([disabled])",
        );
        if (!focusables || focusables.length === 0) return;
        const first = focusables[0];
        const last = focusables[focusables.length - 1];
        if (event.shiftKey && document.activeElement === first) {
          event.preventDefault();
          last.focus();
        } else if (!event.shiftKey && document.activeElement === last) {
          event.preventDefault();
          first.focus();
        }
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [isOpen, go, onClose]);

  // ── Focus + scroll lock ──
  useEffect(() => {
    if (!isOpen) return;
    returnFocusRef.current = document.activeElement as HTMLElement | null;

    const { body } = document;
    const previousOverflow = body.style.overflow;
    const previousPadding = body.style.paddingRight;
    // Compensate so locking the page doesn't nudge desktop layouts.
    const gap = window.innerWidth - document.documentElement.clientWidth;
    body.style.overflow = "hidden";
    if (gap > 0) body.style.paddingRight = `${gap}px`;

    const focusTimer = window.setTimeout(() => closeRef.current?.focus(), 60);

    return () => {
      window.clearTimeout(focusTimer);
      body.style.overflow = previousOverflow;
      body.style.paddingRight = previousPadding;
      returnFocusRef.current?.focus?.();
    };
  }, [isOpen]);

  const active = index === null ? null : memories[index];

  return (
    <AnimatePresence>
      {isOpen && active && (
        <motion.div
          ref={panelRef}
          role="dialog"
          aria-modal="true"
          aria-label={active.caption}
          className="fixed inset-0 z-[80] flex flex-col bg-ink/96 backdrop-blur-md"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.4 }}
        >
          {/* ── Top bar ── */}
          <div className="flex shrink-0 items-center justify-between gap-4 px-4 py-4 sm:px-8 sm:py-6">
            <p className="font-sans text-[0.6875rem] tracking-[0.24em] text-porcelain/50 uppercase tabular-nums">
              <span className="text-porcelain/90">{(index ?? 0) + 1}</span>
              <span className="mx-2 text-porcelain/30">/</span>
              {memories.length}
            </p>
            <button
              ref={closeRef}
              type="button"
              onClick={onClose}
              aria-label={labels.close}
              className="focus-inset -mr-2 grid h-11 w-11 place-items-center rounded-full text-porcelain/70 transition-colors duration-300 hover:bg-porcelain/10 hover:text-porcelain"
            >
              <svg
                viewBox="0 0 24 24"
                className="h-5 w-5"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.4"
                aria-hidden="true"
              >
                <path d="M6 6l12 12M18 6L6 18" />
              </svg>
            </button>
          </div>

          {/* ── Stage ── */}
          <div
            className="relative flex min-h-0 flex-1 items-center justify-center px-4 sm:px-16"
            onPointerDown={(e) => {
              dragX.current = e.clientX;
            }}
            onPointerUp={(e) => {
              const delta = e.clientX - dragX.current;
              if (Math.abs(delta) > DRAG_THRESHOLD) go(delta < 0 ? 1 : -1);
              dragX.current = 0;
            }}
          >
            <AnimatePresence mode="wait">
              <motion.figure
                key={index}
                className="flex h-full w-full max-w-2xl flex-col items-center justify-center gap-5"
                initial={{ opacity: 0, scale: 0.97, y: 14 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.99, y: -10 }}
                transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
              >
                <PhotoPlaceholder
                  src={active.image}
                  alt={active.caption}
                  eager
                  tone="night"
                  radius={2}
                  className="min-h-0 w-full max-w-full"
                  style={{ aspectRatio: "4 / 5", maxHeight: "100%" }}
                />
                <figcaption className="shrink-0 px-2 text-center">
                  <p className="font-display text-lg leading-snug text-porcelain sm:text-xl">
                    {active.caption}
                  </p>
                  <p className="eyebrow mt-3 text-brass-light/70">
                    {active.date}
                  </p>
                </figcaption>
              </motion.figure>
            </AnimatePresence>
          </div>

          {/* ── Controls ── */}
          <div className="flex shrink-0 items-center justify-between gap-3 px-4 py-5 sm:px-8 sm:py-8">
            <NavButton direction="prev" onClick={() => go(-1)} label={labels.previous} />
            <div className="flex items-center gap-1.5">
              {memories.map((memory, dotIndex) => (
                <button
                  key={memory.image}
                  type="button"
                  onClick={() => onNavigate(dotIndex)}
                  aria-label={`Photo ${dotIndex + 1}: ${memory.caption}`}
                  aria-current={dotIndex === index}
                  className="focus-inset grid h-9 w-4 place-items-center"
                >
                  <span
                    className={`block h-px w-full transition-all duration-500 ${
                      dotIndex === index
                        ? "bg-porcelain"
                        : "bg-porcelain/25 hover:bg-porcelain/50"
                    }`}
                  />
                </button>
              ))}
            </div>
            <NavButton direction="next" onClick={() => go(1)} label={labels.next} />
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

function NavButton({
  direction,
  onClick,
  label,
}: {
  direction: "prev" | "next";
  onClick: () => void;
  label: string;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={label}
      className="focus-inset grid h-12 w-12 shrink-0 place-items-center rounded-full
        border border-porcelain/20 text-porcelain/80 transition-all duration-300
        hover:border-porcelain/50 hover:bg-porcelain/10 active:scale-95"
    >
      <svg
        viewBox="0 0 24 24"
        className={`h-4 w-4 ${direction === "prev" ? "rotate-180" : ""}`}
        fill="none"
        stroke="currentColor"
        strokeWidth="1.4"
        aria-hidden="true"
      >
        <path d="M4 12h15M13 6l6 6-6 6" />
      </svg>
    </button>
  );
}
