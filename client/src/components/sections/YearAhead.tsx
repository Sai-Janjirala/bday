/**
 * YearAhead — four things coming up, laid out as a horizon.
 *
 * The old version was another 2×2 grid of icon cards, and the page had
 * already had three of those. This is a line with four markers on it,
 * like a year seen from the side: on wide screens the entries
 * alternate above and below the rule so the eye has to travel, and the
 * rule itself inks in as she scrolls.
 *
 * Each wish starts closed  just its glyph, number and title pinned on
 * the line. A tap opens the promise underneath, so the section turns
 * from something read into something softly explored.
 *
 * The `icon` emoji in the content file are intentionally not rendered —
 * they clash with the line-art everywhere else. Each wish gets a drawn
 * glyph instead, matched by position. The config value is left intact
 * so nothing is lost if you would rather use it.
 */
import { useState } from "react";
import {
  motion,
  AnimatePresence,
  useReducedMotion,
  useScroll,
  useSpring,
  useTransform,
} from "framer-motion";
import { config } from "../../config/content";
import SectionShell from "../ui/SectionShell";
import Flowers from "../ui/Flowers";

const EASE = [0.16, 1, 0.3, 1] as const;

export default function YearAhead() {
  const reduced = useReducedMotion();
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const { scrollYProgress } = useScroll({
    target: useRefRef(),
    offset: ["start 80%", "end 72%"],
  });
  const raw = useSpring(scrollYProgress, { stiffness: 80, damping: 26, restDelta: 0.001 });
  const scaleX = useTransform(raw, [0, 1], [0, 1]);

  return (
    <SectionShell
      id="ahead"
      tone="light"
      eyebrow={config.yearAheadSection.eyebrow}
      title={config.yearAheadSection.title}
      lede={config.yearAheadSection.lede}
      spacing="tall"
    >
      <Flowers variant="sprig" className="-right-10 -top-8 w-40 opacity-50 sm:w-48" />
      <Flowers variant="blossom" className="-bottom-12 -left-10 w-44 opacity-40 sm:w-52" />

      <ol
        className="relative mt-4 space-y-12 lg:mt-10 lg:grid lg:grid-cols-4 lg:gap-6 lg:space-y-0"
        ref={scrollTargetRef}
      >
        {/* ── The rule: vertical on mobile, horizontal on wide screens ── */}
        <div
          aria-hidden="true"
          className="absolute top-0 bottom-0 left-[7px] w-px bg-ink-text/10 lg:inset-x-0 lg:top-1/2 lg:right-auto lg:bottom-auto lg:h-px lg:w-full"
        >
          <motion.div
            className="h-full w-full origin-top bg-gradient-to-b from-rose to-brass lg:origin-left lg:bg-gradient-to-r lg:from-rose lg:via-rose lg:to-brass"
            style={{ scaleX: reduced ? 1 : scaleX }}
          />
        </div>

        {config.yearAhead.map((wish, index) => {
          const open = openIndex === index;
          return (
            <li
              key={wish.title}
              className={`relative pl-10 lg:flex lg:min-h-[26rem] lg:flex-col lg:pl-0 ${
                index % 2 === 0
                  ? "lg:justify-end lg:pb-[7.5rem]"
                  : "lg:justify-start lg:pt-[7.5rem]"
              }`}
            >
              <motion.button
                type="button"
                onClick={() => setOpenIndex(open ? null : index)}
                aria-expanded={open}
                aria-controls={`wish-${index}`}
                className="focus-inset block w-full max-w-[20rem] text-left"
                initial={{ opacity: 0, y: reduced ? 0 : 28 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.4 }}
                transition={{ duration: 0.85, delay: 0.06 * index, ease: EASE }}
                whileHover={reduced ? undefined : { y: -3 }}
                whileTap={reduced ? undefined : { scale: 0.985 }}
              >
                <Glyph index={index} open={open} />

                <span className="mt-5 flex items-center gap-2">
                  <span className="eyebrow text-muted-light">
                    {String(index + 1).padStart(2, "0")}
                  </span>
                  <span
                    aria-hidden="true"
                    className={`inline-block h-px w-6 transition-colors duration-500 ${
                      open ? "bg-rose/60" : "bg-ink-text/15"
                    }`}
                  />
                  <motion.span
                    aria-hidden="true"
                    className="font-serif text-sm text-rose"
                    animate={open ? { rotate: 45 } : { rotate: 0 }}
                    transition={{ duration: 0.4, ease: EASE }}
                  >
                    +
                  </motion.span>
                </span>

                <h3 className="mt-2 font-display text-[clamp(1.375rem,1.1rem+1.1vw,1.875rem)] leading-[1.15] text-balance text-ink-text">
                  {wish.title}
                </h3>

                <AnimatePresence initial={false}>
                  {open && (
                    <motion.div
                      id={`wish-${index}`}
                      key="description"
                      className="overflow-hidden"
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.5, ease: EASE }}
                    >
                      <p className="pt-3 text-[0.875rem] leading-[1.7] text-pretty text-muted">
                        {wish.description}
                      </p>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.button>

              {/* ── Marker on the line ── */}
              <motion.span
                aria-hidden="true"
                className="absolute top-0 left-0 block h-[15px] w-[15px] rounded-full bg-porcelain ring-1 ring-rose/50 lg:top-1/2 lg:left-1/2 lg:h-3 lg:w-3 lg:translate-x-[-50%] lg:translate-y-[-50%] lg:bg-porcelain lg:ring-brass/70"
                initial={{ scale: 0 }}
                whileInView={{ scale: 1 }}
                viewport={{ once: true, amount: 0.3 }}
                transition={{ duration: 0.55, delay: 0.15 + 0.06 * index, ease: EASE }}
              />
            </li>
          );
        })}
      </ol>

      <motion.p
        className="mt-12 text-center text-[0.625rem] tracking-[0.2em] text-muted-light uppercase"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 1, delay: 0.4 }}
      >
        Tap a wish to open it
      </motion.p>
    </SectionShell>
  );
}

