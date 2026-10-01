/**
 * App.tsx — The birthday keepsake book, assembled.
 *
 * Owns three things:
 *   1. Whether the story has started (the velvet curtain drag opening).
 *   2. Which chapter is on screen, so the nav can say so.
 *   3. Replay, which puts the curtain back.
 *
 * Five chapters walking from light to candlelit night:
 *   1. The Day (#opening)
 *   2. Photos (#photos)
 *   3. The Wish (#wish)
 *   4. The Letter (#letter)
 *   5. Happy Birthday (#birthday)
 */
import { useCallback, useEffect, useState } from "react";
import { AnimatePresence, MotionConfig, useReducedMotion } from "framer-motion";

import { allPhotoPaths } from "./config/content";
import { chapterIds } from "./lib/chapters";
import { useActiveChapter } from "./hooks/useActiveChapter";

import ScrollProgress from "./components/layout/ScrollProgress";
import ChapterNav from "./components/layout/ChapterNav";

import BirthdayIntro from "./components/sections/BirthdayIntro";
import StoryHero from "./components/sections/StoryHero";
import PhotoGallery from "./components/sections/PhotoGallery";
import MakeAWish from "./components/sections/MakeAWish";
import LoveLetter from "./components/sections/LoveLetter";
import FinalReveal from "./components/sections/FinalReveal";

/** Photos warmed before the curtain lifts. */
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
            image.onload = () => resolve();
            image.onerror = () => resolve();
            image.src = src;
          }),
      );

    // Failsafe: if a request hangs, unlock anyway.
    const failsafe = window.setTimeout(done, 3500);

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
          .getElementById("photos")
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

  useEffect(() => {
    if ("scrollRestoration" in window.history) {
      window.history.scrollRestoration = "manual";
    }
  }, []);

  return (
    <div className={`grain min-h-screen bg-ink text-ink-text ${reduced ? "reduce-motion" : ""}`}>
      <AnimatePresence>
        {!started && <BirthdayIntro ready={assetsReady} onBegin={begin} />}
      </AnimatePresence>

      <button
        type="button"
        onClick={skipToStory}
        className="focus-inset sr-only rounded-full bg-ink px-5 py-3 text-sm text-porcelain focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-[80]"
      >
        Skip the opening and go to the story
      </button>

      <ScrollProgress />
      <ChapterNav activeId={activeChapter} visible={started} />

      <main>
        <StoryHero replayToken={replayToken} />
        <PhotoGallery />
        <MakeAWish />
        <LoveLetter />
        <FinalReveal onReplay={replay} />
      </main>
    </div>
  );
}

export default App;
