/**
 * ═══════════════════════════════════════════════════════════════
 *  BIRTHDAY KEEPSAKE BOOK — CONTENT
 * ═══════════════════════════════════════════════════════════════
 *
 * This is the single source of truth for everything personal.
 * Every name, photo path, quote, wish line and letter paragraph lives
 * here. Nothing in the UI hard-codes content, so this file is the
 * only thing you need to edit to customize the entire experience.
 *
 * ── Editing notes ───────────────────────────────────────────
 *  · herName / nickname    → who this is for ("Potti")
 *  · timelineMoments       → drop real images into `client/public/photos/`
 *                            using the exact filenames below. Until then,
 *                            each frame renders an elegant placeholder.
 *  · quotes & lines        → change any quotes/lines to your own words.
 *  · letter                → the handwritten letter inside the envelope.
 */

export interface TimelineMoment {
  date: string;
  title: string;
  description: string;
  image: string;
  tag: string;
}

export const config = {
  /** Her name — prominently displayed throughout the keepsake. */
  herName: "Potti",

  /** Nickname or pet name. */
  nickname: "Potti",

  // ─────────────────────────────────────────────
  // THE CURTAIN & ARRIVAL
  // ─────────────────────────────────────────────
  intro: {
    firstLine: "Hey, Potti…",
    secondLine: "A handmade keepsake, bound just for you.",
    prompt: "Drag up to open the curtain",
    dragHint: "Pull up to open",
    keyboardPrompt: "Press Space, Enter, or ↑ to open",
    /** Rotating honest status captions while fonts and assets warm up */
    loadingCues: [
      "Setting the table…",
      "Choosing the right words…",
      "Pressing flowers into pages…",
      "Lighting the candles…",
    ],
  },

  // ─────────────────────────────────────────────
  // THE HERO — Keepsake opening
  // ─────────────────────────────────────────────
  hero: {
    eyebrow: "A birthday keepsake, bound by hand",
    subtitle:
      "A tribute to the smartest, kindest, and most extraordinary soul. Move across the page — every detail leans in to celebrate you.",
    scrollCue: "Turn the page ↓",
  },

  // ─────────────────────────────────────────────
  // THE GALLERY — The visual star of the middle
  // ─────────────────────────────────────────────
  gallery: {
    eyebrow: "Captured in time",
    title: "Pages from our favourite days.",
    lede: "Every photograph is a pressed leaf between the pages — a doorway back to moments I never want to forget.",
    hint: "Tap any photograph to inspect the print",
    /**
     * Three warm, timeless quotes displayed beneath the photo prints.
     */
    quotes: [
      "In all the world, there is no heart for me like yours. In all the world, there is no love for you like mine.",
      "The best thing to hold onto in life is each other.",
      "You make every ordinary moment feel like poetry.",
    ],
    /**
     * Two quiet, heartfelt lines beneath the quotes.
     */
    lines: [
      "Looking at these memories, I am reminded that the sweetest times are simply the ones spent in your presence.",
      "Decades from now, through every season and twist of fate, these will forever be the days I hold closest to my heart.",
    ],
    /** Signoff beneath the photo collection. */
    signoff: "— with all my love, today and every day after",
    closeLabel: "Close",
    prevLabel: "Previous photo",
    nextLabel: "Next photo",
  },

  // ─────────────────────────────────────────────
  // THE WISH — The candlelit ritual
  // ─────────────────────────────────────────────
  wish: {
    eyebrow: "A ritual for the year ahead",
    title: "Make a wish.\nBlow out the candles.",
    lede: "Hold the flame until the circle closes — or blow out each candle one by one.",
    holdLabel: "Hold to send your wish",
    holdingLabel: "Holding your wish…",
    blown: "May every quiet wish come true.",
    blownBody:
      "Your wish is out in the stars now. May this upcoming year bring you boundless happiness, peace of mind, unshakeable confidence, and all the quiet dreams you keep in your heart.",
    again: "Light them again",
  },

  // ─────────────────────────────────────────────
  // THE LETTER — The envelope & handwritten note
  // ─────────────────────────────────────────────
  letterSection: {
    eyebrow: "Words kept in ink",
    title: "A letter for your birthday.",
    lede: "Folded carefully, sealed with wax, and written solely for you.",
    sealedFor: "For",
    openLabel: "Break the seal & unfold",
    reseal: "Fold the letter back up",
  },

  letter: {
    salutation: "Dearest Potti,",
    bodyParagraphs: [
      "Another year wiser, bolder, and more luminous. Taking a moment to look back at everything you are and everything you have navigated this past year fills me with immense admiration.",
      "You possess a rare brilliance — a sharp, curious intellect paired with a genuinely kind, empathetic heart. Whether you are tackling ambitious challenges or sharing late-night laughter, your presence brings warmth, clarity, and infectious energy to everyone around you.",
      "As you turn this page and step into your next chapter, my wish for you is boundless joy. I hope this year rewards your hard work, surrounds you with deep peace, and brings you adventures that make your soul smile.",
      "I am deeply proud of who you are, tremendously lucky to know you, and always standing in your corner cheering you on through every triumph.",
    ],
    signoff: "Always cheering for you & holding you dear,",
    signature: "With all my love & respect",
  },

  // ─────────────────────────────────────────────
  // THE FINALE — Closing celebration
  // ─────────────────────────────────────────────
  finale: {
    eyebrow: "The final page, for now",
    title: "Happy Birthday,",
    closing:
      "Thank you for being the sweetest melody in every memory and the brightest light in every room. Here is to celebrating you today, tomorrow, and across every chapter yet to come.",
    replay: "Return to the beginning",
  },

  // ─────────────────────────────────────────────
  // TIMELINE MOMENTS — The 4 photo slots
  // ─────────────────────────────────────────────
  timelineMoments: [
    {
      date: "Our first hello",
      title: "Where the story began",
      description:
        "The very moment our paths crossed — witty, brilliant, and completely unforgettable from day one.",
      image: "/photos/how-we-met.jpg",
      tag: "Chapter I",
    },
    {
      date: "Unfiltered laughter",
      title: "Adventures & quiet drives",
      description:
        "Singing along off-key, taking scenic detours, and finding pure comfort in just being together.",
      image: "/photos/first-date.jpg",
      tag: "Chapter II",
    },
    {
      date: "Pure pride",
      title: "Watching you conquer",
      description:
        "Seeing your drive, your sharp intellect, and the graceful strength you bring to everything you set your mind to.",
      image: "/photos/when-i-knew.jpg",
      tag: "Chapter III",
    },
    {
      date: "Today & tomorrow",
      title: "The pages ahead",
      description:
        "Celebrating the wonderful person you are today, and eagerly anticipating all the magic the next year holds for you.",
      image: "/photos/today.jpg",
      tag: "Chapter IV",
    },
  ] satisfies TimelineMoment[],
};

/** Everything the app reads, in one type. */
export type BirthdayConfig = typeof config;

/** All photos on the page, for preloading. */
export const allPhotoPaths: string[] = [
  ...config.timelineMoments.map((m) => m.image),
];
