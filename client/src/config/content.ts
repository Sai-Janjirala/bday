/**
 * ═══════════════════════════════════════════════════════════════
 *  BIRTHDAY KEEPSAKE BOOK — CONTENT CONFIGURATION
 * ═══════════════════════════════════════════════════════════════
 *
 * ✏️ HOW TO CUSTOMIZE:
 * To customize for your special person, simply replace "[Her Name]"
 * below with her real name (e.g. "Sarah", "Sophia", "Potti", etc.)!
 * All personal text, memories, letter paragraphs, and quotes live here.
 */

export interface TimelineMoment {
  date: string;
  title: string;
  description: string;
  backNote: string;
  image: string;
  tag: string;
}

export const config = {
  /** 
   * 🌟 HER NAME — Replace "[Her Name]" with her actual name!
   */
  herName: "[Her Name]",

  /** 
   * 💖 NICKNAME — Replace with her pet name or leave as her name
   */
  nickname: "[Her Name]",

  // ─────────────────────────────────────────────
  // THE LANDING PAGE & ARRIVAL
  // ─────────────────────────────────────────────
  intro: {
    badge: "A Handmade Keepsake",
    firstLine: "Hey, [Her Name]…",
    secondLine: "A bespoke keepsake book, bound just for you.",
    prompt: "Pull up the golden ribbon or press the seal to open",
    dragHint: "Pull up to open",
    tapHint: "Tap or hold the wax seal",
    keyboardPrompt: "Press Space, Enter, or ↑ to open",
    sealText: "FOR YOU",
    /** Honest rotating status cues while fonts and photos warm up */
    loadingCues: [
      "Binding the pages with silk thread…",
      "Pressing blossoms into the margins…",
      "Lighting the candlelight…",
      "Preparing your birthday surprise…",
    ],
  },

  // ─────────────────────────────────────────────
  // CHAPTER 1 — THE DAY (Hero Opening)
  // ─────────────────────────────────────────────
  hero: {
    chapter: "Chapter I",
    eyebrow: "A birthday keepsake, bound by hand",
    titlePrefix: "Happy Birthday,",
    subtitle:
      "A celebration of the smartest, kindest, and most captivating soul I know. Scroll slowly — every page of this keepsake was handcrafted to celebrate you.",
    scrollCue: "Turn the page ↓",
    tagline: "Every story is better because you are in it.",
  },

  // ─────────────────────────────────────────────
  // CHAPTER 2 — THE GALLERY (Visual Star of the Middle)
  // ─────────────────────────────────────────────
  gallery: {
    chapter: "Chapter II",
    eyebrow: "Captured in time",
    title: "Pages from our favourite days.",
    lede: "Like pressed flowers kept between antique pages, each memory is a treasure. Tap any print to flip it and read the private note on the back.",
    hint: "Tap any print to flip or inspect",
    quotes: [
      "In all the world, there is no heart for me like yours. In all the world, there is no love for you like mine.",
      "The best moments in life aren't planned — they are the ones spent laughing with you.",
      "You make every ordinary second feel like timeless poetry.",
    ],
    lines: [
      "Looking through these photographs, I realize how much brighter the world has felt since the day you entered it.",
      "Years from now, no matter where life leads us, these will always remain the memories I treasure most.",
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
    eyebrow: "A secret postscript",
    title: "Something hidden in gold.",
    lede: "Use your finger or mouse to scratch away the shimmering gold foil and reveal a private message.",
    revealHint: "Rub with your cursor or finger to scratch",
    secretNote:
      "If I could give you one gift this year, it would be the ability to see yourself through my eyes — so you would finally understand how truly brilliant, radiant, and deeply cherished you are every single day.",
    badge: "Certified Keepsake",
    revealedTitle: "Kept in ink & heart",
  },

  // ─────────────────────────────────────────────
  // CHAPTER 4 — THE WISH (Interactive Candle Ritual)
  // ─────────────────────────────────────────────
  wish: {
    chapter: "Chapter IV",
    eyebrow: "A ritual for the year ahead",
    title: "Make a wish.\nBlow out the candles.",
    lede: "Hold the flame until the starlight circle fills — or blow out each candle one by one with a tap.",
    holdLabel: "Hold to send your wish",
    holdingLabel: "Holding your wish in the stars…",
    tapBlowLabel: "Tap any candle to blow it out",
    blown: "May every quiet wish come true.",
    blownBody:
      "Your wish has been whispered to the night sky. May this new year bring you unshakeable peace, triumphant victories, genuine happiness, and all the quiet dreams you keep close to your heart.",
    again: "Light them once more",
  },

  // ─────────────────────────────────────────────
  // CHAPTER 5 — THE LETTER (Unfolding Envelope)
  // ─────────────────────────────────────────────
  letterSection: {
    chapter: "Chapter V",
    eyebrow: "Words kept in ink",
    title: "A handwritten letter for you.",
    lede: "Folded carefully into antique paper and sealed with wax. Tap to break the seal and unfold.",
    sealedFor: "Handcrafted for",
    openLabel: "Break the seal & unfold",
    reseal: "Fold the letter back up",
  },

  letter: {
    salutation: "Dearest [Her Name],",
    bodyParagraphs: [
      "Another year wiser, bolder, and more extraordinarily radiant. Taking a quiet moment to reflect on who you are and all you have navigated over this past year fills me with immense admiration.",
      "You carry yourself with a rare combination of grit, sharp intellect, and graceful warmth. Whether you are chasing down ambitious goals or sharing late-night laughter, your presence brings clarity, comfort, and undeniable light to everyone around you.",
      "As you turn this page and step into your next chapter, my wish for you is simple: I hope this year rewards your hard work with peace of mind, surrounds you with people who uplift you, and brings you countless reasons to smile until your cheeks hurt.",
      "I am tremendously proud of who you are, deeply lucky to share life's moments with you, and always in your corner cheering you on through every triumph and every dream.",
    ],
    signoff: "Always cheering for you & holding you dear,",
    signature: "With all my love & respect",
  },

  // ─────────────────────────────────────────────
  // CHAPTER 6 — THE FINALE (Celebration)
  // ─────────────────────────────────────────────
  finale: {
    chapter: "The Epilogue",
    eyebrow: "The final page, for now",
    title: "Happy Birthday,",
    closing:
      "Thank you for being the sweetest melody in every memory and the brightest light in every room. Here is to celebrating you today, tomorrow, and across every chapter yet to come.",
    replay: "Return to the beginning",
    heartsPrompt: "Tap anywhere to send up a bloom of celestial starlight",
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
        "I still remember the first thing you said. I knew right then and there that you were someone extraordinarily rare.",
      image: "/photos/how-we-met.jpg",
      tag: "Chapter I",
    },
    {
      date: "Unfiltered Laughter",
      title: "Adventures & quiet drives",
      description:
        "Singing along to our favorite songs off-key and discovering that anywhere with you is an adventure.",
      backNote:
        "Lost on backroads, talking about everything and nothing. That day was the easiest, happiest memory.",
      image: "/photos/first-date.jpg",
      tag: "Chapter II",
    },
    {
      date: "Pure Pride",
      title: "Watching you conquer",
      description:
        "Seeing your dedication, your sharp mind, and the effortless grace you bring to every challenge you tackle.",
      backNote:
        "Nobody works harder or cares deeper than you do. Watching you succeed is one of my greatest joys.",
      image: "/photos/when-i-knew.jpg",
      tag: "Chapter III",
    },
    {
      date: "Today & Tomorrow",
      title: "The pages ahead",
      description:
        "Celebrating the extraordinary person you are today, and eagerly anticipating all the magic the coming year holds.",
      backNote:
        "The best chapter of your life is the one we are writing right now. Happy Birthday, my favorite person.",
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
