/**
 * PhotoGallery — a handful of photographs, and the line under them.
 *
 * No rail, no equal grid. A loose arrangement of four frames, each
 * printed at a slightly different size and angle the way real prints
 * get pinned up — staggered down the page so the eye wanders instead
 * of scanning. Tapping any frame opens the full lightbox, where the
 * other two live as well.
 *
 * The quote underneath does the work the old section's caption bar
 * used to: it tells her what these photographs actually are.
 */
import { useState } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { config } from "../../config/content";
import SectionShell from "../ui/SectionShell";
import PhotoPlaceholder from "../ui/PhotoPlaceholder";
import Lightbox from "../ui/Lightbox";
import Flowers from "../ui/Flowers";

/** Desktop offsets so the four prints read as a composition. */
const PLACEMENT: Array<{
  cols: string;
  aspect: string;
  shift: string;
  rotate: number;
}> = [
  { cols: "lg:col-span-4 lg:col-start-1", aspect: "3 / 4", shift: "lg:mt-8", rotate: -1.8 },
  { cols: "lg:col-span-4 lg:col-start-7", aspect: "4 / 5", shift: "lg:-mt-6", rotate: 1.5 },
  { cols: "lg:col-span-3 lg:col-start-1", aspect: "4 / 5", shift: "lg:-mt-4 lg:ml-4", rotate: 1.2 },
  { cols: "lg:col-span-3 lg:col-start-10", aspect: "3 / 4", shift: "lg:mt-14", rotate: -1.4 },
];

const EASE = [0.16, 1, 0.3, 1] as const;

export default function PhotoGallery() {
  const reduced = useReducedMotion();
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);

  const shown = config.memories.slice(0, config.gallery.count);

  return (
    <SectionShell
      id="frames"
      tone="light"
      marker="IV"
      eyebrow={config.gallery.eyebrow}
      title={config.gallery.title}
      lede={config.gallery.lede}
      spacing="tall"
    >
      <Flowers variant="cluster" className="-right-8 -bottom-6 w-44 opacity-60 sm:w-56" />

      <div className="mt-6 lg:mt-12">
        <div className="grid grid-cols-2 items-start gap-4 sm:gap-6 lg:grid-cols-12 lg:gap-8">
          {shown.map((memory, index) => {
            const place = PLACEMENT[index];
            return (
              <motion.button
                key={memory.image}
                type="button"
                onClick={() => setLightboxIndex(index)}
                aria-label={`Open photo ${index + 1}: ${memory.caption}`}
                className={`focus-inset group cursor-pointer text-left lg:block ${place.cols} ${place.shift} ${
                  index % 2 === 0 ? "col-start-auto" : ""
                }`}
                initial={{ opacity: 0, y: reduced ? 0 : 34, rotate: reduced ? 0 : place.rotate + 2 }}
                whileInView={{
                  opacity: 1,
                  y: 0,
                  rotate: reduced ? 0 : place.rotate,
                }}
                viewport={{ once: true, amount: 0.3 }}
                transition={{
                  duration: 1,
                  delay: (index % 2) * 0.12,
                  ease: EASE,
                }}
                whileHover={reduced ? undefined : { rotate: 0, y: -6, scale: 1.02 }}
              >
                <div className="zoom-frame relative paper-edge" style={{ borderRadius: 3 }}>
                  <PhotoPlaceholder
                    src={memory.image}
                    alt={memory.caption}
                    aspectRatio={place.aspect}
                    eager={index < 2}
                    style={{ borderRadius: 3 }}
                  />
                  <span className="pointer-events-none absolute top-3 left-3 rounded-full bg-porcelain/85 px-2.5 py-1 text-[0.5625rem] font-medium tracking-[0.18em] text-ink-text/70 uppercase backdrop-blur-sm">
                    {memory.tag}
                  </span>
                </div>

                <div className="mt-3.5 pr-2">
                  <p className="font-display text-[1.0625rem] leading-snug text-ink-text">
                    {memory.caption}
                  </p>
                  <p className="eyebrow mt-1.5 text-rose">{memory.date}</p>
                </div>
              </motion.button>
            );
          })}
        </div>

        {/* ── The quote ── */}
        <motion.div
          className="mx-auto mt-20 max-w-3xl text-center lg:mt-28"
          initial={{ opacity: 0, y: reduced ? 0 : 18 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.5 }}
          transition={{ duration: 1, ease: EASE }}
        >
          <span
            aria-hidden="true"
            className="mx-auto mb-7 block font-display text-6xl leading-none text-rose/25 italic select-none"
          >
            ”
          </span>
          <blockquote className="font-display text-[clamp(1.5rem,1.15rem+1.6vw,2.5rem)] leading-[1.28] text-balance text-ink-text italic">
            {config.gallery.quote}
          </blockquote>
          <div className="mt-8 flex items-center justify-center gap-4">
            <span className="h-px w-10 bg-rose/30" />
            <p className="eyebrow text-muted-light">
              {config.gallery.hint} · {shown.length} of {config.memories.length}
            </p>
            <span className="h-px w-10 bg-rose/30" />
          </div>
        </motion.div>
      </div>

      <Lightbox
        memories={config.memories}
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