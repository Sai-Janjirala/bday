/**
 * BirthdayMessage — Full-screen emotional finale section
 * Text appears line-by-line with soft fade and floating hearts rain
 */
import { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { config } from "../../config/content";
import FloatingHearts from "../ui/FloatingHearts";

export default function BirthdayMessage() {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });

  const bgScale = useTransform(scrollYProgress, [0, 0.5], [1.1, 1]);

  return (
    <section
      id="birthday-message"
      ref={ref}
      className="relative min-h-screen flex items-center justify-center overflow-hidden py-20"
      style={{
        background:
          "radial-gradient(ellipse at center, rgba(249,228,228,0.8) 0%, rgba(237,228,240,0.4) 40%, rgba(212,184,224,0.2) 70%, rgba(196,91,124,0.08) 100%)",
      }}
    >
      {/* Hearts rain background */}
      <FloatingHearts count={20} />

      {/* Bokeh/glow effects */}
      <motion.div
        className="absolute inset-0 pointer-events-none"
        style={{ scale: bgScale }}
      >
        {[...Array(8)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute rounded-full"
            style={{
              width: `${30 + Math.random() * 80}px`,
              height: `${30 + Math.random() * 80}px`,
              background: `radial-gradient(circle, ${
                i % 2 === 0
                  ? "rgba(232,160,191,0.15)"
                  : "rgba(212,168,83,0.1)"
              } 0%, transparent 70%)`,
              top: `${Math.random() * 100}%`,
              left: `${Math.random() * 100}%`,
            }}
            animate={{
              opacity: [0.2, 0.5, 0.2],
              scale: [1, 1.3, 1],
            }}
            transition={{
              duration: 4 + Math.random() * 3,
              repeat: Infinity,
              delay: Math.random() * 3,
            }}
          />
        ))}
      </motion.div>

      {/* Message content */}
      <div className="relative z-10 text-center px-6 max-w-2xl mx-auto">
        {/* Decorative heart */}
        <motion.div
          className="text-4xl md:text-5xl mb-8"
          initial={{ opacity: 0, scale: 0 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ type: "spring", stiffness: 200, delay: 0.3 }}
        >
          💌
        </motion.div>

        {/* Birthday message — line by line */}
        <div className="space-y-1 md:space-y-2">
          {config.birthdayMessage.map((line, index) => (
            <motion.p
              key={index}
              className={`
                leading-relaxed
                ${line === "" ? "h-4 md:h-6" : ""}
                ${index === 0
                  ? "font-serif text-2xl md:text-4xl font-bold text-charcoal"
                  : index === config.birthdayMessage.length - 1
                  ? "font-script text-xl md:text-2xl text-rose-deep mt-4"
                  : "font-serif text-base md:text-xl text-charcoal/80 italic"
                }
              `}
              initial={{ opacity: 0, y: 15, filter: "blur(4px)" }}
              whileInView={{ opacity: 1, y: 0, filter: "blur(0px)" }}
              viewport={{ once: true, margin: "-20px" }}
              transition={{
                duration: 0.7,
                delay: Math.min(index * 0.12, 1.5),
                ease: [0.25, 0.46, 0.45, 0.94],
              }}
            >
              {line || "\u00A0"}
            </motion.p>
          ))}
        </div>

        {/* Pulsing "I love you" */}
        <motion.div
          className="mt-12 md:mt-16"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 2 }}
        >
          <motion.p
            className="font-serif text-2xl md:text-3xl font-bold text-gradient-romantic"
            animate={{
              scale: [1, 1.05, 1],
            }}
            transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
          >
            I Love You ♡
          </motion.p>
        </motion.div>
      </div>
    </section>
  );
}
