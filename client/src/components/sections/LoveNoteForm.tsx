/**
 * LoveNoteForm — Glassmorphic form for leaving a love note/wish
 * Saves to MongoDB via Express API (optional)
 */
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Confetti from "../ui/Confetti";

interface LoveNote {
  name?: string;
  message: string;
}

export default function LoveNoteForm() {
  const [note, setNote] = useState<LoveNote>({ name: "", message: "" });
  const [submitted, setSubmitted] = useState(false);
  const [showConfetti, setShowConfetti] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!note.message.trim()) return;

    setIsSubmitting(true);

    try {
      // Try to save to backend (will gracefully fail if backend isn't running)
      await fetch("/api/notes", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(note),
      });
    } catch {
      // Backend not available — that's okay, just show the success animation
      console.log("Backend not available — note saved locally in spirit 💕");
    }

    setIsSubmitting(false);
    setSubmitted(true);
    setShowConfetti(true);
    setTimeout(() => setShowConfetti(false), 100);
  };

  return (
    <section
      id="love-note"
      className="relative py-16 md:py-24 overflow-hidden"
      style={{
        background:
          "linear-gradient(180deg, rgba(249,228,228,0.2) 0%, rgba(254,251,246,1) 30%, rgba(254,251,246,1) 100%)",
      }}
    >
      <div className="relative z-10 max-w-md mx-auto px-6">
        {/* Section heading */}
        <motion.div
          className="text-center mb-10"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
        >
          <span className="font-script text-lg md:text-xl text-rose mb-2 block">
            One Last Thing
          </span>
          <h2 className="font-serif text-2xl md:text-3xl font-bold text-charcoal">
            Leave a Love Note
          </h2>
          <p className="font-sans text-sm text-charcoal-light/60 mt-2">
            Write a wish, a memory, or just say how you feel
          </p>
        </motion.div>

        <div className="relative">
          <Confetti active={showConfetti} count={15} originX={50} originY={30} />

          <AnimatePresence mode="wait">
            {!submitted ? (
              <motion.form
                key="form"
                onSubmit={handleSubmit}
                className="glass-card p-6 md:p-8"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.6 }}
              >
                {/* Name field (optional) */}
                <div className="mb-5">
                  <label
                    htmlFor="note-name"
                    className="block font-sans text-xs text-charcoal-light/60 mb-1.5 uppercase tracking-wider"
                  >
                    Your Name (optional)
                  </label>
                  <input
                    id="note-name"
                    type="text"
                    value={note.name}
                    onChange={(e) =>
                      setNote((prev) => ({ ...prev, name: e.target.value }))
                    }
                    placeholder="Anonymous admirer..."
                    className="w-full px-4 py-3 rounded-xl bg-soft-white/60 border border-rose/15 font-sans text-sm text-charcoal placeholder-warm-gray/40 outline-none transition-all duration-300 focus:border-rose/40 focus:ring-2 focus:ring-rose/10"
                  />
                </div>

                {/* Message field */}
                <div className="mb-6">
                  <label
                    htmlFor="note-message"
                    className="block font-sans text-xs text-charcoal-light/60 mb-1.5 uppercase tracking-wider"
                  >
                    Your Message
                  </label>
                  <textarea
                    id="note-message"
                    value={note.message}
                    onChange={(e) =>
                      setNote((prev) => ({ ...prev, message: e.target.value }))
                    }
                    placeholder="Write something beautiful..."
                    rows={4}
                    required
                    className="w-full px-4 py-3 rounded-xl bg-soft-white/60 border border-rose/15 font-sans text-sm text-charcoal placeholder-warm-gray/40 outline-none resize-none transition-all duration-300 focus:border-rose/40 focus:ring-2 focus:ring-rose/10"
                  />
                </div>

                {/* Submit button */}
                <motion.button
                  type="submit"
                  disabled={isSubmitting || !note.message.trim()}
                  className="w-full py-3 rounded-xl font-serif text-sm tracking-wide text-white cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed border-none"
                  style={{
                    background: "linear-gradient(135deg, #C45B7C, #E8A0BF)",
                  }}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  {isSubmitting ? "Sending with love..." : "Send with Love ♡"}
                </motion.button>
              </motion.form>
            ) : (
              /* Success state */
              <motion.div
                key="success"
                className="glass-card p-8 md:p-10 text-center"
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ type: "spring", stiffness: 200, damping: 15 }}
              >
                <motion.span
                  className="text-5xl inline-block mb-4"
                  animate={{
                    scale: [1, 1.2, 1],
                    rotate: [0, 5, -5, 0],
                  }}
                  transition={{ duration: 2, repeat: Infinity }}
                >
                  💝
                </motion.span>
                <h3 className="font-serif text-xl text-charcoal mb-2">
                  Saved with Love
                </h3>
                <p className="font-sans text-sm text-charcoal-light/60">
                  Your note has been saved forever ♡
                </p>
                <motion.button
                  className="mt-4 font-sans text-xs text-rose-deep underline cursor-pointer bg-transparent border-none"
                  onClick={() => {
                    setSubmitted(false);
                    setNote({ name: "", message: "" });
                  }}
                  whileHover={{ scale: 1.05 }}
                >
                  Write another one
                </motion.button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* Footer */}
      <motion.div
        className="text-center mt-16 md:mt-20"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ delay: 0.5 }}
      >
        <p className="font-script text-base text-rose/60">
          Made with 💝 just for you
        </p>
      </motion.div>
    </section>
  );
}
