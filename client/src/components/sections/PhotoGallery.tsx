/**
 * PhotoGallery — The visual star of the middle.
 *
 * Keepsake scrapbook presentation: larger staggered photo prints with
 * realistic washi-tape corners, generous captions, full lightbox preview,
 * and warm personal quotes & reflections below.
 */
import { useState } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { config } from "../../config/content";
import SectionShell from "../ui/SectionShell";
import PhotoPlaceholder from "../ui/PhotoPlaceholder";
import Lightbox from "../ui/Lightbox";
import Flowers from "../ui/Flowers";

/** Staggered offsets for the 4 prints to read as a curated keepsake album. */
const PLACEMENT: Array<{
  cols: string;
  aspect: string;
  shift: string;
  rotate: number;
  tape: "top-left-bottom-right" | "top-right-bottom-left" | "top-both" | "corners";
}> = [
  { cols: "lg:col-span-6 lg:col-start-1", aspect: "4 / 5", shift: "lg:mt-4", rotate: -1.5, tape: "top-left-bottom-right" },
  { cols: "lg:col-span-5 lg:col-start-8", aspect: "3 / 4", shift: "lg:mt-16", rotate: 2.0, tape: "top-right-bottom-left" },
  { cols: "lg:col-span-5 lg:col-start-1", aspect: "3 / 4", shift: "lg:mt-12 lg:ml-6", rotate: 1.6, tape: "top-right-bottom-left" },
  { cols: "lg:col-span-6 lg:col-start-7", aspect: "4 / 5", shift: "lg:-mt-6", rotate: -1.8, tape: "top-left-bottom-right" },
];

const EASE = [0.16, 1, 0.3, 1] as const;
const PHOTO_COUNT = Math.min(4, config.timelineMoments.length);

