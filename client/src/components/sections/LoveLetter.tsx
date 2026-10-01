/**
 * LoveLetter — the letter, and the thing the whole site was building to.
 *
 * One continuous motion: the flap lifts, the sheet rises out of the
 * envelope, the envelope recedes to a small artifact above it, and the
 * paragraphs settle in one after another. Toggling it shut reverses
 * the whole thing, because being able to fold it back up is part of the
 * pleasure of a physical object.
 *
 * The reading column is deliberately narrow and centred here. This is
 * the one place in the experience where a centred column is correct.
 */
import { useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { config } from "../../config/content";
import SectionShell from "../ui/SectionShell";
import Envelope from "../ui/Envelope";
import WaxSeal from "../ui/WaxSeal";
import Flowers from "../ui/Flowers";
import Stars from "../ui/Stars";

const EASE = [0.16, 1, 0.3, 1] as const;

export default function LoveLetter() {
  const reduced = useReducedMotion();
  const [open, setOpen] = useState(false);
  const monogram = config.herName.charAt(0).toUpperCase();

  return (
    <SectionShell
      id="letter"
      tone="night"
      align="center"
      eyebrow={config.letterSection.eyebrow}
      title={config.letterSection.title}
      lede={config.letterSection.lede}
      spacing="tall"
    >
      <Stars count={46} />
      <Flowers variant="rose" tone="night" className="-top-14 -left-12 w-48 opacity-40 sm:w-56" />
      <Flowers variant="sprig" tone="night" className="-right-12 -bottom-10 w-44 opacity-35 sm:w-52" />

      {/* Warm light on the night background, so the paper reads as paper. */}
      <div
        aria-hidden="true"
        data-decorative="true"
        className="aura top-6 left-1/2 h-[34rem] w-[34rem] -translate-x-1/2 opacity-70"
        style={{
          background:
            "radial-gradient(circle, rgba(214,178,120,0.16) 0%, rgba(214,178,120,0) 68%)",
        }}
      />

      <div className="relative z-10 mx-auto max-w-xl">
        {/* ── The envelope ── */}
        <motion.div
          animate={{
            opacity: open ? 0.4 : 1,
            scale: open && !reduced ? 0.84 : 1,
          }}
          transition={{ duration: 1, ease: EASE }}
        >
          <Envelope
            open={open}
            onToggle={() => setOpen((value) => !value)}
            monogram={monogram}
            openLabel={config.letterSection.openLabel}
            closeLabel={config.letterSection.reseal}
          />
          <p className="eyebrow mt-6 text-center text-porcelain/35">
            {open ? config.letterSection.reseal : `${config.letterSection.sealedFor} ${config.herName}`}
          </p>
        </motion.div>

        {/* ── The sheet ── */}
        <motion.div
          className="overflow-hidden"
          initial={false}
          animate={{ height: open ? "auto" : 0, opacity: open ? 1 : 0 }}
          transition={{
            duration: reduced ? 0.15 : open ? 1.15 : 0.55,
            ease: EASE,
          }}
        >
          <motion.article
            className="prose-letter relative mt-14 rounded-[4px] px-6 py-10 text-ink-text sm:px-12 sm:py-14"
            style={{
              background:
                "linear-gradient(178deg, #FDFAF6 0%, #F5EBE1 100%)",
              boxShadow:
                "0 40px 80px -48px rgba(0,0,0,0.75), 0 1px 0 rgba(255,255,255,0.7) inset",
            }}
            initial={
              reduced
                ? { y: 0, scale: 1, opacity: 0 }
                : { y: "-38%", scale: 0.94, opacity: 0, filter: "blur(8px)" }
            }
            animate={{ y: 0, scale: 1, opacity: 1, filter: "blur(0px)" }}
            transition={{ duration: reduced ? 0.2 : 1.25, ease: EASE, delay: 0.12 }}
          >
            {/* Fold creases, and the seal that held it shut. */}
            <span
              aria-hidden="true"
              className="pointer-events-none absolute inset-x-0 top-1/3 h-px bg-ink-text/[0.06]"
            />
            <span
              aria-hidden="true"
              className="pointer-events-none absolute inset-x-0 top-2/3 h-px bg-ink-text/[0.06]"
            />

            <div className="relative flex justify-center">
              <WaxSeal broken monogram={monogram} size={62} />
            </div>

            <p className="hand relative mt-7 text-center text-[1.75rem] text-rose-deep">
              {config.letter.salutation}
            </p>

            <div className="relative mt-8 space-y-6">
              {config.letter.bodyParagraphs.map((paragraph, index) => (
                <motion.p
                  key={paragraph.slice(0, 24)}
                  initial={{ opacity: 0, y: reduced ? 0 : 16 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, amount: 0.4 }}
                  transition={{
                    duration: 0.9,
                    delay: reduced ? 0 : 0.18 + index * 0.12,
                    ease: EASE,
                  }}
                >
                  {paragraph}
                </motion.p>
              ))}
            </div>

            <motion.div
              className="relative mt-10 border-t border-ink-text/10 pt-8"
              initial={{ opacity: 0, y: reduced ? 0 : 14 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.6 }}
              transition={{ duration: 0.9, delay: reduced ? 0 : 0.7, ease: EASE }}
            >
              <p className="text-[0.9375rem] text-muted italic">
                {config.letter.signoff}
              </p>
              <p className="hand mt-3 text-[1.875rem] text-rose-deep">
                {config.letter.signature}
              </p>
            </motion.div>
          </motion.article>
        </motion.div>
      </div>

      {/* ── Fold it back up, as a real control under the sheet ── */}
      <AnimatePresence>
        {open && (
          <motion.button
            type="button"
            onClick={() => setOpen(false)}
            className="focus-inset relative z-10 mt-8 min-h-11 cursor-pointer rounded-full px-5 text-[0.625rem] font-medium tracking-[0.18em] text-porcelain/40 uppercase transition-colors duration-500 hover:text-brass-light"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            {config.letterSection.reseal}
          </motion.button>
        )}
      </AnimatePresence>
    </SectionShell>
  );
}
