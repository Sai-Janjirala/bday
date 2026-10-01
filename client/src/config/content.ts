/**
 * ═══════════════════════════════════════════════════════════════
 *  BIRTHDAY EXPERIENCE — CONTENT
 * ═══════════════════════════════════════════════════════════════
 *
 * This is the single source of truth for everything personal.
 * Every name, photo path, memory, trait, voucher and line of the
 * letter lives here. Nothing in the UI hard-codes content, so
 * this file is the only thing you need to edit to make the
 * experience yours.
 *
 * ── Editing notes ───────────────────────────────────────────
 *  · herName / nickname    → who this is for
 *  · birthday              → set month + day (1-based) to switch on
 *                            the live countdown in the hero.
 *                            Leave 0 to keep it off.
 *  · photos                → drop real images into
 *                            `client/public/photos/` using the exact
 *                            filenames below. Until then each frame
 *                            renders an elegant, clearly-labelled
 *                            placeholder that names the file, so you
 *                            always know which slot is still empty.
 *  · music.src             → optional. Point it at an mp3 to play
 *                            your song. Leave it null and the site
 *                            plays a soft generated ambient pad
 *                            instead. Either way, nothing ever
 *                            autoplays.
 */

export interface Memory {
  image: string;
  caption: string;
  date: string;
  tag: string;
}

export interface TimelineMoment {
  date: string;
  title: string;
  description: string;
  image: string;
  tag: string;
}

export interface Trait {
  title: string;
  desc: string;
  badge: string;
}

export interface YearAheadWish {
  icon: string;
  title: string;
  description: string;
}

