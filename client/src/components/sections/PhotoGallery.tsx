/**
 * PhotoGallery — Chapter II: The Keepsake Album & Scrapbook.
 *
 * Interactive features:
 * - 3D Flippable Polaroid Prints (tap to flip and read the private note on back)
 * - Washi tape corners with realistic texture & drop shadows
 * - Full-screen Lightbox inspector
 * - Staggered scroll parallax and quotes underneath
 */
import { useState } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { config, type TimelineMoment } from "../../config/content";
import { useChimeSound } from "../../hooks/useChimeSound";
import SectionShell from "../ui/SectionShell";
import PhotoPlaceholder from "../ui/PhotoPlaceholder";
import Lightbox from "../ui/Lightbox";
import Flowers from "../ui/Flowers";

const PLACEMENT: Array<{
  cols: string;
  aspect: string;
  shift: string;
  rotate: number;
}> = [
  { cols: "lg:col-span-6 lg:col-start-1", aspect: "4 / 5", shift: "lg:mt-4", rotate: -1.8 },
  { cols: "lg:col-span-5 lg:col-start-8", aspect: "3 / 4", shift: "lg:mt-16", rotate: 2.2 },
  { cols: "lg:col-span-5 lg:col-start-1", aspect: "3 / 4", shift: "lg:mt-14 lg:ml-6", rotate: 1.5 },
  { cols: "lg:col-span-6 lg:col-start-7", aspect: "4 / 5", shift: "lg:-mt-6", rotate: -2.0 },
];

const EASE = [0.16, 1, 0.3, 1] as const;
const PHOTO_COUNT = Math.min(4, config.timelineMoments.length);

