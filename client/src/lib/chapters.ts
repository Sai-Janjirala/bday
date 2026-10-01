/** The spine of the experience.
 *
 *  Each beat is a scroll section with its own visual register, so the
 *  page reads like one evening moving from light to dark and back.
 *  `tone` drives the section's background; the nav uses `label`. */

export type ChapterTone = "light" | "linen" | "blush" | "night";

export interface Chapter {
  /** Matches the `id` on the section element. */
  id: string;
  /** Short label for the nav. */
  label: string;
  tone: ChapterTone;
}

export const chapters: Chapter[] = [
  { id: "opening", label: "The Day", tone: "light" },
  { id: "reasons", label: "Reasons", tone: "blush" },
  { id: "photos", label: "Photos", tone: "light" },
  { id: "wish", label: "The Wish", tone: "night" },
  { id: "ahead", label: "Ahead", tone: "light" },
  { id: "letter", label: "The Letter", tone: "night" },
  { id: "capsule", label: "Capsule", tone: "blush" },
  { id: "secret", label: "A Secret", tone: "linen" },
  { id: "birthday", label: "Happy Birthday", tone: "night" },
];

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