/**
 * LoveNoteForm — Glassmorphic form for leaving a love note/wish
 * Purely frontend with localStorage persistence
 */
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Confetti from "../ui/Confetti";
import { saveLoveNote } from "../../lib/api";
import { config } from "../../config/content";

interface LoveNoteInput {
  name?: string;
  message: string;
}

export default function LoveNoteForm() {
  const [note, setNote] = useState<LoveNoteInput>({ name: "", message: "" });
  const [submitted, setSubmitted] = useState(false);
  const [showConfetti, setShowConfetti] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!note.message.trim()) return;

    setIsSubmitting(true);
    saveLoveNote({
      name: note.name?.trim() || "Anonymous admirer",
      message: note.message.trim(),
    });

    setTimeout(() => {
      setIsSubmitting(false);
      setSubmitted(true);
      setShowConfetti(true);
      setTimeout(() => setShowConfetti(false), 2000);
    }, 400);
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
          <span className="inline-block px-3 py-1 rounded-full text-xs font-mono tracking-widest uppercase bg-amber-100 text-amber-800 border border-amber-200 mb-3">
            One Final Touch 🌟
          </span>
          <h2 className="font-serif text-2xl md:text-3xl font-bold text-stone-800">
            The Birthday Wish Capsule
          </h2>
          <p className="font-sans text-sm text-stone-600 mt-2">
            Leave a wish, an intention, or a note for yourself to open in the year ahead.
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
                  className="w-full py-3 rounded-xl font-serif text-sm tracking-wide text-white cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed border-none shadow-md"
                  style={{
                    background: "linear-gradient(135deg, #78350F, #B45309)",
                  }}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  {isSubmitting ? "Sealing Capsule..." : "Seal In The Capsule ✨"}
                </motion.button>
              </motion.form>
            ) : (
              /* Success state */
              <motion.div
                key="success"
                className="bg-white/90 backdrop-blur-md rounded-2xl border border-amber-200/80 p-8 md:p-10 text-center shadow-lg"
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ type: "spring", stiffness: 200, damping: 15 }}
              >
                <motion.span
                  className="text-5xl inline-block mb-4"
                  animate={{
                    scale: [1, 1.15, 1],
                  }}
                  transition={{ duration: 2, repeat: Infinity }}
                >
                  ✨
                </motion.span>
                <h3 className="font-serif text-xl font-bold text-stone-800 mb-2">
                  Wish Locked & Sealed
                </h3>
                <p className="font-sans text-sm text-stone-600">
                  Your note has been saved into the time capsule. Here's to making it reality.
                </p>
                <motion.button
                  className="mt-5 font-sans text-xs text-amber-800 underline cursor-pointer bg-transparent border-none"
                  onClick={() => {
                    setSubmitted(false);
                    setNote({ name: "", message: "" });
                  }}
                  whileHover={{ scale: 1.05 }}
                >
                  Write another entry
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
        <p className="font-serif text-sm text-stone-500">
          Happy Birthday {config.herName} • Made for your special day 🥂
        </p>
      </motion.div>
    </section>
  );
}
