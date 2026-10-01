/**
 * LoadingScreen — Soft, dreamy loading animation
 * Shows a pulsing heart with her name fading in letter-by-letter
 * Auto-transitions out after loading completes
 */
import { motion, AnimatePresence } from "framer-motion";
import { config } from "../../config/content";
import AnimatedText from "../ui/AnimatedText";

interface LoadingScreenProps {
  isLoading: boolean;
}

export default function LoadingScreen({ isLoading }: LoadingScreenProps) {
  return (
    <AnimatePresence>
      {isLoading && (
        <motion.div
          className="fixed inset-0 z-[100] flex flex-col items-center justify-center"
          style={{
            background:
              "radial-gradient(ellipse at center, #FFFDF9 0%, #FAF4EA 50%, #F3E7D5 100%)",
          }}
          exit={{
            opacity: 0,
            scale: 1.05,
            filter: "blur(10px)",
          }}
          transition={{ duration: 1.0, ease: [0.25, 0.46, 0.45, 0.94] }}
        >
          {/* Glowing sparkle badge */}
          <motion.div
            className="w-16 h-16 rounded-2xl bg-amber-100 border border-amber-200/80 flex items-center justify-center text-3xl mb-6 shadow-sm"
            animate={{
              scale: [1, 1.08, 1],
              rotate: [0, 4, -4, 0],
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          >
            🎂
          </motion.div>

          {/* Her name — letter by letter */}
          <div className="font-serif text-3xl md:text-5xl font-bold text-stone-800 mb-3">
            <AnimatedText
              text={config.herName}
              mode="letter"
              delay={0.3}
              staggerDuration={0.08}
            />
          </div>

          {/* Subtitle */}
          <motion.p
            className="font-mono text-xs tracking-widest uppercase text-stone-500"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.2, duration: 0.8 }}
          >
            ✦ Birthday Edition • Loaded With Care ✦
          </motion.p>

          {/* Soft progress dots */}
          <motion.div
            className="flex gap-2 mt-8"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
          >
            {[0, 1, 2].map((i) => (
              <motion.span
                key={i}
                className="w-2 h-2 rounded-full bg-amber-700/60"
                animate={{
                  scale: [1, 1.5, 1],
                  opacity: [0.4, 1, 0.4],
                }}
                transition={{
                  duration: 1,
                  repeat: Infinity,
                  delay: i * 0.2,
                }}
              />
            ))}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
