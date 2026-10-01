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
              "radial-gradient(ellipse at center, #FFF8F0 0%, #F9E4E4 40%, #EDE4F0 80%, #D4B8E0 100%)",
          }}
          exit={{
            opacity: 0,
            scale: 1.1,
            filter: "blur(10px)",
          }}
          transition={{ duration: 1.2, ease: [0.25, 0.46, 0.45, 0.94] }}
        >
          {/* Gradient blobs */}
          <div
            className="gradient-blob w-64 h-64 -top-20 -left-20 animate-drift"
            style={{ background: "rgba(232, 160, 191, 0.2)", position: "absolute" }}
          />
          <div
            className="gradient-blob w-48 h-48 -bottom-10 -right-10 animate-drift"
            style={{
              background: "rgba(212, 184, 224, 0.2)",
              position: "absolute",
              animationDelay: "-3s",
            }}
          />

          {/* Pulsing heart */}
          <motion.div
            className="text-6xl md:text-7xl mb-8"
            animate={{
              scale: [1, 1.2, 1, 1.2, 1],
            }}
            transition={{
              duration: 1.5,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          >
            💝
          </motion.div>

          {/* Her name — letter by letter */}
          <div className="font-serif text-3xl md:text-4xl text-rose-deep mb-4">
            <AnimatedText
              text={config.herName}
              mode="letter"
              delay={0.3}
              staggerDuration={0.08}
            />
          </div>

          {/* Subtitle */}
          <motion.p
            className="font-script text-lg text-warm-gray"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.5, duration: 0.8 }}
          >
            Loading something special...
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
                className="w-2 h-2 rounded-full bg-rose/60"
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
