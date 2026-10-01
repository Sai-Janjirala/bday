/**
 * GiftReveal — Interactive gift box that opens on tap/click
 * Reveals a heartfelt message with confetti explosion and sparkle effects
 */
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { config } from "../../config/content";
import Confetti from "../ui/Confetti";

export default function GiftReveal() {
  const [isOpened, setIsOpened] = useState(false);
  const [showConfetti, setShowConfetti] = useState(false);

  const handleOpen = () => {
    if (isOpened) {
      // Reset for replay
      setIsOpened(false);
      setTimeout(() => {
        setIsOpened(true);
        triggerConfetti();
      }, 500);
    } else {
      setIsOpened(true);
      triggerConfetti();
    }
  };

  const triggerConfetti = () => {
    setShowConfetti(true);
    setTimeout(() => setShowConfetti(false), 100);
  };

  return (
    <section
      id="gift-reveal"
      className="relative py-20 md:py-32 overflow-hidden flex items-center justify-center min-h-screen"
      style={{
        background:
          "radial-gradient(ellipse at center, rgba(255,248,240,1) 0%, rgba(249,228,228,0.5) 50%, rgba(237,228,240,0.3) 100%)",
      }}
    >
      {/* Sparkle decorations */}
      {[...Array(6)].map((_, i) => (
        <motion.span
          key={i}
          className="absolute text-lg md:text-xl"
          style={{
            top: `${15 + Math.random() * 70}%`,
            left: `${10 + Math.random() * 80}%`,
          }}
          animate={{
            opacity: [0.1, 0.6, 0.1],
            scale: [0.8, 1.2, 0.8],
            rotate: [0, 180, 360],
          }}
          transition={{
            duration: 3 + Math.random() * 2,
            repeat: Infinity,
            delay: Math.random() * 2,
          }}
        >
          ✨
        </motion.span>
      ))}

      <div className="relative z-10 text-center px-6 max-w-xl mx-auto">
        {/* Section heading */}
        <motion.div
          className="mb-12"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
        >
          <span className="font-script text-xl md:text-2xl text-gold mb-3 block">
            A Little Something Special
          </span>
          <h2 className="font-serif text-3xl md:text-5xl font-bold text-charcoal">
            Open Your Gift
          </h2>
        </motion.div>

        {/* Gift box */}
        <motion.div
          className="relative inline-block cursor-pointer"
          initial={{ opacity: 0, scale: 0.8 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.3 }}
          onClick={handleOpen}
        >
          {/* Confetti burst */}
          <Confetti active={showConfetti} count={30} originX={50} originY={30} />

          <AnimatePresence mode="wait">
            {!isOpened ? (
              /* Closed gift box */
              <motion.div
                key="closed"
                className="relative"
                whileHover={{ scale: 1.05, rotate: [-1, 1, -1, 0] }}
                whileTap={{ scale: 0.95 }}
                transition={{ duration: 0.4 }}
              >
                {/* Box body */}
                <div
                  className="w-44 h-40 md:w-56 md:h-48 rounded-2xl relative mx-auto"
                  style={{
                    background:
                      "linear-gradient(135deg, #E8A0BF, #D4B8E0)",
                    boxShadow:
                      "0 10px 40px rgba(196, 91, 124, 0.2), inset 0 -5px 15px rgba(0,0,0,0.05)",
                  }}
                >
                  {/* Ribbon vertical */}
                  <div className="absolute left-1/2 -translate-x-1/2 w-6 h-full bg-gold/50 rounded-sm" />
                  {/* Ribbon horizontal */}
                  <div className="absolute top-1/2 -translate-y-1/2 w-full h-6 bg-gold/50 rounded-sm" />
                </div>

                {/* Bow */}
                <div className="absolute -top-4 left-1/2 -translate-x-1/2 text-4xl md:text-5xl">
                  🎀
                </div>

                {/* Glow effect */}
                <motion.div
                  className="absolute inset-0 rounded-2xl"
                  animate={{
                    boxShadow: [
                      "0 0 20px rgba(212,168,83,0.2)",
                      "0 0 40px rgba(212,168,83,0.4)",
                      "0 0 20px rgba(212,168,83,0.2)",
                    ],
                  }}
                  transition={{ duration: 2, repeat: Infinity }}
                />

                <motion.p
                  className="mt-6 font-script text-base md:text-lg text-rose-deep"
                  animate={{ opacity: [0.5, 1, 0.5] }}
                  transition={{ duration: 2, repeat: Infinity }}
                >
                  Tap to open ♡
                </motion.p>
              </motion.div>
            ) : (
              /* Opened gift — message card */
              <motion.div
                key="opened"
                className="relative"
                initial={{ opacity: 0, y: 50, scale: 0.5, rotateX: 30 }}
                animate={{ opacity: 1, y: 0, scale: 1, rotateX: 0 }}
                transition={{
                  type: "spring",
                  stiffness: 150,
                  damping: 15,
                  delay: 0.2,
                }}
              >
                {/* Message card */}
                <div
                  className="glass-card px-8 py-10 md:px-12 md:py-14 max-w-md mx-auto"
                  style={{
                    boxShadow:
                      "0 15px 50px rgba(196, 91, 124, 0.15), 0 0 80px rgba(212, 168, 83, 0.1)",
                    border: "1px solid rgba(212, 168, 83, 0.25)",
                  }}
                >
                  {/* Decorative top */}
                  <motion.div
                    className="text-3xl mb-4"
                    animate={{ rotate: [0, 5, -5, 0] }}
                    transition={{ duration: 3, repeat: Infinity }}
                  >
                    💝
                  </motion.div>

                  <motion.p
                    className="font-serif text-base md:text-lg text-charcoal leading-relaxed italic"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.6, duration: 1 }}
                  >
                    "{config.giftMessage}"
                  </motion.p>

                  <motion.div
                    className="mt-6 font-script text-lg text-rose-deep"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 1.2 }}
                  >
                    With all my love ♡
                  </motion.div>
                </div>

                {/* Tap again hint */}
                <motion.p
                  className="mt-6 font-sans text-xs text-warm-gray"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 0.5 }}
                  transition={{ delay: 2 }}
                >
                  Tap to replay ✨
                </motion.p>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      </div>
    </section>
  );
}
