/**
 * App.tsx — Main application shell
 * Orchestrates the loading screen and scroll-through love story experience
 */
import { useState, useEffect } from "react";

// Layout
import ScrollProgress from "./components/layout/ScrollProgress";

// Sections (in scroll order)
import LoadingScreen from "./components/sections/LoadingScreen";
import HeroSection from "./components/sections/HeroSection";
import HowWeMetSection from "./components/sections/HowWeMetSection";
import MemoriesGallery from "./components/sections/MemoriesGallery";
import ReasonsILoveYou from "./components/sections/ReasonsILoveYou";
import FutureDreams from "./components/sections/FutureDreams";
import GiftReveal from "./components/sections/GiftReveal";
import BirthdayMessage from "./components/sections/BirthdayMessage";
import LoveNoteForm from "./components/sections/LoveNoteForm";

function App() {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Wait for fonts and initial assets to load
    const minLoadTime = new Promise((resolve) => setTimeout(resolve, 2800));
    const fontsReady = document.fonts?.ready || Promise.resolve();

    Promise.all([minLoadTime, fontsReady]).then(() => {
      setIsLoading(false);
    });
  }, []);

  return (
    <div className="grain-overlay">
      {/* Loading screen with exit animation */}
      <LoadingScreen isLoading={isLoading} />

      {/* Scroll progress bar */}
      {!isLoading && <ScrollProgress />}

      {/* Main content — scrollable love story */}
      <main>
        <HeroSection />
        <HowWeMetSection />
        <MemoriesGallery />
        <ReasonsILoveYou />
        <FutureDreams />
        <GiftReveal />
        <BirthdayMessage />
        <LoveNoteForm />
      </main>
    </div>
  );
}

export default App;
