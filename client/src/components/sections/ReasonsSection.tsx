/**
 * ReasonsSection — the eight reasons, read one at a time.
 *
 * The old version was a four-column grid of eight identical cards with
 * filter pills above it, which is the exact shape of every list on the
 * internet. This is an index instead: the badges run down one side
 * like the contents of a book, and choosing one opens that reason
 * full-width, large, and on its own. Nothing is on screen at once
 * except the thing she is reading.
 *
 * Implemented as a real tablist so it is keyboard-navigable.
 */
import { useRef, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { config } from "../../config/content";
import SectionShell from "../ui/SectionShell";
import Flowers from "../ui/Flowers";

export default function ReasonsSection() {
  const reduced = useReducedMotion();
  const [active, setActive] = useState(0);
  const tabRefs = useRef<(HTMLButtonElement | null)[]>([]);

  const trait = config.traits[active];

  const move = (delta: number) => {
    const next = (active + delta + config.traits.length) % config.traits.length;
    setActive(next);
    tabRefs.current[next]?.focus();
  };

  const onKeyDown = (event: React.KeyboardEvent) => {
    if (event.key === "ArrowDown" || event.key === "ArrowRight") {
      event.preventDefault();
      move(1);
    } else if (event.key === "ArrowUp" || event.key === "ArrowLeft") {
      event.preventDefault();
      move(-1);
    } else if (event.key === "Home") {
      event.preventDefault();
      setActive(0);
      tabRefs.current[0]?.focus();
    } else if (event.key === "End") {
      event.preventDefault();
      const last = config.traits.length - 1;
      setActive(last);
      tabRefs.current[last]?.focus();
    }
  };

  return (
    <SectionShell
      id="reasons"
      tone="blush"
      eyebrow={config.reasons.eyebrow}
      title={config.reasons.title}
      lede={config.reasons.lede}
      spacing="tall"
    >
      <Flowers variant="cluster" className="-top-6 -right-10 w-44 opacity-50 sm:w-56" />
      <Flowers variant="rose" className="-bottom-10 -left-12 w-44 opacity-40 sm:w-52" />

      <div className="mt-4 grid gap-8 lg:mt-10 lg:grid-cols-[minmax(0,17rem)_minmax(0,1fr)] lg:gap-14 xl:grid-cols-[minmax(0,19rem)_minmax(0,1fr)]">
        {/* ── The index ── */}
        <div
          role="tablist"
          aria-label="Reasons"
          aria-orientation="vertical"
          onKeyDown={onKeyDown}
          className="-mx-5 flex snap-x snap-mandatory gap-2 overflow-x-auto px-5 pb-3 lg:mx-0 lg:flex-col lg:gap-0 lg:overflow-visible lg:px-0 lg:pb-0"
          style={{ scrollbarWidth: "none" }}
        >
          {config.traits.map((item, index) => {
            const isActive = index === active;
            return (
              <button
                key={item.badge}
                ref={(node) => {
                  tabRefs.current[index] = node;
                }}
                role="tab"
                id={`reason-tab-${index}`}
                aria-selected={isActive}
                aria-controls={`reason-panel-${index}`}
                tabIndex={isActive ? 0 : -1}
                onClick={() => setActive(index)}
                className={`focus-inset group relative flex min-h-11 shrink-0 snap-start cursor-pointer items-center gap-3 rounded-full px-4 transition-colors duration-500 lg:w-full lg:rounded-none lg:px-0 lg:py-3 ${
                  isActive ? "text-ink-text" : "text-muted hover:text-ink-text/80"
                }`}
              >
                {/* Rule draws across the active entry. */}
                <span
                  aria-hidden="true"
                  className={`absolute inset-x-0 bottom-0 h-px origin-left bg-ink-text/25 transition-transform duration-500 ${
                    isActive ? "scale-x-100" : "scale-x-0"
                  }`}
                />
                <span
                  className={`font-display text-xs tabular-nums transition-colors duration-500 ${
                    isActive ? "text-rose" : "text-muted-light/60"
                  }`}
                >
                  {String(index + 1).padStart(2, "0")}
                </span>
                <span
                  className={`text-[0.8125rem] tracking-[0.12em] whitespace-nowrap uppercase transition-colors duration-500 lg:whitespace-normal ${
                    isActive ? "font-medium" : ""
                  }`}
                >
                  {item.badge}
                </span>
              </button>
            );
          })}
        </div>

        {/* ── The open reason ── */}
        <div className="relative min-h-[19rem] sm:min-h-[16rem] lg:min-h-[22rem]">
          {/* Oversized ghost numeral, behind the text. */}
          <span
            aria-hidden="true"
            className="pointer-events-none absolute -top-6 -right-2 font-display text-[7rem] leading-none text-ink-text/[0.05] select-none sm:text-[10rem]"
          >
            {String(active + 1).padStart(2, "0")}
          </span>

          <AnimatePresence mode="wait">
            <motion.article
              key={trait.title}
              role="tabpanel"
              id={`reason-panel-${active}`}
              aria-labelledby={`reason-tab-${active}`}
              tabIndex={0}
              className="relative focus-visible:outline-none"
              initial={{ opacity: 0, y: reduced ? 0 : 18, filter: "blur(8px)" }}
              animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
              exit={{ opacity: 0, y: reduced ? 0 : -14, filter: "blur(6px)" }}
              transition={{ duration: 0.55, ease: [0.16, 1, 0.3, 1] }}
            >
              <p className="eyebrow mb-5 text-rose">{trait.badge}</p>
              <h3 className="max-w-2xl font-display text-[clamp(1.9rem,1.3rem+2.6vw,3.25rem)] leading-[1.06] text-balance text-ink-text">
                {trait.title}
              </h3>
              <p className="mt-6 max-w-xl text-[0.9375rem] leading-[1.8] text-pretty text-muted sm:text-base">
                {trait.desc}
              </p>
            </motion.article>
          </AnimatePresence>

          {/* ── Prev / next ── */}
          <div className="mt-10 flex items-center gap-4 lg:mt-14">
            <StepButton
              onClick={() => move(-1)}
              direction="prev"
              label={`Previous ${config.reasons.counterLabel}`}
            />
            <span className="font-display text-sm text-muted-light tabular-nums">
              {String(active + 1).padStart(2, "0")}
              <span className="mx-1.5 text-muted-light/50">—</span>
              {String(config.traits.length).padStart(2, "0")}
            </span>
            <StepButton
              onClick={() => move(1)}
              direction="next"
              label={`Next ${config.reasons.counterLabel}`}
            />
          </div>
        </div>
      </div>
    </SectionShell>
  );
}

function StepButton({
  onClick,
  direction,
  label,
}: {
  onClick: () => void;
  direction: "prev" | "next";
  label: string;
}) {
  const reduced = useReducedMotion();
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={label}
      className="focus-inset group grid h-12 w-12 cursor-pointer place-items-center rounded-full border border-ink-text/15 text-ink-text/70 transition-all duration-400 hover:border-rose/50 hover:bg-rose/[0.05] hover:text-ink-text active:scale-95"
    >
      <svg
        viewBox="0 0 24 24"
        aria-hidden="true"
        className={`h-4 w-4 transition-transform duration-400 ${
          direction === "prev"
            ? "rotate-180 group-hover:-translate-x-0.5"
            : "group-hover:translate-x-0.5"
        } ${reduced ? "" : ""}`}
        fill="none"
        stroke="currentColor"
        strokeWidth="1.4"
      >
        <path d="M4 12h15M13 6l6 6-6 6" />
      </svg>
    </button>
  );
}
