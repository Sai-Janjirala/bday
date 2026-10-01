/**
 * ChapterNav — the spine of the experience, made navigable.
 *
 * Two presentations of one idea. On wide screens a vertical rail down
 * the left margin, with the active section's label revealed on hover.
 * On small screens a slim strip under the progress hairline where the
 * sections are tappable ticks.
 *
 * It only exists once the story has started, so the opening screen is
 * never crowded by furniture.
 */
import { motion, useReducedMotion } from "framer-motion";
import { chapters } from "../../lib/chapters";

interface ChapterNavProps {
  activeId: string;
  visible: boolean;
}

export default function ChapterNav({ activeId, visible }: ChapterNavProps) {
  const reduced = useReducedMotion();
  const activeIndex = chapters.findIndex((c) => c.id === activeId);

  const go = (id: string) => {
    document.getElementById(id)?.scrollIntoView({
      behavior: reduced ? "auto" : "smooth",
      block: "start",
    });
  };

  return (
    <>
      {/* ── Wide screens: vertical rail ── */}
      <motion.nav
        aria-label="Sections"
        className="pointer-events-none fixed left-0 top-1/2 z-[60] hidden -translate-y-1/2 pl-5 lg:block xl:pl-7"
        initial={{ opacity: 0, x: -12 }}
        animate={visible ? { opacity: 1, x: 0 } : { opacity: 0, x: -12 }}
        transition={{ duration: 0.8, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
      >
        <ul className="pointer-events-auto flex flex-col items-start gap-1">
          {chapters.map((chapter, index) => {
            const isActive = chapter.id === activeId;
            const isPast = index < activeIndex;
            return (
              <li key={chapter.id}>
                <button
                  type="button"
                  onClick={() => go(chapter.id)}
                  aria-current={isActive ? "true" : undefined}
                  className="focus-inset group flex min-h-9 items-center gap-3 rounded-full py-1.5 pr-3 pl-1 text-left"
                >
                  {/* Tick */}
                  <span
                    aria-hidden="true"
                    className={`block h-px transition-all duration-500 ${
                      isActive
                        ? "w-7 bg-rose"
                        : isPast
                          ? "w-4 bg-ink-text/25"
                          : "w-2.5 bg-ink-text/15 group-hover:w-4 group-hover:bg-ink-text/35"
                    }`}
                  />
                  <span
                    className={`max-w-0 overflow-hidden text-[0.625rem] font-medium tracking-[0.16em] whitespace-nowrap uppercase transition-all duration-500 ${
                      isActive
                        ? "max-w-[9rem] text-ink-text/70 opacity-100"
                        : "text-ink-text/50 opacity-0 group-hover:max-w-[9rem] group-hover:opacity-100 group-focus-visible:max-w-[9rem] group-focus-visible:opacity-100"
                    }`}
                  >
                    {chapter.label}
                  </span>
                </button>
              </li>
            );
          })}
        </ul>
      </motion.nav>

      {/* ── Small screens: tappable ticks under the hairline ── */}
      <motion.div
        aria-label="Sections"
        className="fixed inset-x-0 top-px z-[60] flex justify-center gap-1.5 px-4 pt-2 lg:hidden"
        initial={{ opacity: 0, y: -8 }}
        animate={visible ? { opacity: 1, y: 0 } : { opacity: 0, y: -8 }}
        transition={{ duration: 0.7, delay: 0.3 }}
      >
        {chapters.map((chapter, index) => {
          const isActive = chapter.id === activeId;
          return (
            <button
              key={chapter.id}
              type="button"
              onClick={() => go(chapter.id)}
              aria-label={chapter.label}
              aria-current={isActive ? "true" : undefined}
              className="focus-inset group grid h-8 min-w-6 flex-1 place-items-center"
            >
              <span
                className={`block rounded-full transition-all duration-500 ${
                  isActive
                    ? "h-[3px] w-5 bg-rose"
                    : index < activeIndex
                      ? "h-[3px] w-2.5 bg-ink-text/25"
                      : "h-[3px] w-2 bg-ink-text/12 group-active:bg-ink-text/30"
                }`}
              />
            </button>
          );
        })}
      </motion.div>
    </>
  );
}
