/**
 * App.tsx — the evening, assembled.
 *
 * Owns three things and nothing else:
 *   1. Whether the story has started (the intro curtain).
 *   2. Which chapter is on screen, so the nav can say so.
 *   3. Replay, which puts the curtain and the wax seal back.
 *
 * The chapter order below is the reading order of the whole piece, and
 * the ids line up with `chapters` in `lib/chapters.ts` — if you add a
 * section, add its id there too or the nav will skip it.
 *
 * Preloading is honest: the intro button only unlocks once the fonts
 * have loaded and the first couple of photos have either arrived or
 * failed. Nothing here waits for a fake minimum.
 */
import { useCallback, useEffect, useState } from "react";
import { AnimatePresence, MotionConfig, useReducedMotion } from "framer-motion";

import { config, allPhotoPaths } from "./config/content";
import { chapterIds } from "./lib/chapters";
import { useActiveChapter } from "./hooks/useActiveChapter";

import ScrollProgress from "./components/layout/ScrollProgress";
import ChapterNav from "./components/layout/ChapterNav";
import MusicToggle from "./components/layout/MusicToggle";

import BirthdayIntro from "./components/sections/BirthdayIntro";
import StoryHero from "./components/sections/StoryHero";
import MemoryTimeline from "./components/sections/MemoryTimeline";
import ReasonsSection from "./components/sections/ReasonsSection";
import PhotoGallery from "./components/sections/PhotoGallery";
import MakeAWish from "./components/sections/MakeAWish";
import YearAhead from "./components/sections/YearAhead";
import SecretNote from "./components/sections/SecretNote";
import LoveLetter from "./components/sections/LoveLetter";
import WishCapsule from "./components/sections/WishCapsule";
import FinalReveal from "./components/sections/FinalReveal";

/** Only the first couple of frames are warmed before the curtain lifts. */
const EAGER_PHOTOS = 4;

function useAssetsReady() {
  const [ready, setReady] = useState(false);

  useEffect(() => {
    let settled = false;
    const done = () => {
      if (!settled) {
        settled = true;
        setReady(true);
      }
    };

    const fonts = document.fonts?.ready ?? Promise.resolve();
    const photos = allPhotoPaths
      .slice(0, EAGER_PHOTOS)
      .map(
        (src) =>
          new Promise<void>((resolve) => {
            const image = new Image();
            // A missing photo resolves too — the placeholder is a valid
            // state, not a failure, and the button must never hang.
            image.onload = () => resolve();
            image.onerror = () => resolve();
            image.src = src;
          }),
      );

    // Belt and braces: if a request never settles, unlock anyway.
    const failsafe = window.setTimeout(done, 4000);

    void Promise.all([fonts, ...photos]).then(() => {
      window.clearTimeout(failsafe);
      done();
    });

    return () => {
      settled = true;
      window.clearTimeout(failsafe);
    };
  }, []);

  return ready;
}

function App() {
  return (
    /**
     * One global motion policy, so no component has to guess.
     * `reducedMotion: "user"` makes every transform-based animation
     * collapse to a cross-fade on its own wherever `useReducedMotion()`
     * isn't consulted, and the class lets the stylesheet drop the
     * ambient loops too.
     */
    <MotionConfig reducedMotion="user">
      <Experience />
    </MotionConfig>
  );
}

function Experience() {
  const reduced = useReducedMotion();
  const assetsReady = useAssetsReady();
  const [started, setStarted] = useState(false);
  const [replayToken, setReplayToken] = useState(0);

  const activeChapter = useActiveChapter(chapterIds, started);

  const begin = useCallback(() => {
    setStarted(true);
  }, []);

  const skipToStory = useCallback(() => {
    setStarted(true);
    // Wait for the curtain to clear so the scroll lands in the right place.
    window.setTimeout(
      () => {
        document
          .getElementById("moments")
          ?.scrollIntoView({ behavior: reduced ? "auto" : "smooth", block: "start" });
      },
      reduced ? 0 : 1200,
    );
  }, [reduced]);

  const replay = useCallback(() => {
    setStarted(false);
    setReplayToken((token) => token + 1);
    window.scrollTo({ top: 0, behavior: reduced ? "auto" : "smooth" });
  }, [reduced]);

  // Don't leave the story frozen at the top if she reloads mid-page.
  useEffect(() => {
    if ("scrollRestoration" in window.history) {
      window.history.scrollRestoration = "manual";
    }
  }, []);

  return (
    <div className={`grain min-h-screen bg-ink text-ink-text ${reduced ? "reduce-motion" : ""}`}>
      <AnimatePresence>{!started && <BirthdayIntro ready={assetsReady} onBegin={begin} />}</AnimatePresence>

      <button
        type="button"
        onClick={skipToStory}
        className="focus-inset sr-only rounded-full bg-ink px-5 py-3 text-sm text-porcelain focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-[80]"
      >
        Skip the opening and go to the story
      </button>

      <ScrollProgress />
      <ChapterNav activeId={activeChapter} visible={started} />
      <MusicToggle
        label={config.music.label}
        src={config.music.src}
        visible={started}
      />

      <main>
        <StoryHero replayToken={replayToken} />
        <MemoryTimeline />
        <ReasonsSection />
        <PhotoGallery />
        <MakeAWish />
        <YearAhead />
        <LoveLetter />
        <WishCapsule />
        <SecretNote />
        <FinalReveal onReplay={replay} />
      </main>
    </div>
  );
}

export default App;