export default function PhotoGallery() {
  const reduced = useReducedMotion();
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);
  const [flippedCards, setFlippedCards] = useState<Record<number, boolean>>({});
  const { playSoftBell } = useChimeSound();

  const shown = config.timelineMoments.slice(0, PHOTO_COUNT);

  const toggleFlip = (index: number) => {
    playSoftBell(1.1);
    setFlippedCards((prev) => ({ ...prev, [index]: !prev[index] }));
  };

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

      {/* Chapter header note */}
      <div className="mb-6 flex items-center justify-between border-b border-ink-text/10 pb-4">
        <div className="flex items-center gap-2">
          <span className="rounded-full bg-rose/10 px-2.5 py-0.5 text-[0.625rem] font-medium tracking-[0.2em] text-rose-deep uppercase">
            {config.gallery.chapter}
          </span>
          <span className="text-[0.8125rem] text-muted-light italic">
            Tap a print to flip & read handwritten notes
          </span>
        </div>
        <span className="eyebrow hidden text-rose-deep sm:inline-block">
          {PHOTO_COUNT} Keepsake Prints
        </span>
      </div>

      <div className="mt-8 lg:mt-12">
        {/* ── 3D Flippable Polaroid Album Grid ── */}
        <div className="grid grid-cols-1 items-start gap-10 sm:grid-cols-2 lg:grid-cols-12 lg:gap-12">
          {shown.map((moment, index) => {
            const place = PLACEMENT[index % PLACEMENT.length];
            const isFlipped = !!flippedCards[index];

            return (
              <div
                key={moment.image}
                className={`relative ${place.cols} ${place.shift}`}
                style={{ perspective: 1200 }}
              >
                <motion.div
                  className="relative cursor-pointer transition-transform duration-300"
                  initial={{ opacity: 0, y: reduced ? 0 : 36, rotate: reduced ? 0 : place.rotate }}
                  whileInView={{
                    opacity: 1,
                    y: 0,
                    rotate: reduced ? 0 : place.rotate,
                  }}
                  viewport={{ once: true, amount: 0.25 }}
                  transition={{ duration: 1, delay: (index % 2) * 0.15, ease: EASE }}
                  whileHover={reduced ? undefined : { y: -8, scale: 1.025 }}
                >
                  {/* Washi Tape Corners */}
                  <TapeCorner position="top-left" />
                  <TapeCorner position="top-right" />

                  {/* 3D Card Container */}
                  <div
                    onClick={() => toggleFlip(index)}
                    className="relative w-full rounded-[4px] transition-transform duration-700"
                    style={{
                      transformStyle: "preserve-3d",
                      transform: isFlipped ? "rotateY(180deg)" : "rotateY(0deg)",
                    }}
                  >
                    {/* ── FRONT FACE: Photograph & Polaroid Frame ── */}
                    <div
                      className="rounded-[4px] bg-[#fdfbf7] p-3.5 pb-6 shadow-[0_14px_34px_-10px_rgba(43,33,41,0.22),0_2px_6px_rgba(0,0,0,0.06)] ring-1 ring-black/5"
                      style={{ backfaceVisibility: "hidden" }}
                    >
                      {/* Photo Frame */}
                      <div className="zoom-frame relative overflow-hidden rounded-[2px]">
                        <PhotoPlaceholder
                          src={moment.image}
                          alt={moment.title}
                          aspectRatio={place.aspect}
                          eager={index < 2}
                          style={{ borderRadius: 2 }}
                        />
                        {/* Chapter Ribbon Tag */}
                        <span className="pointer-events-none absolute top-3 left-3 rounded-full bg-porcelain/90 px-3 py-1 text-[0.625rem] font-medium tracking-[0.2em] text-ink-text/80 uppercase shadow-sm backdrop-blur-sm">
                          {moment.tag}
                        </span>
                      </div>

                      {/* Caption on the bottom border */}
                      <div className="mt-4 px-1">
                        <div className="flex items-baseline justify-between gap-2">
                          <p className="font-display text-[1.25rem] leading-snug font-medium text-ink-text">
                            {moment.title}
                          </p>
                          <p className="eyebrow text-rose whitespace-nowrap">{moment.date}</p>
                        </div>
                        <p className="mt-1.5 text-[0.875rem] leading-relaxed text-muted line-clamp-2">
                          {moment.description}
                        </p>

                        {/* Interactive Buttons Bar */}
                        <div className="mt-3.5 flex items-center justify-between border-t border-ink-text/10 pt-2.5 text-[0.6875rem]">
                          <span className="font-medium text-rose hover:underline">
                            ↺ Tap to flip note
                          </span>
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              setLightboxIndex(index);
                            }}
                            className="font-medium text-muted hover:text-ink-text"
                          >
                            Inspect 🔍
                          </button>
                        </div>
                      </div>
                    </div>

                    {/* ── BACK FACE: Vintage Handwritten Note ── */}
                    <div
                      className="absolute inset-0 flex flex-col justify-between rounded-[4px] border border-amber-900/10 bg-[#faf4ea] p-6 shadow-xl"
                      style={{
                        backfaceVisibility: "hidden",
                        transform: "rotateY(180deg)",
                        backgroundImage:
                          "repeating-linear-gradient(0deg, transparent, transparent 27px, rgba(169, 138, 86, 0.12) 28px)",
                      }}
                    >
                      <div>
                        <div className="flex items-center justify-between border-b border-amber-900/15 pb-2">
                          <span className="eyebrow text-amber-900/60">Keepsake Memory</span>
                          <span className="text-xs font-serif text-amber-900/60">
                            {moment.date}
                          </span>
                        </div>
                        <p className="hand mt-6 text-xl leading-relaxed text-[#4a2e38]">
                          "{moment.backNote}"
                        </p>
                      </div>

                      <div className="flex items-center justify-between pt-4 text-[0.6875rem] text-muted-light">
                        <span>↺ Tap to flip back</span>
                        <span className="text-rose font-script text-base">Always & forever</span>
                      </div>
                    </div>
                  </div>
                </motion.div>
              </div>
            );
          })}
        </div>

        {/* ── Romantic Quotes & Reflections ── */}
        <motion.div
          className="mx-auto mt-24 max-w-3xl text-center lg:mt-32"
          initial={{ opacity: 0, y: reduced ? 0 : 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.4 }}
          transition={{ duration: 1, ease: EASE }}
        >
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