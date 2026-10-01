/** The spine of the experience.
 *
 *  Each chapter is a scroll beat with its own visual register, so the
 *  page reads like one evening moving from light to dark and back.
 *  `tone` drives the section's background; the nav uses `label`. */

export type ChapterTone = "light" | "linen" | "blush" | "night";

export interface Chapter {
  /** Matches the `id` on the section element. */
  id: string;
  /** Roman numeral shown in the nav rail. */
  numeral: string;
  /** Short label for the nav and the scroll cue. */
  label: string;
  tone: ChapterTone;
}

export const chapters: Chapter[] = [
  { id: "opening", numeral: "I", label: "The Day", tone: "light" },
  { id: "moments", numeral: "II", label: "Moments", tone: "linen" },
  { id: "reasons", numeral: "III", label: "Reasons", tone: "blush" },
  { id: "frames", numeral: "IV", label: "Frames", tone: "light" },
  { id: "wish", numeral: "V", label: "The Wish", tone: "night" },
  { id: "ahead", numeral: "VI", label: "Ahead", tone: "light" },
  { id: "letter", numeral: "VII", label: "The Letter", tone: "night" },
  { id: "capsule", numeral: "VIII", label: "Capsule", tone: "blush" },
  { id: "secret", numeral: "IX", label: "A Secret", tone: "linen" },
  { id: "birthday", numeral: "X", label: "Happy Birthday", tone: "night" },
];

export const chapterById = new Map(chapters.map((c) => [c.id, c]));

/** Stable identity list — a module constant so effects that depend on
 *  it don't re-run on every render. */
export const chapterIds: string[] = chapters.map((c) => c.id);

/** Tailwind-friendly background for a given tone. Kept here so the
 *  palette for section surfaces lives in one place. */
export const toneBackground: Record<ChapterTone, string> = {
  light: "var(--color-porcelain)",
  linen: "var(--color-linen)",
  blush: "var(--color-blush)",
  night: "var(--color-ink)",
};
