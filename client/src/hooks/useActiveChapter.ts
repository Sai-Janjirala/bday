import { useEffect, useState } from "react";

/** Tracks which chapter is currently under the reader's eyes.
 *
 *  Uses one IntersectionObserver with a horizontal band across the
 *  middle of the viewport rather than per-section scroll maths, so
 *  the cost is a single callback and no layout thrash while scrolling. */
export function useActiveChapter(ids: string[], enabled = true): string {
  const [activeId, setActiveId] = useState(ids[0] ?? "");

  useEffect(() => {
    if (!enabled || ids.length === 0) return;

    const elements = ids
      .map((id) => document.getElementById(id))
      .filter((el): el is HTMLElement => el !== null);

    if (elements.length === 0) return;

    const visible = new Map<string, number>();

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            visible.set(entry.target.id, entry.intersectionRatio);
          } else {
            visible.delete(entry.target.id);
          }
        }

        if (visible.size === 0) {
          // Between sections (or past the last one) — fall back to the
          // nearest preceding chapter so the rail never goes blank.
          const scrolled = window.scrollY + window.innerHeight * 0.4;
          let nearest = ids[0];
          for (const id of ids) {
            const el = document.getElementById(id);
            if (el && el.offsetTop <= scrolled) nearest = id;
          }
          setActiveId(nearest);
          return;
        }

        let best = ids[0];
        let bestRatio = -1;
        for (const [id, ratio] of visible) {
          if (ratio > bestRatio) {
            bestRatio = ratio;
            best = id;
          }
        }
        setActiveId(best);
      },
      {
        // A narrow band around the vertical centre of the screen.
        rootMargin: "-45% 0px -45% 0px",
        threshold: [0, 0.25, 0.5, 0.75, 1],
      },
    );

    for (const el of elements) observer.observe(el);
    return () => observer.disconnect();
  }, [ids, enabled]);

  return activeId;
}
