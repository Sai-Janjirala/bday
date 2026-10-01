/**
 * MemoriesGallery — Horizontal-scroll carousel on mobile, grid on desktop
 * Each memory card has a photo placeholder, caption, and heart burst on tap
 */
import { useRef, useState } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { config } from "../../config/content";
import GlassCard from "../ui/GlassCard";
import PhotoPlaceholder from "../ui/PhotoPlaceholder";
import Confetti from "../ui/Confetti";

export default function MemoriesGallery() {
  const ref = useRef<HTMLDivElement>(null);
  const [activeConfetti, setActiveConfetti] = useState<number | null>(null);

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });

  const headingY = useTransform(scrollYProgress, [0, 0.3], [50, 0]);
  const headingOpacity = useTransform(scrollYProgress, [0, 0.2], [0, 1]);

  const handleHeartClick = (index: number) => {
    setActiveConfetti(index);
    setTimeout(() => setActiveConfetti(null), 100);
  };

  return (
    <section
      id="memories"
      ref={ref}
      className="relative py-20 md:py-32 overflow-hidden"
      style={{
        background:
          "linear-gradient(180deg, rgba(237,228,240,0.15) 0%, rgba(249,228,228,0.2) 50%, rgba(255,248,240,0.3) 100%)",
      }}
    >
      {/* Decorative elements */}
      <motion.div
        className="gradient-blob w-80 h-80"
        style={{
          background: "rgba(212, 168, 83, 0.06)",
          top: "20%",
          right: "-10%",
          position: "absolute",
        }}
        animate={{ rotate: [0, 360] }}
        transition={{ duration: 60, repeat: Infinity, ease: "linear" }}
      />

      <div className="relative z-10 max-w-6xl mx-auto px-6">
        {/* Section heading */}
        <motion.div
          className="text-center mb-12 md:mb-20"
          style={{ y: headingY, opacity: headingOpacity }}
        >
          <motion.span
            className="font-script text-xl md:text-2xl text-rose inline-block mb-3"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            Moments I Treasure
          </motion.span>
          <h2 className="font-serif text-3xl md:text-5xl font-bold text-charcoal">
            Our Favorite Memories
          </h2>
          <motion.div
            className="w-16 h-0.5 bg-gradient-to-r from-gold to-rose mx-auto mt-4"
            initial={{ width: 0 }}
            whileInView={{ width: 64 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.3 }}
          />
        </motion.div>

        {/* Mobile: Horizontal scroll carousel */}
        <div className="md:hidden">
          <div className="flex gap-4 overflow-x-auto pb-6 snap-x snap-mandatory -mx-6 px-6 scrollbar-hide"
            style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
          >
            {config.memories.map((memory, index) => (
              <div
                key={index}
                className="flex-none w-[75vw] max-w-xs snap-center"
              >
                <GlassCard delay={index * 0.1} className="h-full relative">
                  <PhotoPlaceholder
                    src={memory.image}
                    alt={memory.caption}
                    className="mb-3 w-full"
                    aspectRatio="4/5"
                  />
                  <p className="font-serif text-base text-charcoal font-medium mb-1">
                    {memory.caption}
                  </p>
                  <p className="font-script text-sm text-rose">
                    {memory.date}
                  </p>

                  {/* Heart button */}
                  <motion.button
                    className="absolute top-4 right-4 w-10 h-10 rounded-full bg-white/60 backdrop-blur-sm flex items-center justify-center text-lg border border-white/30 cursor-pointer z-20"
                    whileHover={{ scale: 1.2 }}
                    whileTap={{ scale: 0.85 }}
                    onClick={() => handleHeartClick(index)}
                  >
                    💖
                  </motion.button>
                  <Confetti
                    active={activeConfetti === index}
                    originX={85}
                    originY={10}
                  />
                </GlassCard>
              </div>
            ))}
          </div>
        </div>

        {/* Desktop: Grid layout */}
        <div className="hidden md:grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {config.memories.map((memory, index) => (
            <GlassCard
              key={index}
              delay={index * 0.12}
              className="relative group"
            >
              <PhotoPlaceholder
                src={memory.image}
                alt={memory.caption}
                className="mb-4 w-full"
                aspectRatio="4/5"
              />
              <p className="font-serif text-lg text-charcoal font-medium mb-1">
                {memory.caption}
              </p>
              <p className="font-script text-sm text-rose">{memory.date}</p>

              {/* Heart button */}
              <motion.button
                className="absolute top-4 right-4 w-10 h-10 rounded-full bg-white/60 backdrop-blur-sm flex items-center justify-center text-lg border border-white/30 cursor-pointer opacity-0 group-hover:opacity-100 transition-opacity z-20"
                whileHover={{ scale: 1.2 }}
                whileTap={{ scale: 0.85 }}
                onClick={() => handleHeartClick(index)}
              >
                💖
              </motion.button>
              <Confetti
                active={activeConfetti === index}
                originX={90}
                originY={8}
              />
            </GlassCard>
          ))}
        </div>
      </div>
    </section>
  );
}
