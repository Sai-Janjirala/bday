/**
 * HeroSection — Full-viewport romantic landing with floating hearts,
 * elegant typography, and the "Begin Our Story" CTA
 */
import { useRef, useState } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { config } from "../../config/content";
import FloatingHearts from "../ui/FloatingHearts";
import AnimatedText from "../ui/AnimatedText";
import MagicButton from "../ui/MagicButton";
import Confetti from "../ui/Confetti";

export default function HeroSection() {
  const ref = useRef<HTMLDivElement>(null);
  const [showConfetti, setShowConfetti] = useState(false);

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end start"],
  });

  // Parallax effect — content moves up as user scrolls
  const y = useTransform(scrollYProgress, [0, 1], [0, 150]);
  const opacity = useTransform(scrollYProgress, [0, 0.8], [1, 0]);
  const scale = useTransform(scrollYProgress, [0, 0.8], [1, 0.9]);

  const handleCTAClick = () => {
    setShowConfetti(true);
    setTimeout(() => setShowConfetti(false), 100);

    // Smooth scroll to next section
    const nextSection = document.getElementById("how-we-met");
    if (nextSection) {
      setTimeout(() => {
        nextSection.scrollIntoView({ behavior: "smooth" });
      }, 400);
    }
  };

  return (
    <section
      ref={ref}
      id="hero"
      className="relative min-h-screen flex items-center justify-center overflow-hidden"
      style={{
        background:
          "radial-gradient(ellipse at 30% 20%, rgba(249,228,228,0.8) 0%, rgba(254,251,246,1) 40%, rgba(237,228,240,0.6) 70%, rgba(212,184,224,0.3) 100%)",
      }}
    >
      {/* Floating hearts background */}
      <FloatingHearts count={30} />

      {/* Animated gradient blobs */}
      <motion.div
        className="gradient-blob w-72 h-72 md:w-96 md:h-96"
        style={{
          background: "rgba(232, 160, 191, 0.15)",
          top: "10%",
          left: "5%",
          position: "absolute",
        }}
        animate={{
          x: [0, 30, -20, 0],
          y: [0, -20, 15, 0],
          scale: [1, 1.1, 0.95, 1],
        }}
        transition={{ duration: 12, repeat: Infinity, ease: "easeInOut" }}
      />
      <motion.div
        className="gradient-blob w-56 h-56 md:w-80 md:h-80"
        style={{
          background: "rgba(212, 184, 224, 0.15)",
          bottom: "15%",
          right: "10%",
          position: "absolute",
        }}
        animate={{
          x: [0, -25, 20, 0],
          y: [0, 25, -15, 0],
          scale: [1, 0.95, 1.1, 1],
        }}
        transition={{
          duration: 15,
          repeat: Infinity,
          ease: "easeInOut",
          delay: 2,
        }}
      />
      <motion.div
        className="gradient-blob w-40 h-40"
        style={{
          background: "rgba(212, 168, 83, 0.08)",
          top: "50%",
          left: "50%",
          position: "absolute",
        }}
        animate={{
          x: [0, 40, -30, 0],
          y: [0, -30, 20, 0],
        }}
        transition={{ duration: 18, repeat: Infinity, ease: "easeInOut" }}
      />

      {/* Main content */}
      <motion.div
        className="relative z-10 text-center px-6 max-w-2xl mx-auto"
        style={{ y, opacity, scale }}
      >
        {/* Small decorative text */}
        <motion.p
          className="font-script text-lg md:text-xl text-rose mb-4"
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, duration: 0.8 }}
        >
          ✦ A special day for a special soul ✦
        </motion.p>

        {/* Main heading — letter by letter */}
        <div className="mb-6">
          <div className="font-serif text-4xl sm:text-5xl md:text-7xl font-bold leading-tight text-charcoal">
            <AnimatedText
              text="Happy Birthday"
              mode="letter"
              delay={0.8}
              staggerDuration={0.05}
            />
          </div>
          <div className="mt-2 md:mt-4">
            <span className="font-serif text-3xl sm:text-4xl md:text-6xl font-semibold text-gradient-romantic">
              <AnimatedText
                text={config.herName}
                mode="letter"
                delay={1.6}
                staggerDuration={0.07}
              />
            </span>
          </div>
        </div>

        {/* Subtitle */}
        <motion.p
          className="font-sans text-base md:text-lg text-charcoal-light/80 mb-10 max-w-md mx-auto leading-relaxed"
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 2.5, duration: 0.8 }}
        >
          {config.heroSubtitle}
        </motion.p>

        {/* CTA Button */}
        <div className="relative">
          <MagicButton onClick={handleCTAClick} delay={3} size="lg">
            Begin Our Story ♡
          </MagicButton>
          <Confetti active={showConfetti} originX={50} originY={50} />
        </div>

        {/* Scroll indicator */}
        <motion.div
          className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 4, duration: 1 }}
        >
          <motion.div
            className="w-6 h-10 border-2 border-rose/30 rounded-full flex justify-center pt-2"
            animate={{ opacity: [0.3, 0.7, 0.3] }}
            transition={{ duration: 2, repeat: Infinity }}
          >
            <motion.div
              className="w-1.5 h-3 bg-rose/50 rounded-full"
              animate={{ y: [0, 12, 0] }}
              transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
            />
          </motion.div>
        </motion.div>
      </motion.div>
    </section>
  );
}
