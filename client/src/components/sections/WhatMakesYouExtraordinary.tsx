/**
 * WhatMakesYouExtraordinary.tsx — Editorial Cards celebrating her strengths & personality
 * Replaces cheesy romantic lists with mature admiration and appreciation of who she is.
 */
import { useState } from "react";
import { motion } from "framer-motion";
import { config } from "../../config/content";

export default function WhatMakesYouExtraordinary() {
  const [activeFilter, setActiveFilter] = useState<string>("All");

  const badges = ["All", ...Array.from(new Set(config.traits.map((t) => t.badge)))];

  const filteredTraits =
    activeFilter === "All"
      ? config.traits
      : config.traits.filter((t) => t.badge === activeFilter);

  return (
    <section
      id="extraordinary"
      className="py-20 md:py-28 px-6 bg-[#FEFBF6] relative"
    >
      <div className="max-w-5xl mx-auto">
        {/* Section Header */}
        <motion.div
          className="text-center mb-10"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <span className="inline-block px-3 py-1 rounded-full text-xs font-medium tracking-wider uppercase bg-stone-100 text-stone-700 border border-stone-200 mb-3">
            In A League Of Your Own ✨
          </span>
          <h2 className="font-serif text-3xl md:text-4xl font-bold text-stone-800">
            What Makes You Extraordinary
          </h2>
          <p className="font-sans text-stone-600 text-sm md:text-base max-w-lg mx-auto mt-2">
            Just a few of the countless qualities that set you apart and make being by your side an absolute honor.
          </p>
        </motion.div>

        {/* Filter Pills */}
        <div className="flex flex-wrap items-center justify-center gap-2 mb-10">
          {badges.map((badge) => (
            <button
              key={badge}
              onClick={() => setActiveFilter(badge)}
              className={`px-4 py-1.5 rounded-full text-xs font-medium transition-all duration-200 cursor-pointer border ${
                activeFilter === badge
                  ? "bg-stone-900 text-amber-50 border-stone-900 shadow-xs"
                  : "bg-white text-stone-600 border-stone-200 hover:border-stone-400"
              }`}
            >
              {badge}
            </button>
          ))}
        </div>

        {/* Traits Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
          {filteredTraits.map((trait, index) => (
            <motion.div
              key={trait.title}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: index * 0.05 }}
              whileHover={{ y: -4, transition: { duration: 0.2 } }}
              className="bg-white/80 backdrop-blur-xs rounded-xl p-5 border border-stone-200/80 shadow-xs hover:shadow-md transition-all flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between mb-3">
                  <span className="text-[10px] font-mono tracking-wider uppercase font-semibold text-amber-800 bg-amber-50 px-2 py-0.5 rounded border border-amber-200/60">
                    {trait.badge}
                  </span>
                  <span className="text-stone-300 font-serif text-sm">
                    0{index + 1}
                  </span>
                </div>
                <h3 className="font-serif text-base font-bold text-stone-800 mb-2">
                  {trait.title}
                </h3>
                <p className="font-sans text-xs text-stone-600 leading-relaxed">
                  {trait.desc}
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
