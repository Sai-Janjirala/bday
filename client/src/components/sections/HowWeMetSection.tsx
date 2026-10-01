/**
 * HowWeMetSection — Scroll-triggered timeline with animated milestone cards
 * Cards slide in from alternating sides as the user scrolls
 */
import { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { config } from "../../config/content";
import GlassCard from "../ui/GlassCard";
import PhotoPlaceholder from "../ui/PhotoPlaceholder";

export default function HowWeMetSection() {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });

  // Background color transition as section scrolls in
  const bgOpacity = useTransform(scrollYProgress, [0, 0.2], [0, 1]);

  return (
    <section
      id="how-we-met"
      ref={ref}
      className="relative py-20 md:py-32 overflow-hidden"
    >
      {/* Background transition layer */}
      <motion.div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            "linear-gradient(180deg, rgba(254,251,246,0) 0%, rgba(237,228,240,0.4) 30%, rgba(212,184,224,0.15) 100%)",
          opacity: bgOpacity,
        }}
      />

      {/* Floating decorative elements */}
      <motion.span
        className="absolute text-4xl opacity-20 top-20 left-[10%]"
        animate={{ y: [0, -15, 0], rotate: [0, 10, 0] }}
        transition={{ duration: 5, repeat: Infinity }}
      >
        🌸
      </motion.span>
      <motion.span
        className="absolute text-3xl opacity-15 bottom-32 right-[15%]"
        animate={{ y: [0, 10, 0], rotate: [0, -10, 0] }}
        transition={{ duration: 6, repeat: Infinity, delay: 1 }}
      >
        ✨
      </motion.span>

      <div className="relative z-10 max-w-4xl mx-auto px-6">
        {/* Section heading */}
        <motion.div
          className="text-center mb-16 md:mb-24"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
        >
          <motion.span
            className="inline-block px-3 py-1 rounded-full text-xs font-mono tracking-widest uppercase bg-amber-100 text-amber-800 border border-amber-200 mb-3"
            initial={{ opacity: 0, scale: 0.8 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            Memories & Milestones
          </motion.span>
          <h2 className="font-serif text-3xl md:text-5xl font-bold text-stone-800">
            The Journey So Far
          </h2>
          <motion.div
            className="w-16 h-0.5 bg-gradient-to-r from-amber-600 to-rose-500 mx-auto mt-4"
            initial={{ width: 0 }}
            whileInView={{ width: 64 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.4 }}
          />
        </motion.div>

        {/* Timeline */}
        <div className="relative">
          {/* Vertical line */}
          <motion.div
            className="absolute left-1/2 -translate-x-1/2 w-px top-0 bg-gradient-to-b from-rose/40 via-lavender/30 to-transparent hidden md:block"
            style={{ height: "100%" }}
            initial={{ scaleY: 0 }}
            whileInView={{ scaleY: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 1.5, ease: "easeOut" }}
          />

          {/* Mobile vertical line */}
          <motion.div
            className="absolute left-6 w-px top-0 bg-gradient-to-b from-rose/40 via-lavender/30 to-transparent md:hidden"
            style={{ height: "100%" }}
            initial={{ scaleY: 0 }}
            whileInView={{ scaleY: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 1.5, ease: "easeOut" }}
          />

          {config.timeline.map((item, index) => {
            const isEven = index % 2 === 0;

            return (
              <div
                key={index}
                className={`relative mb-16 md:mb-24 flex items-start
                  ${/* Mobile: always left-aligned with padding */ ""}
                  pl-14 md:pl-0
                  ${/* Desktop: alternating sides */ ""}
                  ${isEven ? "md:flex-row" : "md:flex-row-reverse"}
                `}
              >
                {/* Timeline dot — mobile */}
                <motion.div
                  className="absolute left-4 w-4 h-4 rounded-full bg-rose border-2 border-cream z-10 md:hidden"
                  style={{ top: "8px" }}
                  initial={{ scale: 0 }}
                  whileInView={{ scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.2, type: "spring" }}
                />

                {/* Timeline dot — desktop */}
                <motion.div
                  className="absolute left-1/2 -translate-x-1/2 w-4 h-4 rounded-full bg-rose border-2 border-cream z-10 hidden md:block"
                  style={{ top: "40px" }}
                  initial={{ scale: 0 }}
                  whileInView={{ scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.2, type: "spring" }}
                />

                {/* Card */}
                <div className={`w-full md:w-[45%] ${isEven ? "" : ""}`}>
                  <GlassCard delay={index * 0.15}>
                    {/* Date badge */}
                    <motion.span
                      className="inline-block font-script text-sm text-rose-deep bg-rose/10 px-3 py-1 rounded-full mb-3"
                      initial={{ opacity: 0, x: -10 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      viewport={{ once: true }}
                      transition={{ delay: 0.3 + index * 0.1 }}
                    >
                      {item.date}
                    </motion.span>

                    {/* Photo placeholder */}
                    <PhotoPlaceholder
                      src={item.image}
                      alt={item.title}
                      className="mb-4 w-full"
                      aspectRatio="16/10"
                    />

                    {/* Title */}
                    <h3 className="font-serif text-xl md:text-2xl font-semibold text-charcoal mb-2">
                      {item.title}
                    </h3>

                    {/* Description */}
                    <p className="font-sans text-sm md:text-base text-charcoal-light/80 leading-relaxed">
                      {item.description}
                    </p>
                  </GlassCard>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
