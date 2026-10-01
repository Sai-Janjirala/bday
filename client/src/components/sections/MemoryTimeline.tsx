/**
 * MemoryTimeline — the journey so far.
 *
 * A drawn line rather than a stack of cards: the rule inks itself in
 * as she scrolls, each photograph settles into its frame as it comes
 * up, and on wide screens the entry's date sticks while its own
 * paragraph scrolls past, so each memory reads as a moment rather than
 * a list item.
 */
import { useRef } from "react";
import { motion, useScroll, useSpring, useTransform, useReducedMotion } from "framer-motion";
import { config } from "../../config/content";
import SectionShell from "../ui/SectionShell";
import PhotoPlaceholder from "../ui/PhotoPlaceholder";
import Flowers from "../ui/Flowers";

export default function MemoryTimeline() {
  const ref = useRef<HTMLDivElement>(null);
  const reduced = useReducedMotion();

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start 72%", "end 65%"],
  });
  const drawn = useSpring(scrollYProgress, {
    stiffness: 90,
    damping: 28,
    restDelta: 0.001,
  });
  const lineScale = useTransform(drawn, [0, 1], [0, 1]);

  return (
    <SectionShell
      id="moments"
      tone="linen"
      marker="II"
      eyebrow={config.timeline.eyebrow}
      title={config.timeline.title}
      lede={config.timeline.lede}
      spacing="tall"
    >
      <Flowers variant="sprig" className="-bottom-10 left-4 w-36 opacity-55 sm:w-44" />

      <div ref={ref} className="relative mt-4">
        {/* ── The rule ── */}
        <div
          aria-hidden="true"
          className="absolute top-0 bottom-0 left-[7px] w-px bg-ink-text/10 md:left-1/2 md:-translate-x-1/2"
        >
          <motion.div
            className="h-full w-full origin-top"
            style={{
              scaleY: lineScale,
              background:
                "linear-gradient(180deg, var(--color-rose) 0%, var(--color-rose) 60%, var(--color-brass) 100%)",
            }}
          />
        </div>

        <ol className="space-y-16 sm:space-y-24 lg:space-y-32">
          {config.timelineMoments.map((moment, index) => (
            <TimelineEntry
              key={moment.image}
              moment={moment}
              index={index}
              reduced={!!reduced}
            />
          ))}
        </ol>
      </div>
    </SectionShell>
  );
}

function TimelineEntry({
  moment,
  index,
  reduced,
}: {
  moment: (typeof config.timelineMoments)[number];
  index: number;
  reduced: boolean;
}) {
  const imageOnLeft = index % 2 === 1;

  return (
    <li className="relative">
      <div className="grid grid-cols-1 gap-6 pl-8 md:grid-cols-[minmax(0,1fr)_2.5rem_minmax(0,1.1fr)] md:items-center md:gap-0 md:pl-0">
        {/* ── Image ── */}
        <motion.div
          className={
            imageOnLeft
              ? "md:col-start-1 md:row-start-1"
              : "md:col-start-3 md:row-start-1"
          }
          initial={reduced ? { opacity: 0 } : { opacity: 0, scale: 1.06 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 1.4, ease: [0.16, 1, 0.3, 1] }}
        >
          <div className="zoom-frame relative" style={{ borderRadius: 3 }}>
            <PhotoPlaceholder
              src={moment.image}
              alt={moment.title}
              aspectRatio="4 / 5"
              className="w-full max-w-[19rem] sm:max-w-sm"
            />
          </div>
        </motion.div>

        {/* ── Node, sitting on the centre rule ── */}
        <motion.span
          aria-hidden="true"
          className="hidden h-2.5 w-2.5 rounded-full bg-porcelain ring-1 ring-rose/60 md:col-start-2 md:row-start-1 md:block"
          initial={{ scale: 0 }}
          whileInView={{ scale: 1 }}
          viewport={{ once: true, amount: 0.8 }}
          transition={{ duration: 0.6, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
        />

        {/* ── Text ── */}
        <motion.div
          className={`md:row-start-1 ${
            imageOnLeft
              ? "md:col-start-3 md:pl-8 lg:pl-12"
              : "md:col-start-1 md:pr-8 lg:pr-12"
          }`}
          initial={{ opacity: 0, y: reduced ? 0 : 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.4 }}
          transition={{ duration: 0.9, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
        >
          {/* Date, sticky on wide screens so it holds while the prose moves. */}
          <div className="md:sticky md:top-[20vh]">
            <p className="eyebrow text-rose">{moment.date}</p>
            <span className="mt-3 block h-px w-8 bg-ink-text/20" />
          </div>

          <div className="mt-4 md:mt-6">
            <h3 className="font-display text-[clamp(1.5rem,1.2rem+1.4vw,2.25rem)] leading-[1.12] text-ink-text">
              {moment.title}
            </h3>
            <p className="mt-4 max-w-prose text-[0.9375rem] leading-[1.75] text-pretty text-muted">
              {moment.description}
            </p>
            <p className="eyebrow mt-5 text-muted-light/70">{moment.tag}</p>
          </div>
        </motion.div>
      </div>

      {/* Mobile node, sitting on the left rule. */}
      <motion.span
        aria-hidden="true"
        className="absolute top-2 left-0 block h-[15px] w-[15px] rounded-full bg-linen ring-1 ring-rose/60 md:hidden"
        initial={{ scale: 0 }}
        whileInView={{ scale: 1 }}
        viewport={{ once: true, amount: 0.6 }}
        transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
      />
    </li>
  );
}