/** A stable ref object for the scroll target  aliased so no hook moves. */
function useRefRef() {
  return scrollTargetRef;
}
const scrollTargetRef = { current: null as HTMLOListElement | null };

/** Hand-drawn-feeling line glyphs, one per wish. */
function Glyph({ index, open }: { index: number; open: boolean }) {
  const common = {
    width: 34,
    height: 34,
    viewBox: "0 0 32 32",
    fill: "none",
    stroke: "var(--color-rose)",
    strokeWidth: 1.1,
    strokeLinecap: "round" as const,
    strokeLinejoin: "round" as const,
    "aria-hidden": true,
  };

  return (
    <motion.svg
      {...common}
      animate={open ? { rotate: -6, scale: 1.08 } : { rotate: 0, scale: 1 }}
      transition={{ duration: 0.4, ease: EASE }}
    >
      {index === 0 && (
        <>
          <circle cx="14" cy="18" r="9" />
          <circle cx="14" cy="18" r="4.5" />
          <path d="M14 18 27 5M27 5h-6M27 5v6" />
        </>
      )}
      {index === 1 && (
        <>
          <path d="M27 5 5 13.5 13 18l4.5 8L27 5Z" />
          <path d="M13 18 27 5" />
          <path d="M4 29c3.5-2 6-2 9 0" strokeDasharray="2 3" />
        </>
      )}
      {index === 2 && (
        <>
          <path d="M16 29V14" />
          <path d="M16 16C16 9 11 5 5 4c0 7 4 12 11 12Z" />
          <path d="M16 21c0-6 4-9 10-10 0 6-4 10-10 10Z" />
        </>
      )}
      {index === 3 && (
        <>
          <path d="M4 6h8l-1.5 9a3 3 0 0 1-5 0L4 6Z" />
          <path d="M20 6h8l-1.5 9a3 3 0 0 1-5 0L20 6Z" />
          <path d="M12 6c0 8 2 13 4 15 2-2 4-7 4-15" />
          <path d="M12 21h8M16 21v5M12 26h8" />
        </>
      )}
    </motion.svg>
  );
}