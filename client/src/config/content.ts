/**
 * ═══════════════════════════════════════════════════════════════
 *  BIRTHDAY EXPERIENCE — CONTENT
 * ═══════════════════════════════════════════════════════════════
 *
 * This is the single source of truth for everything personal.
 * Every name, photo path, memory, trait and line of the letter lives
 * here. Nothing in the UI hard-codes content, so this file is the
 * only thing you need to edit to make the experience yours.
 *
 * ── Editing notes ───────────────────────────────────────────
 *  · herName / nickname    → who this is for
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
  herName: "Potti",

  /** Nickname or pet name, if you have one. */
  nickname: "Potti",

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
    subtitle:
      "A tribute to the smartest, kindest, and most extraordinary woman I know. Move your cursor — the whole page leans in to meet you.",
    scrollCue: "Scroll, slowly",
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
    eyebrow: "In every frame,",
    title: "A few of my favourites.",
    lede: "Half of them are slightly out of focus. Those are my favourites.",
    hint: "Tap any photo to see it properly",
    /**
     * A handful of nice quotes, shown beneath the photographs. Each
     * renders on its own line. Make them yours.
     */
    quotes: [
      "I love you not only for what you are, but for what I am when I am with you.",
      "There is no remedy for love, but to love more.",
      "You are my today and all of my tomorrows.",
    ],
    /** A few quiet personal lines right under the quotes. */
    lines: [
      "Whenever I look at any of these photographs, I smile before I even remember why.",
      "Thirty years from now, blurry or not — these will still be the days I'd relive.",
    ],
    /** The signed line underneath it all. */
    signoff: "— yours, today and always",
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
      "This is the placeholder note. Replace this whole paragraph in content.ts with the real words — nothing else needs to change.",
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
      date: "Our first hello",
      title: "Where it all began",
      description:
        "From the first conversation, it was obvious you operated on a completely different frequency. Witty, fiercely smart, and impossible to forget.",
      image: "/photos/how-we-met.jpg",
      tag: "The Beginning",
    },
    {
      date: "Lost, together",
      title: "Anywhere with you",
      description:
        "Getting lost on backroads, playing our favorite albums on repeat, and realizing that anywhere with you instantly turns into the best story.",
      image: "/photos/first-date.jpg",
      tag: "Adventure",
    },
    {
      date: "Proud of you",
      title: "Watching you shine",
      description:
        "Seeing you pour your heart into your goals and knock them out of the park. Nobody works harder or deserves every ounce of success more than you do.",
      image: "/photos/when-i-knew.jpg",
      tag: "Milestone",
    },
    {
      date: "Still being written",
      title: "And now — today",
      description:
        "And this one is still being written. Tonight, and everything good that's coming after it. My favourite part of you is always the next chapter of you.",
      image: "/photos/today.jpg",
      tag: "Today",
    },
  ] satisfies TimelineMoment[],

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

/** All photos on the page, for preloading. */
export const allPhotoPaths: string[] = [
  ...config.timelineMoments.map((m) => m.image),
];
