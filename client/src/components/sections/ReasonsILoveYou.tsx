/**
 * ReasonsILoveYou — Scroll-triggered animated list that reveals
 * reasons one by one with staggered entrance animations
 */
import { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { config } from "../../config/content";

export default function ReasonsILoveYou() {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });

  const bgY = useTransform(scrollYProgress, [0, 1], [0, -50]);

  return (
    <section
      id="reasons"
      ref={ref}
      className="relative py-20 md:py-32 overflow-hidden"
      style={{
        background:
          "linear-gradient(180deg, rgba(255,248,240,0.3) 0%, rgba(254,251,246,1) 20%, rgba(254,251,246,1) 80%, rgba(249,228,228,0.3) 100%)",
      }}
    >
      {/* Animated gradient blobs */}
      <motion.div
        className="gradient-blob w-96 h-96"
        style={{
          background:
            "radial-gradient(circle, rgba(232,160,191,0.1) 0%, transparent 70%)",
          top: "10%",
          left: "-15%",
          position: "absolute",
          y: bgY,
        }}
      />
      <motion.div
        className="gradient-blob w-72 h-72"
        style={{
          background:
            "radial-gradient(circle, rgba(212,184,224,0.1) 0%, transparent 70%)",
          bottom: "10%",
          right: "-10%",
          position: "absolute",
        }}
        animate={{
          scale: [1, 1.15, 1],
          rotate: [0, 5, 0],
        }}
        transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
      />

      <div className="relative z-10 max-w-3xl mx-auto px-6">
        {/* Section heading */}
        <motion.div
          className="text-center mb-14 md:mb-20"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
        >
          <motion.span
            className="font-script text-xl md:text-2xl text-rose inline-block mb-3"
            initial={{ opacity: 0, scale: 0.8 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
          >
            From My Heart
          </motion.span>
          <h2 className="font-serif text-3xl md:text-5xl font-bold text-charcoal mb-2">
            Reasons I Love You
          </h2>
          <motion.p
            className="font-sans text-charcoal-light/60 text-sm md:text-base"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.3 }}
          >
            {config.reasons.length} reasons (and counting...)
          </motion.p>
          <motion.div
            className="w-16 h-0.5 bg-gradient-to-r from-rose-deep to-rose mx-auto mt-4"
            initial={{ width: 0 }}
            whileInView={{ width: 64 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.3 }}
          />
        </motion.div>

        {/* Reasons list */}
        <div className="space-y-4 md:space-y-5">
          {config.reasons.map((reason, index) => (
            <motion.div
              key={index}
              className="flex items-start gap-4 group"
              initial={{ opacity: 0, x: index % 2 === 0 ? -30 : 30, y: 10 }}
              whileInView={{ opacity: 1, x: 0, y: 0 }}
              viewport={{ once: true, margin: "-30px" }}
              transition={{
                duration: 0.6,
                delay: Math.min(index * 0.06, 0.5),
                ease: [0.25, 0.46, 0.45, 0.94],
              }}
            >
              {/* Number badge */}
              <motion.div
                className="flex-none w-10 h-10 md:w-11 md:h-11 rounded-full flex items-center justify-center font-serif text-sm font-semibold"
                style={{
                  background:
                    "linear-gradient(135deg, rgba(212,168,83,0.15), rgba(232,160,191,0.15))",
                  color: "#C45B7C",
                  border: "1px solid rgba(212,168,83,0.2)",
                }}
                whileHover={{ scale: 1.15, rotate: 5 }}
              >
                {index + 1}
              </motion.div>

              {/* Reason text */}
              <motion.div
                className="flex-1 glass-card px-5 py-3.5 md:px-6 md:py-4"
                whileHover={{
                  boxShadow: "0 8px 30px rgba(232, 160, 191, 0.2)",
                  borderColor: "rgba(232, 160, 191, 0.3)",
                }}
                transition={{ duration: 0.3 }}
              >
                <p className="font-sans text-sm md:text-base text-charcoal/90 leading-relaxed">
                  {reason}
                </p>
              </motion.div>

              {/* Heart icon */}
              <motion.span
                className="flex-none text-base md:text-lg opacity-0 group-hover:opacity-100 transition-opacity mt-3"
                animate={{
                  scale: [1, 1.2, 1],
                }}
                transition={{ duration: 1.5, repeat: Infinity }}
              >
                💗
              </motion.span>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
