/**
 * TheYearAhead.tsx — Section cheering on her goals and aspirations for the year ahead
 */
import { motion } from "framer-motion";
import { config } from "../../config/content";

export default function TheYearAhead() {
  return (
    <section
      id="year-ahead"
      className="py-20 md:py-28 px-6 bg-gradient-to-b from-[#FEFBF6] to-[#F5EFE6] relative overflow-hidden"
    >
      <div className="max-w-4xl mx-auto">
        <motion.div
          className="text-center mb-12 md:mb-16"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <span className="inline-block px-3 py-1 rounded-full text-xs font-medium tracking-wider uppercase bg-amber-100 text-amber-800 border border-amber-200/60 mb-3">
            The Next Chapter 🚀
          </span>
          <h2 className="font-serif text-3xl md:text-4xl font-bold text-stone-800">
            Wishes For The Year Ahead
          </h2>
          <p className="font-sans text-stone-600 text-sm md:text-base max-w-md mx-auto mt-2">
            Here's to the new goals you conquer, the adventures you embark on, and the happiness that follows you.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {config.yearAhead.map((item, index) => (
            <motion.div
              key={item.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              whileHover={{ y: -3 }}
              className="bg-white/90 backdrop-blur-md rounded-2xl p-6 border border-stone-200/80 shadow-xs flex items-start gap-4 hover:shadow-md transition-all"
            >
              <div className="text-3xl p-3 rounded-xl bg-amber-50 border border-amber-200/50 flex-shrink-0">
                {item.icon}
              </div>
              <div>
                <h3 className="font-serif text-lg font-bold text-stone-800 mb-1.5">
                  {item.title}
                </h3>
                <p className="font-sans text-stone-600 text-sm leading-relaxed">
                  {item.description}
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
