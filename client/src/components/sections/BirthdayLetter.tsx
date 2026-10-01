/**
 * BirthdayLetter.tsx — Thoughtful, mature birthday letter from her boyfriend
 * Styled like an elegant editorial letter / parchment card.
 */
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { config } from "../../config/content";

export default function BirthdayLetter() {
  const [opened, setOpened] = useState(false);

  return (
    <section
      id="letter"
      className="py-20 md:py-28 px-6 bg-[#FAF7F2] relative overflow-hidden"
    >
      <div className="max-w-2xl mx-auto">
        <motion.div
          className="text-center mb-8"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <span className="inline-block px-3 py-1 rounded-full text-xs font-medium tracking-wider uppercase bg-amber-100 text-amber-800 border border-amber-200/60 mb-3">
            A Birthday Note ✉️
          </span>
          <h2 className="font-serif text-3xl md:text-4xl font-bold text-stone-800">
            From My Corner To Yours
          </h2>
        </motion.div>

        {/* The Envelope / Letter Container */}
        <div className="relative">
          <AnimatePresence mode="wait">
            {!opened ? (
              <motion.div
                key="sealed"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="bg-white rounded-2xl p-8 md:p-12 border border-stone-200 shadow-md text-center max-w-lg mx-auto"
              >
                <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-amber-50 border border-amber-200 flex items-center justify-center text-3xl shadow-xs">
                  💌
                </div>
                <h3 className="font-serif text-xl font-bold text-stone-800 mb-2">
                  For {config.herName}
                </h3>
                <p className="font-sans text-stone-500 text-xs md:text-sm mb-6">
                  A personal note written for your birthday. Tap below to break the wax seal.
                </p>
                <motion.button
                  onClick={() => setOpened(true)}
                  className="px-6 py-3 rounded-full text-xs font-serif tracking-widest uppercase font-semibold text-white shadow-sm cursor-pointer border-none"
                  style={{
                    background: "linear-gradient(135deg, #78350F, #92400E)",
                  }}
                  whileHover={{ scale: 1.04 }}
                  whileTap={{ scale: 0.96 }}
                >
                  Break The Seal & Read
                </motion.button>
              </motion.div>
            ) : (
              <motion.div
                key="opened-letter"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.7 }}
                className="bg-[#FFFDF9] rounded-2xl p-8 md:p-14 border border-amber-200/70 shadow-xl relative"
              >
                {/* Subtle watermark / stamp */}
                <div className="absolute top-6 right-8 text-xs font-mono tracking-widest text-amber-800/40 uppercase border border-amber-300/40 px-2 py-1 rounded">
                  {config.chapterTitle || "Birthday Edition"}
                </div>

                <div className="font-serif text-xl font-semibold text-stone-800 mb-6">
                  {config.letter.salutation} {config.herName},
                </div>

                <div className="space-y-4 font-sans text-stone-700 text-sm md:text-base leading-relaxed">
                  {config.letter.bodyParagraphs.map((para, i) => (
                    <p key={i}>{para}</p>
                  ))}
                </div>

                <div className="mt-8 pt-6 border-t border-stone-200/60">
                  <p className="font-sans text-xs text-stone-500 mb-1">
                    {config.letter.signoff}
                  </p>
                  <p className="font-script text-xl text-amber-900 font-semibold">
                    {config.letter.signature}
                  </p>
                </div>

                <div className="mt-6 text-center">
                  <button
                    onClick={() => setOpened(false)}
                    className="text-xs font-sans text-stone-400 hover:text-stone-600 underline cursor-pointer bg-transparent border-none"
                  >
                    Reseal Letter
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </section>
  );
}
