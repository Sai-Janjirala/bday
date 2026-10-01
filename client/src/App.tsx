/**
 * App.tsx — Main application shell
 * Orchestrates the mature, creative, and interactive birthday celebration experience
 */
import { useState, useEffect } from "react";

// Layout
import ScrollProgress from "./components/layout/ScrollProgress";

// Sections (in scroll order)
import LoadingScreen from "./components/sections/LoadingScreen";
import HeroSection from "./components/sections/HeroSection";
import InteractiveCake from "./components/sections/InteractiveCake";
import HowWeMetSection from "./components/sections/HowWeMetSection";
import MemoriesGallery from "./components/sections/MemoriesGallery";
import WhatMakesYouExtraordinary from "./components/sections/WhatMakesYouExtraordinary";
import BirthdayCoupons from "./components/sections/BirthdayCoupons";
import TheYearAhead from "./components/sections/TheYearAhead";
import BirthdayLetter from "./components/sections/BirthdayLetter";
import LoveNoteForm from "./components/sections/LoveNoteForm";

function App() {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Wait for fonts and initial assets to load
    const minLoadTime = new Promise((resolve) => setTimeout(resolve, 2000));
    const fontsReady = document.fonts?.ready || Promise.resolve();

    Promise.all([minLoadTime, fontsReady]).then(() => {
      setIsLoading(false);
    });
  }, []);

  return (
    <div className="grain-overlay min-h-screen bg-[#FEFBF6] text-stone-800">
      {/* Loading screen with exit animation */}
      <LoadingScreen isLoading={isLoading} />

      {/* Scroll progress bar */}
      {!isLoading && <ScrollProgress />}

      {/* Main content — scrollable birthday celebration */}
      <main>
        <HeroSection />
        <InteractiveCake />
        <HowWeMetSection />
        <MemoriesGallery />
        <WhatMakesYouExtraordinary />
        <BirthdayCoupons />
        <TheYearAhead />
        <BirthdayLetter />
        <LoveNoteForm />
      </main>
    </div>
  );
}

export default App;
