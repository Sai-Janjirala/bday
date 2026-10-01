/**
 * InteractiveCake.tsx — Interactive Birthday Cake with Candle Blow-Out
 * Allows the girlfriend to tap the candles or button to blow them out,
 * trigger realistic smoke animations, celebratory confetti, and a birthday wish toast.
 */
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Confetti from "../ui/Confetti";
import { config } from "../../config/content";

interface CandleState {
  id: number;
  lit: boolean;
  smoke: boolean;
}

export default function InteractiveCake() {
  const [candles, setCandles] = useState<CandleState[]>([
    { id: 1, lit: true, smoke: false },
    { id: 2, lit: true, smoke: false },
    { id: 3, lit: true, smoke: false },
    { id: 4, lit: true, smoke: false },
    { id: 5, lit: true, smoke: false },
  ]);

  const [allBlownOut, setAllBlownOut] = useState(false);
  const [showConfetti, setShowConfetti] = useState(false);

  const extinguishCandle = (id: number) => {
    setCandles((prev) =>
      prev.map((c) => {
        if (c.id === id && c.lit) {
          return { ...c, lit: false, smoke: true };
        }
        return c;
      })
    );

    // Check if that was the last candle
    setTimeout(() => {
      setCandles((current) => {
        const remaining = current.filter((c) => c.lit);
        if (remaining.length === 0 && !allBlownOut) {
          triggerCelebration();
        }
        return current;
      });
    }, 100);
  };

  const blowAllOut = () => {
    setCandles((prev) => prev.map((c) => ({ ...c, lit: false, smoke: true })));
    triggerCelebration();
  };

  const triggerCelebration = () => {
    setAllBlownOut(true);
    setShowConfetti(true);
    setTimeout(() => setShowConfetti(false), 3000);
  };

  const relightCandles = () => {
    setCandles([
      { id: 1, lit: true, smoke: false },
      { id: 2, lit: true, smoke: false },
      { id: 3, lit: true, smoke: false },
      { id: 4, lit: true, smoke: false },
      { id: 5, lit: true, smoke: false },
    ]);
    setAllBlownOut(false);
  };

  return (
    <section
      id="cake"
      className="relative py-20 md:py-28 px-6 overflow-hidden bg-gradient-to-b from-[#FEFBF6] via-[#FAF3EA] to-[#FEFBF6]"
    >
      <Confetti active={showConfetti} count={50} originX={50} originY={40} />

      <div className="max-w-xl mx-auto text-center relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
        >
          <span className="inline-block px-3 py-1 rounded-full text-xs font-medium tracking-wider uppercase bg-amber-100 text-amber-800 border border-amber-200/60 mb-3">
            Interactive Birthday Ritual 🎂
          </span>
          <h2 className="font-serif text-3xl md:text-4xl font-bold text-stone-800 mb-3">
            Make A Birthday Wish
          </h2>
          <p className="font-sans text-stone-600 text-sm md:text-base max-w-md mx-auto mb-8">
            Close your eyes, think of the wildest, most ambitious dream for your next year, and blow out the candles.
          </p>
        </motion.div>

        {/* The Interactive Cake Illustration */}
        <div className="relative w-72 md:w-80 h-64 mx-auto my-6 flex flex-col items-center justify-end">
          {/* Candles Row */}
          <div className="flex justify-center items-end gap-5 mb-1 z-20">
            {candles.map((candle) => (
              <div
                key={candle.id}
                onClick={() => extinguishCandle(candle.id)}
                className="relative flex flex-col items-center cursor-pointer group"
                title="Tap to blow out"
              >
                {/* Flame */}
                <AnimatePresence>
                  {candle.lit && (
                    <motion.div
                      className="w-4 h-6 rounded-full relative mb-1"
                      animate={{
                        scale: [1, 1.15, 0.95, 1],
                        rotate: [-2, 3, -3, 2],
                      }}
                      transition={{
                        duration: 0.8 + candle.id * 0.1,
                        repeat: Infinity,
                        ease: "easeInOut",
                      }}
                      exit={{
                        opacity: 0,
                        scale: 0.1,
                        y: -8,
                        transition: { duration: 0.2 },
                      }}
                      style={{
                        background:
                          "radial-gradient(ellipse at bottom, #FFDD00 0%, #FF8800 60%, #FF3300 100%)",
                        boxShadow:
                          "0 0 14px rgba(255, 170, 0, 0.8), 0 0 28px rgba(255, 100, 0, 0.4)",
                      }}
                    >
                      {/* Inner white-hot wick glow */}
                      <span className="absolute bottom-0.5 left-1/2 -translate-x-1/2 w-1.5 h-2.5 bg-white rounded-full opacity-90" />
                    </motion.div>
                  )}
                </AnimatePresence>

                {/* Smoke puff when blown out */}
                {candle.smoke && !candle.lit && (
                  <motion.div
                    className="absolute -top-6 w-3 h-5 rounded-full bg-stone-400/40 blur-xs pointer-events-none"
                    initial={{ opacity: 0.8, y: 0, scale: 0.8 }}
                    animate={{ opacity: 0, y: -20, scale: 2 }}
                    transition={{ duration: 1.5, ease: "easeOut" }}
                  />
                )}

                {/* Wick */}
                <div className="w-0.5 h-2 bg-stone-700 -mb-0.5" />

                {/* Candle body */}
                <div
                  className="w-3.5 h-12 rounded-t-sm shadow-sm transition-transform group-hover:scale-105"
                  style={{
                    background:
                      candle.id % 2 === 0
                        ? "linear-gradient(180deg, #FAD02C 0%, #E3A018 100%)"
                        : "linear-gradient(180deg, #F78CA0 0%, #FE9A8B 100%)",
                  }}
                >
                  {/* Subtle stripe pattern */}
                  <div className="w-full h-full opacity-30 bg-stripes" />
                </div>
              </div>
            ))}
          </div>

          {/* Cake Top Tier */}
          <div className="relative w-48 h-16 rounded-t-2xl bg-gradient-to-b from-[#FFF5EB] to-[#F7E7D4] border-t-4 border-[#EBD0B5] shadow-md flex items-center justify-center overflow-hidden">
            {/* Frosting drips */}
            <div className="absolute top-0 inset-x-0 flex justify-around">
              {[...Array(6)].map((_, i) => (
                <div
                  key={i}
                  className="w-5 h-4 bg-[#FFF5EB] rounded-b-full shadow-xs"
                />
              ))}
            </div>
            <span className="font-script text-base text-amber-900/60 z-10 pt-2">
              {config.herName}
            </span>
          </div>

          {/* Cake Bottom Tier */}
          <div className="relative w-64 h-22 rounded-t-xl bg-gradient-to-b from-[#EEDAC5] via-[#E4C9B0] to-[#D5B79C] border-t-4 border-[#FAF0E6] shadow-lg flex items-center justify-center overflow-hidden">
            {/* Frosting dots decoration */}
            <div className="absolute inset-x-0 top-2 flex justify-around px-4">
              {[...Array(8)].map((_, i) => (
                <span
                  key={i}
                  className="w-2.5 h-2.5 rounded-full bg-amber-100 shadow-xs"
                />
              ))}
            </div>
            <div className="font-serif tracking-widest text-xs uppercase font-semibold text-stone-700/60 pt-4">
              {config.chapterTitle || "Cheers To You"}
            </div>
          </div>

          {/* Stand / Plate */}
          <div className="w-72 h-3.5 rounded-full bg-gradient-to-r from-stone-300 via-stone-200 to-stone-300 shadow-md -mt-1" />
        </div>

        {/* Action Controls & Result */}
        <div className="mt-6 flex flex-col items-center gap-4">
          <AnimatePresence mode="wait">
            {!allBlownOut ? (
              <motion.button
                key="blow-btn"
                onClick={blowAllOut}
                className="px-6 py-3 rounded-full font-serif text-sm tracking-wide text-white shadow-md hover:shadow-lg transition-all duration-300 cursor-pointer border-none flex items-center gap-2"
                style={{
                  background: "linear-gradient(135deg, #B45309, #D97706)",
                }}
                whileHover={{ scale: 1.04 }}
                whileTap={{ scale: 0.96 }}
              >
                <span>🌬️</span> Blow Out All Candles
              </motion.button>
            ) : (
              <motion.div
                key="celebration-box"
                initial={{ opacity: 0, scale: 0.9, y: 10 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.9 }}
                className="p-6 rounded-2xl bg-white/90 backdrop-blur-md border border-amber-200/80 shadow-xl max-w-md mx-auto"
              >
                <div className="text-3xl mb-2">✨ 🥂 🎂</div>
                <h3 className="font-serif text-xl font-bold text-stone-800 mb-1">
                  Wish Locked In!
                </h3>
                <p className="font-sans text-stone-600 text-sm leading-relaxed mb-4">
                  May every single wish you just made find its way to you this year. You deserve every ounce of it.
                </p>
                <button
                  onClick={relightCandles}
                  className="text-xs font-sans text-amber-700 hover:text-amber-900 underline font-medium cursor-pointer bg-transparent border-none"
                >
                  Relight candles & blow again
                </button>
              </motion.div>
            )}
          </AnimatePresence>

          {!allBlownOut && (
            <p className="font-sans text-xs text-stone-400">
              Tip: You can also tap individual candles to extinguish them one by one!
            </p>
          )}
        </div>
      </div>
    </section>
  );
}
