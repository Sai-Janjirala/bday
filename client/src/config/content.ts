/**
 * ═══════════════════════════════════════════════════════════════
 *  BIRTHDAY KEEPSAKE BOOK — CONTENT CONFIGURATION
 * ═══════════════════════════════════════════════════════════════
 *
 * ✏️ HOW TO CUSTOMIZE:
 * Edit the values below to personalize this experience!
 */

export interface TimelineMoment {
  date: string;
  title: string;
  description: string;
  backNote: string;
  image: string;
  tag: string;
}

export interface AppreciationCard {
  emoji: string;
  label: string;
  message: string;
  color: string;
}

export const config = {
  /**
   * 🌟 HER NAME
   */
  herName: "Potti",

  /**
   * 💖 NICKNAME
   */
  nickname: "Potti",

  // ─────────────────────────────────────────────
  // THE LANDING PAGE & ARRIVAL
  // ─────────────────────────────────────────────
  intro: {
    badge: "A Little Surprise For You",
    firstLine: "Hey, Potti…",
    secondLine: "Someone made this just for you. ✨",
    prompt: "Open your surprise",
    dragHint: "Pull up to open",
    tapHint: "Tap the seal to open",
    keyboardPrompt: "Press Space or Enter to open",
    sealText: "FOR YOU",
    /** Rotating status cues while fonts and photos warm up */
    loadingCues: [
      "Tying the ribbon with love…",
      "Pressing flowers into the pages…",
      "Lighting the candles…",
      "Almost ready for you…",
    ],
  },

  // ─────────────────────────────────────────────
  // CHAPTER 1 — THE DAY (Hero Opening)
  // ─────────────────────────────────────────────
  hero: {
    chapter: "Chapter I",
    eyebrow: "Today is your day",
    titlePrefix: "Happy Birthday,",
    subtitle:
      "Today isn't just another day — it's the day the world got a little brighter. This entire experience was made, crafted, and poured into just for you. Scroll slowly. ❤️",
    scrollCue: "Continue the story ↓",
    tagline: "Every story is better because you're in it.",
  },

  // ─────────────────────────────────────────────
  // CHAPTER 2 — THE GALLERY (Visual Star of the Middle)
  // ─────────────────────────────────────────────
  gallery: {
    chapter: "Chapter II",
    eyebrow: "Captured in time",
    title: "Our favourite moments.",
    lede: "Like pressed flowers kept between old pages — each memory is a treasure. Tap any photo to flip it and read the private note on the back.",
    hint: "Tap any print to flip or inspect",
    quotes: [
      "In all the world, there is no heart for me like yours.",
      "The best moments aren't planned — they're the ones spent laughing with you.",
      "You make every ordinary second feel like timeless poetry.",
    ],
    lines: [
      "Looking through these moments, I realize how much brighter the world has felt.",
      "These will always remain the memories I treasure most.",
    ],
    signoff: "— with all my love, today and every day after",
    closeLabel: "Close",
    prevLabel: "Previous photo",
    nextLabel: "Next photo",
  },

  // ─────────────────────────────────────────────
  // CHAPTER 3 — THE GOLDEN SCRATCH CARD (Secret Memory)
  // ─────────────────────────────────────────────
  secret: {
    chapter: "Chapter III",
    eyebrow: "A secret just for you",
    title: "Something hidden in gold.",
    lede: "Use your finger to scratch away the shimmering gold foil and reveal a private message, written just for you.",
    revealHint: "Rub with your finger to scratch away the gold",
    secretNote:
      "If I could give you one gift this year, it would be the ability to see yourself through my eyes — so you'd finally understand how truly brilliant, radiant, and deeply cherished you are. Every. Single. Day.",
    badge: "Private Message",
    revealedTitle: "Kept in heart & ink",
  },

  // ─────────────────────────────────────────────
  // CHAPTER 4 — WHY YOU'RE SPECIAL (Appreciation Cards)
  // ─────────────────────────────────────────────
  appreciation: {
    chapter: "Chapter IV",
    eyebrow: "The things I love about you",
    title: "What makes you, you.",
    lede: "Some things are impossible to put into words. But I tried. Tap each card to find out what I think.",
  },

  // ─────────────────────────────────────────────
  // CHAPTER 5 — THE WISH (Interactive Candle Ritual)
  // ─────────────────────────────────────────────
  wish: {
    chapter: "Chapter V",
    eyebrow: "A ritual for the year ahead",
    title: "Make a wish.\nBlow out the candles.",
    lede: "Hold the ring until the circle fills — or tap each flame one by one. Then close your eyes. Make it count.",
    holdLabel: "Hold to send your wish",
    holdingLabel: "Sending your wish to the stars…",
    tapBlowLabel: "Or tap each flame to blow it out",
    blown: "May every quiet wish come true.",
    blownBody:
      "Your wish has been whispered to the night sky. May this year bring you unshakeable peace, hard-earned victories, and every quiet dream you've been holding close.",
    again: "Light them once more",
  },

  // ─────────────────────────────────────────────
  // CHAPTER 5 — THE LETTER (Unfolding Envelope)
  // ─────────────────────────────────────────────
  letterSection: {
    chapter: "Chapter VI",
    eyebrow: "Words kept in ink",
    title: "A letter, written for you.",
    lede: "Sealed carefully and kept safe. Tap to break the seal and read what's inside.",
    sealedFor: "Handwritten for",
    openLabel: "Break the seal & read",
    reseal: "Fold the letter back up",
  },

  letter: {
    salutation: "Dearest Potti,",
    bodyParagraphs: [
      "Another year. And with every passing year, you seem to grow into yourself more — bolder, softer, sharper, and somehow even more you than before. Taking a moment to reflect on everything you've navigated this year fills me with the kind of pride that's hard to put into words.",
      "You carry yourself with this rare combination of grit and warmth that most people spend their whole lives trying to find. Whether you're chasing goals or just showing up for the people you love, you bring something to every room that's impossible to replicate.",
      "As you step into this new year, my wish for you is simple: I hope it rewards everything you've poured into it. I hope it brings you moments of genuine rest, genuine joy, and genuine pride in who you're becoming.",
      "I'm in your corner — always. Cheering louder than you can hear. Prouder than you know.",
    ],
    signoff: "Always yours, always cheering —",
    signature: "With all my love",
  },

  // ─────────────────────────────────────────────
  // CHAPTER 6 — THE FINALE (Celebration)
  // ─────────────────────────────────────────────
  finale: {
    chapter: "The Epilogue",
    eyebrow: "The final page, for now",
    title: "Happy Birthday,",
    closing:
      "Some people make ordinary days feel extraordinary. You're one of those people. Thank you for being you — today, and every day that comes after this one.",
    replay: "Return to the beginning",
    heartsPrompt: "Tap anywhere to send up hearts ❤️",
  },

  // ─────────────────────────────────────────────
  // TIMELINE MOMENTS — The 4 photo slots
  // ─────────────────────────────────────────────
  timelineMoments: [
    {
      date: "The First Hello",
      title: "Where the story began",
      description:
        "The very first conversation — witty, unforgettable, and an instant spark that changed everything.",
      backNote:
        "I still remember the first thing you said. I knew right then that you were someone extraordinarily rare.",
      image: "/photos/how-we-met.jpg",
      tag: "Chapter I",
    },
    {
      date: "Unfiltered Laughter",
      title: "Adventures & quiet drives",
      description:
        "Singing off-key to our favourite songs and discovering that anywhere with you is an adventure.",
      backNote:
        "Lost somewhere, talking about everything and nothing. That was the happiest, easiest memory.",
      image: "/photos/first-date.jpg",
      tag: "Chapter II",
    },
    {
      date: "Pure Pride",
      title: "Watching you conquer",
      description:
        "Seeing your dedication, your sharp mind, and the effortless grace you bring to every challenge.",
      backNote:
        "Nobody works harder or cares more deeply than you do. Watching you succeed is one of my greatest joys.",
      image: "/photos/when-i-knew.jpg",
      tag: "Chapter III",
    },
    {
      date: "Today & Tomorrow",
      title: "The pages ahead",
      description:
        "Celebrating the extraordinary person you are today, and eagerly anticipating all the magic this next year holds.",
      backNote:
        "The best chapter of your life is the one we're writing right now. Happy Birthday, my favourite person.",
      image: "/photos/today.jpg",
      tag: "Chapter IV",
    },
  ] satisfies TimelineMoment[],

  // ─────────────────────────────────────────────
  // APPRECIATION CARDS — Why She's Special
  // ─────────────────────────────────────────────
  appreciationCards: [
    {
      emoji: "✨",
      label: "That smile",
      message:
        "There's something about your smile that makes even the most ordinary moment feel like magic. It's the kind of smile that stays with people long after you've left the room.",
      color: "rose",
    },
    {
      emoji: "💡",
      label: "Your brilliance",
      message:
        "The way your mind works — the questions you ask, the connections you make, the clarity you bring to everything — genuinely impresses me. You're sharper than you give yourself credit for.",
      color: "brass",
    },
    {
      emoji: "🌿",
      label: "Your kindness",
      message:
        "You care about people in a way that's increasingly rare. Not just when it's convenient. Not just when it's noticed. You just genuinely care. That's one of the most beautiful things about you.",
      color: "sage",
    },
    {
      emoji: "🔥",
      label: "Your spirit",
      message:
        "You don't back down. Even when things are hard, even when the odds feel stacked, you find a way through. That kind of quiet resilience? It's extraordinary.",
      color: "rose",
    },
    {
      emoji: "🎭",
      label: "Your craziness",
      message:
        "The totally unpredictable, endlessly entertaining, keeps-everyone-on-their-toes energy you bring? The world would be genuinely so much more boring without it.",
      color: "brass",
    },
    {
      emoji: "💫",
      label: "The little things",
      message:
        "The tiny details — the way you laugh, the things that catch your attention, the random observations you make — they're the things that stick. The little things are actually the biggest things.",
      color: "rose",
    },
  ] satisfies AppreciationCard[],
};

/** Everything the app reads, in one type. */
export type BirthdayConfig = typeof config;

/** All photos on the page, for preloading. */
export const allPhotoPaths: string[] = [
  ...config.timelineMoments.map((m) => m.image),
];
