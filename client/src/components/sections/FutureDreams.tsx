/**
 * FutureDreams — Split-panel layout with dream cards and parallax effects
 * Includes a typing effect on the main heading
 */
import { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { config } from "../../config/content";
import GlassCard from "../ui/GlassCard";

const DREAM_BACKGROUNDS = [
  "linear-gradient(135deg, rgba(232,160,191,0.1), rgba(249,228,228,0.2))",
  "linear-gradient(135deg, rgba(212,184,224,0.1), rgba(237,228,240,0.2))",
  "linear-gradient(135deg, rgba(212,168,83,0.08), rgba(255,248,240,0.2))",
  "linear-gradient(135deg, rgba(196,91,124,0.08), rgba(249,228,228,0.15))",
];

export default function FutureDreams() {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });

  const parallaxY = useTransform(scrollYProgress, [0, 1], [80, -80]);

  return (
    <section
      id="future-dreams"
      ref={ref}
      className="relative py-20 md:py-32 overflow-hidden"
      style={{
        background:
          "linear-gradient(180deg, rgba(249,228,228,0.15) 0%, rgba(255,248,240,0.5) 30%, rgba(254,243,230,0.4) 70%, rgba(249,228,228,0.3) 100%)",
      }}
    >
      {/* Warm sunset gradient overlay */}
      <motion.div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            "radial-gradient(ellipse at 70% 50%, rgba(212,168,83,0.08) 0%, transparent 60%)",
          y: parallaxY,
        }}
      />

      {/* Floating decorations */}
      <motion.span
        className="absolute text-3xl top-16 right-[20%] opacity-15"
        animate={{
          y: [0, -20, 0],
          rotate: [0, 15, 0],
        }}
        transition={{ duration: 7, repeat: Infinity }}
      >
        🌟
      </motion.span>
      <motion.span
        className="absolute text-2xl bottom-20 left-[15%] opacity-10"
        animate={{
          y: [0, 15, 0],
          x: [0, 10, 0],
        }}
        transition={{ duration: 9, repeat: Infinity }}
      >
        🦋
      </motion.span>

      <div className="relative z-10 max-w-5xl mx-auto px-6">
        {/* Section heading with typing effect */}
        <motion.div
          className="text-center mb-14 md:mb-20"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
        >
          <motion.span
            className="font-script text-xl md:text-2xl text-gold inline-block mb-3"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
          >
            Looking Ahead
          </motion.span>
          <h2 className="font-serif text-3xl md:text-5xl font-bold text-charcoal">
            What I Dream For Us
          </h2>
          <motion.div
            className="w-16 h-0.5 bg-gradient-to-r from-gold to-gold-light mx-auto mt-4"
            initial={{ width: 0 }}
            whileInView={{ width: 64 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.3 }}
          />
        </motion.div>

        {/* Dream cards grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 md:gap-6">
          {config.dreams.map((dream, index) => (
            <GlassCard
              key={index}
              delay={index * 0.15}
              className="relative overflow-hidden"
            >
              {/* Background gradient per card */}
              <div
                className="absolute inset-0 opacity-50 rounded-3xl"
                style={{
                  background: DREAM_BACKGROUNDS[index % DREAM_BACKGROUNDS.length],
                }}
              />

              <div className="relative z-10 text-center py-4 md:py-6">
                {/* Animated icon */}
                <motion.span
                  className="text-4xl md:text-5xl inline-block mb-4"
                  whileInView={{
                    scale: [0, 1.2, 1],
                    rotate: [0, 10, 0],
                  }}
                  viewport={{ once: true }}
                  transition={{
                    duration: 0.8,
                    delay: 0.3 + index * 0.1,
                    ease: [0.25, 0.46, 0.45, 0.94],
                  }}
                >
                  {dream.icon}
                </motion.span>

                {/* Dream title */}
                <h3 className="font-serif text-xl md:text-2xl font-semibold text-charcoal mb-2">
                  {dream.title}
                </h3>

                {/* Dream description */}
                <p className="font-sans text-sm md:text-base text-charcoal-light/70 leading-relaxed max-w-xs mx-auto">
                  {dream.description}
                </p>
              </div>
            </GlassCard>
          ))}
        </div>

        {/* Bottom romantic note */}
        <motion.p
          className="text-center font-script text-lg md:text-xl text-rose mt-12 md:mt-16"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.5 }}
        >
          Every dream is sweeter because you're in it ♡
        </motion.p>
      </div>
    </section>
  );
}