export default function PhotoGallery() {
  const reduced = useReducedMotion();
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);

  const shown = config.timelineMoments.slice(0, PHOTO_COUNT);

  return (
    <SectionShell
      id="photos"
      tone="light"
      eyebrow={config.gallery.eyebrow}
      title={config.gallery.title}
      lede={config.gallery.lede}
      spacing="tall"
      className="relative"
    >
      <Flowers variant="cluster" className="-right-8 -bottom-6 w-52 opacity-60 sm:w-64" />
      <Flowers variant="sprig" className="-left-6 top-16 w-40 opacity-45 sm:w-48" />

      <div className="mt-8 lg:mt-14">
        {/* ── Staggered Album Prints Grid ── */}
        <div className="grid grid-cols-1 items-start gap-8 sm:grid-cols-2 lg:grid-cols-12 lg:gap-10">
          {shown.map((moment, index) => {
            const place = PLACEMENT[index % PLACEMENT.length];
            return (
              <motion.button
                key={moment.image}
                type="button"
                onClick={() => setLightboxIndex(index)}
                aria-label={`Open photograph ${index + 1}: ${moment.title}`}
                className={`focus-inset group relative cursor-pointer text-left ${place.cols} ${place.shift}`}
                initial={{ opacity: 0, y: reduced ? 0 : 36, rotate: reduced ? 0 : place.rotate + 2 }}
                whileInView={{
                  opacity: 1,
                  y: 0,
                  rotate: reduced ? 0 : place.rotate,
                }}
                viewport={{ once: true, amount: 0.25 }}
                transition={{
                  duration: 1,
                  delay: (index % 2) * 0.15,
                  ease: EASE,
                }}
                whileHover={reduced ? undefined : { rotate: 0, y: -8, scale: 1.025 }}
              >
                {/* Physical Print Mount with White Paper Border */}
                <div className="relative rounded-[3px] bg-[#fbf9f5] p-3 pb-5 shadow-[0_12px_30px_-10px_rgba(43,33,41,0.22),0_2px_4px_rgba(0,0,0,0.05)] ring-1 ring-black/5 transition-shadow duration-500 group-hover:shadow-[0_20px_40px_-12px_rgba(43,33,41,0.32)]">
                  {/* Tape Corners on the print */}
                  <TapeCorner position="top-left" />
                  <TapeCorner position="top-right" />

                  {/* Photo Frame */}
                  <div className="zoom-frame relative overflow-hidden rounded-[2px]">
                    <PhotoPlaceholder
                      src={moment.image}
                      alt={moment.title}
                      aspectRatio={place.aspect}
                      eager={index < 2}
                      style={{ borderRadius: 2 }}
                    />
                    {/* Chapter Tag Ribbon */}
                    <span className="pointer-events-none absolute top-3 left-3 rounded-full bg-porcelain/90 px-3 py-1 text-[0.625rem] font-medium tracking-[0.2em] text-ink-text/80 uppercase shadow-sm backdrop-blur-sm">
                      {moment.tag}
                    </span>
                  </div>

                  {/* Caption on the Polaroid-style bottom border */}
                  <div className="mt-3.5 px-1">
                    <div className="flex items-baseline justify-between gap-2">
                      <p className="font-display text-[1.25rem] leading-snug font-medium text-ink-text">
                        {moment.title}
                      </p>
                      <p className="eyebrow text-rose whitespace-nowrap">{moment.date}</p>
                    </div>
                    <p className="mt-1.5 text-[0.875rem] leading-relaxed text-muted line-clamp-2">
                      {moment.description}
                    </p>
                  </div>
                </div>
              </motion.button>
            );
          })}
        </div>

        {/* ── Personal Reflections & Warm Quotes ── */}
        <motion.div
          className="mx-auto mt-24 max-w-3xl text-center lg:mt-32"
          initial={{ opacity: 0, y: reduced ? 0 : 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.4 }}
          transition={{ duration: 1, ease: EASE }}
        >
          {/* Decorative Pressed Leaf / Flourish */}
          <span
            aria-hidden="true"
            className="mx-auto mb-6 block font-display text-5xl leading-none text-rose/30 italic select-none"
          >
            ❦
          </span>

          <div className="space-y-6">
            {config.gallery.quotes.map((quote, index) => (
              <motion.blockquote
                key={quote}
                className="font-display text-[clamp(1.45rem,1.1rem+1.6vw,2.3rem)] leading-[1.32] text-balance text-ink-text italic"
                initial={{ opacity: 0, y: reduced ? 0 : 14 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.4 }}
                transition={{ duration: 0.9, delay: index * 0.12, ease: EASE }}
              >
                "{quote}"
              </motion.blockquote>
            ))}
          </div>

          <motion.div
            className="mx-auto mt-12 max-w-xl space-y-4"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true, amount: 0.4 }}
            transition={{ duration: 1, delay: 0.4 }}
          >
            {config.gallery.lines.map((line) => (
              <p
                key={line}
                className="font-serif text-[1.05rem] leading-7 text-muted sm:text-lg"
              >
                {line}
              </p>
            ))}
          </motion.div>

          <motion.p
            className="mt-8 font-display text-[1.2rem] text-rose-deep italic"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true, amount: 0.4 }}
            transition={{ duration: 1, delay: 0.65 }}
          >
            {config.gallery.signoff}
          </motion.p>

          <div className="mt-12 flex items-center justify-center gap-4">
            <span className="h-px w-12 bg-rose/30" />
            <p className="eyebrow text-muted-light">
              {config.gallery.hint} · {PHOTO_COUNT} Photographs
            </p>
            <span className="h-px w-12 bg-rose/30" />
          </div>
        </motion.div>
      </div>

      <Lightbox
        memories={config.timelineMoments.map((moment) => ({
          image: moment.image,
          caption: moment.title,
          date: moment.date,
          tag: moment.tag,
        }))}
        index={lightboxIndex}
        onClose={() => setLightboxIndex(null)}
        onNavigate={setLightboxIndex}
        labels={{
          close: config.gallery.closeLabel,
          previous: config.gallery.prevLabel,
          next: config.gallery.nextLabel,
        }}
      />
    </SectionShell>
  );
}

/** Realistic washi tape strip mounted on the corners of prints */
function TapeCorner({ position }: { position: "top-left" | "top-right" }) {
  const isLeft = position === "top-left";
  return (
    <div
      aria-hidden="true"
      className={`pointer-events-none absolute -top-2.5 z-20 h-5 w-14 opacity-80 backdrop-blur-[1px] shadow-sm ${
        isLeft ? "-left-4 -rotate-[28deg]" : "-right-4 rotate-[28deg]"
      }`}
      style={{
        background: "rgba(224, 212, 192, 0.72)",
        borderLeft: "1px dashed rgba(255,255,255,0.6)",
        borderRight: "1px dashed rgba(255,255,255,0.6)",
        boxShadow: "0 1px 3px rgba(0,0,0,0.12)",
      }}
    />
  );
}