export const config = {
  /** Her name — the most important value in this file. */
  herName: "Sarah",

  /** Nickname or pet name, if you have one. */
  nickname: "Birthday Girl",

  /** The chapter you're both currently in. */
  chapterTitle: "Chapter 24",

  /**
   * Her birthday. Set these to switch on the live countdown in the
   * hero ("X days until you turn another year older"). Months are
   * 1-based. Leave 0 to keep the countdown hidden — the hero still
   * works, it just shows the colophon instead.
   */
  birthday: {
    month: 0 as number,
    day: 0 as number,
  },

  /** The song. Optional — a real file, or the generated ambient pad. */
  music: {
    /** Shown on the toggle. */
    label: "Play our song",
    /** e.g. "/audio/our-song.mp3" — leave null for the ambient pad. */
    src: null as string | null,
  },

  // ─────────────────────────────────────────────
  // THE OPENING — the moment before the story starts
  // ─────────────────────────────────────────────
  intro: {
    firstLine: "Hey, you…",
    secondLine: "I made something for you.",
    aside:
      "It took a while. There's a whole evening in here — and one thing at the end I almost didn't write.",
    prompt: "Before you continue — promise me you'll stay till the end.",
    cta: "Begin the surprise",
    /** Shown while the first photos and fonts warm up. */
    preparing: "Getting everything ready",
  },

  // ─────────────────────────────────────────────
  // THE HERO — the birthday moment
  // ─────────────────────────────────────────────
  hero: {
    eyebrow: "A birthday, made by hand",
    /** Breaks the wax seal to reveal her name. */
    sealLabel: "Break the seal",
    subtitle:
      "A tribute to the smartest, kindest, and most extraordinary woman I know.",
    /** Shown on the colophon line under the countdown. */
    countdownPrefix: "Until you turn another year older",
    scrollCue: "Scroll, slowly",
  },

  // ─────────────────────────────────────────────
  // THE JOURNEY — memorable milestones
  // ─────────────────────────────────────────────
  timeline: {
    eyebrow: "The journey so far",
    title: "Some moments deserve to be remembered.",
    lede: "Not because they were loud — because they were ours.",
  },

  // ─────────────────────────────────────────────
  // REASONS — what makes her, her
  // ─────────────────────────────────────────────
  reasons: {
    eyebrow: "Things that make you, you",
    title: "Eight reasons I keep\ncoming back to this list.",
    lede: "Tap any of them. There's no wrong order.",
    counterLabel: "reason",
  },

  // ─────────────────────────────────────────────
  // THE GALLERY — the photos
  // ─────────────────────────────────────────────
  gallery: {
    eyebrow: "The good ones",
    title: "A few of my favourites.",
    lede: "Some of these are half out of focus. Those are my favourites.",
    hint: "Tap any photo to see it properly",
    /** How many photos to show in the strip (out of the six below). */
    count: 4,
    /**
     * The quote under the photos. Make it yours — this is the line
     * underneath the photographs.
     */
    quote:
      "Every photo here is a day I would happily live twice — the blurry ones especially.",
    closeLabel: "Close",
    prevLabel: "Previous photo",
    nextLabel: "Next photo",
  },

  // ─────────────────────────────────────────────
  // THE WISH — the interactive ritual
  // ─────────────────────────────────────────────
  wish: {
    eyebrow: "Make a wish",
    title: "Close your eyes.\nBlow out the candles.",
    lede: "Hold the button. Don't say it out loud.",
    holdLabel: "Hold to make a wish",
    holdingLabel: "Keep holding…",
    blown: "Wish received.",
    blownBody:
      "It's out of your hands now. Everything you quietly wanted this year — I'm hoping all of it comes true.",
    again: "Light them again",
  },

  // ─────────────────────────────────────────────
  // THE YEAR AHEAD
  // ─────────────────────────────────────────────
  yearAheadSection: {
    eyebrow: "The next chapter",
    title: "Here's to the year ahead.",
    lede: "Four things I'm rooting for, loudly.",
  },

  // ─────────────────────────────────────────────
  // THE LETTER
  // ─────────────────────────────────────────────
  letterSection: {
    eyebrow: "Okay — one last thing.",
    title: "I wrote you a letter.",
    lede: "I kept it short, and then rewrote it three times.",
    sealedFor: "For",
    openLabel: "Open the envelope",
    reseal: "Fold it back up",
  },

  // ─────────────────────────────────────────────
  // THE CAPSULE — her turn to write
  // ─────────────────────────────────────────────
  capsule: {
    eyebrow: "Your turn",
    title: "Write to yourself.",
    lede: "Say it now, read it next year. It'll mean more than you expect.",
  },

  // ─────────────────────────────────────────────
  // THE SECRET NOTE — the thing he wrote for her
  // ─────────────────────────────────────────────
  secretNote: {
    eyebrow: "A postscript",
    title: "Something I wrote, just for you.",
    lede: "The one thing I didn't know how to say out loud.",
    hint: "Rub it with your finger until it gives.",
    revealNow: "Reveal it for me",
    hide: "Hide it again",
    stamped: "Yours",
    /**
     * ⚠️ YOUR NOTE — paste the real thing over this sentence.
     * Use \n\n between paragraphs. This is the heart of the whole
     * site, so make it count.
     */
    note:
      "This is the placeholder note I typed while Sarah's person is deciding what to say. Just replace this paragraph in content.ts with the real words — nothing else needs to change.",
  },

  // ─────────────────────────────────────────────
  // THE END
  // ─────────────────────────────────────────────
  finale: {
    eyebrow: "And with that",
    title: "Happy Birthday,",
    closing:
      "Thank you for being the best part of every chapter so far. I hope this one is your favourite yet.",
    replay: "Read it again",
  },

  // ─────────────────────────────────────────────
  // THE JOURNEY — Memorable milestones & adventures
  // ─────────────────────────────────────────────
  timelineMoments: [
    {
      date: "The First Spark",
      title: "Where It All Began",
      description:
        "From the first conversation, it was obvious you operated on a completely different frequency. Witty, fiercely smart, and impossible to forget.",
      image: "/photos/how-we-met.jpg",
      tag: "The Beginning",
    },
    {
      date: "The Unplanned Road Trip",
      title: "Adventures & Bad Navigation",
      description:
        "Getting lost on backroads, playing our favorite albums on repeat, and realizing that anywhere with you instantly turns into the best story.",
      image: "/photos/first-date.jpg",
      tag: "Adventure",
    },
    {
      date: "Celebrating Big Wins",
      title: "Watching You Shine",
      description:
        "Seeing you pour your heart into your goals and knock them out of the park. Nobody works harder or deserves every ounce of success more than you do.",
      image: "/photos/when-i-knew.jpg",
      tag: "Milestone",
    },
  ] satisfies TimelineMoment[],

  // ─────────────────────────────────────────────
  // MEMORIES — Highlight Reel photo cards
  // ─────────────────────────────────────────────
  memories: [
    {
      image: "/photos/memory-1.jpg",
      caption: "Candid smiles and coffee runs that lasted hours",
      date: "Spring Memories",
      tag: "Candid",
    },
    {
      image: "/photos/memory-2.jpg",
      caption: "Catching the golden hour in the middle of nowhere",
      date: "Summer Escapes",
      tag: "Road Trip",
    },
    {
      image: "/photos/memory-3.jpg",
      caption: "When an inside joke had us laughing until we couldn't breathe",
      date: "Unfiltered Joy",
      tag: "Favorite",
    },
    {
      image: "/photos/memory-4.jpg",
      caption: "Dressed up for the night, commanding every room you enter",
      date: "Night Out",
      tag: "Iconic",
    },
    {
      image: "/photos/memory-5.jpg",
      caption: "The quiet moments — quiet Sunday mornings and peaceful talks",
      date: "Serenity",
      tag: "Peace",
    },
    {
      image: "/photos/memory-6.jpg",
      caption: "Another unforgettable adventure locked into the memory bank",
      date: "Best Days",
      tag: "Adventure",
    },
  ] satisfies Memory[],

  // ─────────────────────────────────────────────
  // WHAT MAKES YOU EXTRAORDINARY (Traits celebrating her)
  // ─────────────────────────────────────────────
  traits: [
    {
      title: "Relentless Ambition",
      desc: "When you set your mind on a goal, there is no stopping you. Your work ethic and focus inspire everyone around you.",
      badge: "Superpower",
    },
    {
      title: "Unrivaled Sense of Humor",
      desc: "Dry wit, lightning-fast banter, and that unmistakable laugh that immediately lights up the entire room.",
      badge: "Vibe",
    },
    {
      title: "Quiet Resilience",
      desc: "No matter how tough or chaotic things get, you handle adversity with unbelievable grace and composure.",
      badge: "Strength",
    },
    {
      title: "Deep & Genuine Empathy",
      desc: "The effortless way you make people feel heard, understood, and truly valued without ever asking for praise.",
      badge: "Heart",
    },
    {
      title: "Impeccable Taste",
      desc: "In music, design, food, and life in general. You just have that rare, natural eye for quality.",
      badge: "Aesthetic",
    },
    {
      title: "Fierce Loyalty",
      desc: "If you're in someone's corner, you stand with them unconditionally. Having you on my team is the greatest privilege.",
      badge: "Character",
    },
    {
      title: "The Ultimate Conversationalist",
      desc: "From ridiculous 2 AM theories to deep philosophical debates, talking with you is never boring.",
      badge: "Intellect",
    },
    {
      title: "Unapologetically Yourself",
      desc: "You own who you are with confidence and authenticity. It's magnetic and admirable.",
      badge: "Authenticity",
    },
  ] satisfies Trait[],

  // ─────────────────────────────────────────────
  // THE YEAR AHEAD — Dreams & Milestones
  // ─────────────────────────────────────────────
  yearAhead: [
    {
      icon: "🎯",
      title: "Crushing Big Career Milestones",
      description: "Stepping into higher heights and claiming the recognition you have worked so hard for.",
    },
    {
      icon: "✈️",
      title: "New Horizons & Stamp Passports",
      description: "Exploring new cities, tasting new foods, and making fresh stories across the globe.",
    },
    {
      icon: "🌿",
      title: "Peace, Health & Balance",
      description: "Prioritizing your well-being, slowing down to breathe, and enjoying every single season.",
    },
    {
      icon: "🥂",
      title: "Unforgettable Celebrations",
      description: "More toasts, more spontaneous late-night adventures, and celebrating every single win.",
    },
  ] satisfies YearAheadWish[],

  // ─────────────────────────────────────────────
  // THE BIRTHDAY LETTER — Mature, heartfelt, supportive
  // ─────────────────────────────────────────────
  letter: {
    salutation: "Happy Birthday,",
    bodyParagraphs: [
      "Another year wiser, bolder, and more accomplished. Watching you grow, evolve, and conquer your challenges over this past year has been nothing short of inspiring.",
      "You carry yourself with a rare combination of grit, intellect, and grace that commands respect everywhere you go. But what I admire most isn't just what you accomplish — it's the warmth, sincerity, and joy you bring to the people around you every single day.",
      "As you step into this new chapter, my wish for you is simple: I hope this year brings you the peace of mind you deserve, exciting opportunities that match your ambition, and countless moments that make you smile until your cheeks hurt.",
      "I am incredibly proud of who you are, deeply lucky to share life with you, and always in your corner cheering you on as you take on the world.",
    ],
    signoff: "Cheers to you and your best year yet,",
    signature: "With all my respect & love",
  },
};

/** Everything the app reads, in one type. */
export type BirthdayConfig = typeof config;

/** Photos referenced by the timeline and gallery, for preloading. */
export const allPhotoPaths: string[] = [
  ...config.timelineMoments.map((m) => m.image),
  ...config.memories.map((m) => m.image),
];
