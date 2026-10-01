/**
 * WishCapsule — her turn.
 *
 * The one place in the experience where the visitor types, so it is
 * built to be private rather than public: the note is written on a
 * sheet, sealed with wax, and kept in her own browser. No account, no
 * network, no share button. It says so, plainly.
 *
 * A drawn capsule sits beside the sheet so the section has an object
 * in it rather than being a bare textarea on a background.
 */
import { useRef, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { config } from "../../config/content";
import SectionShell from "../ui/SectionShell";
import WaxSeal from "../ui/WaxSeal";
import Flowers from "../ui/Flowers";
import {
  clearCapsuleNote,
  getCapsuleNote,
  saveCapsuleNote,
} from "../../lib/api";

const LIMIT = 700;
const EASE = [0.16, 1, 0.3, 1] as const;

export default function WishCapsule() {
  const reduced = useReducedMotion();
  // If she's already sealed one, start sealed — no flash of an empty sheet.
  const [draft, setDraft] = useState(() => getCapsuleNote()?.body ?? "");
  const [sealedAt, setSealedAt] = useState<string | null>(
    () => getCapsuleNote()?.sealedAt ?? null,
  );
  const [failed, setFailed] = useState(false);
  const [stamping, setStamping] = useState(false);
  const areaRef = useRef<HTMLTextAreaElement>(null);

  const seal = () => {
    const body = draft.trim();
    if (!body) {
      areaRef.current?.focus();
      return;
    }
    if (!saveCapsuleNote(body)) {
      setFailed(true);
      return;
    }
    setFailed(false);
    setStamping(true);
    window.setTimeout(() => {
      setSealedAt(new Date().toISOString());
      setStamping(false);
    }, reduced ? 60 : 620);
  };

  const unseal = () => {
    clearCapsuleNote();
    setSealedAt(null);
    window.setTimeout(() => areaRef.current?.focus(), reduced ? 0 : 320);
  };

  const sealed = sealedAt !== null;
  const remaining = LIMIT - draft.length;

  return (
    <SectionShell
      id="capsule"
      tone="blush"
      eyebrow={config.capsule.eyebrow}
      title={config.capsule.title}
      lede={config.capsule.lede}
      spacing="tall"
    >
      <Flowers variant="blossom" className="-left-8 -bottom-6 w-36 opacity-55 sm:w-44" />
      <Flowers variant="sprig" className="-top-10 -right-10 w-40 opacity-45 sm:w-48" />

      <div className="mt-4 grid items-center gap-12 lg:mt-8 lg:grid-cols-[minmax(0,17rem)_minmax(0,1fr)] lg:gap-16">
        {/* ── The object ── */}
        <motion.div
          className="order-1 mx-auto"
          initial={{ opacity: 0, y: reduced ? 0 : 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.4 }}
          transition={{ duration: 1, ease: EASE }}
        >
          <Capsule sealed={sealed} />
        </motion.div>

        {/* ── The sheet ── */}
        <motion.div
          className="order-0 lg:order-1"
          initial={{ opacity: 0, y: reduced ? 0 : 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.9, delay: 0.1, ease: EASE }}
        >
          <div
            className="relative rounded-[4px] px-6 py-8 sm:px-10 sm:py-10"
            style={{
              background: "linear-gradient(178deg, #FEFDFB 0%, #FBF4EE 100%)",
              boxShadow:
                "0 28px 60px -40px rgba(43,33,41,0.5), 0 1px 0 rgba(255,255,255,0.8) inset",
            }}
          >
            {/* Ruled lines, only while writing. */}
            <AnimatePresence>
              {!sealed && (
                <motion.span
                  aria-hidden="true"
                  className="pointer-events-none absolute inset-x-6 top-[7.5rem] bottom-24 sm:inset-x-10"
                  style={{
                    backgroundImage:
                      "repeating-linear-gradient(180deg, rgba(43,33,41,0.07) 0 1px, transparent 1px 2.1rem)",
                  }}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                />
              )}
            </AnimatePresence>

            <AnimatePresence mode="wait">
              {sealed ? (
                <motion.div
                  key="sealed"
                  initial={{ opacity: 0, y: reduced ? 0 : 14 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: reduced ? 0 : -10 }}
                  transition={{ duration: 0.6, ease: EASE }}
                >
                  <p className="eyebrow text-rose">Sealed</p>
                  <p className="mt-2 text-[0.6875rem] text-muted-light">
                    {new Date(sealedAt).toLocaleDateString(undefined, {
                      day: "numeric",
                      month: "long",
                      year: "numeric",
                    })}
                  </p>

                  <p className="mt-7 font-display text-[clamp(1.125rem,1rem+0.7vw,1.5rem)] leading-[1.7] whitespace-pre-wrap text-ink-text italic">
                    {draft}
                  </p>

                  <div className="mt-9 flex flex-wrap items-center gap-3 border-t border-ink-text/10 pt-6">
                    <button
                      type="button"
                      onClick={unseal}
                      className="focus-inset min-h-11 cursor-pointer rounded-full border border-ink-text/20 px-6 text-[0.625rem] font-medium tracking-[0.18em] text-ink-text/70 uppercase transition-colors duration-500 hover:border-rose hover:text-rose-deep"
                    >
                      Unseal and keep writing
                    </button>
                    <span className="text-[0.75rem] text-muted-light">
                      Saved in this browser only.
                    </span>
                  </div>
                </motion.div>
              ) : (
                <motion.div
                  key="writing"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.4 }}
                >
                  <label
                    htmlFor="capsule-note"
                    className="eyebrow block text-rose"
                  >
                    To you, next year
                  </label>

                  <textarea
                    ref={areaRef}
                    id="capsule-note"
                    value={draft}
                    onChange={(event) => setDraft(event.target.value.slice(0, LIMIT))}
                    rows={7}
                    placeholder="What do you want to remember about who you are right now?"
                    className="relative mt-4 w-full resize-none bg-transparent font-display text-[1.0625rem] leading-[2.1rem] text-ink-text placeholder:text-muted-light/45 focus:outline-none sm:text-[1.125rem]"
                  />

                  <div className="mt-4 flex flex-wrap items-center justify-between gap-4 border-t border-ink-text/10 pt-6">
                    <span className="text-[0.75rem] text-muted-light tabular-nums">
                      {remaining > 0
                        ? `${remaining} characters left`
                        : "That's the whole capsule."}
                    </span>

                    <button
                      type="button"
                      onClick={seal}
                      disabled={draft.trim().length === 0}
                      className="focus-inset min-h-11 cursor-pointer rounded-full border border-rose/40 bg-rose/[0.06] px-7 text-[0.625rem] font-medium tracking-[0.18em] text-rose-deep uppercase transition-all duration-500 hover:bg-rose/12 active:scale-95 disabled:pointer-events-none disabled:opacity-35"
                    >
                      Seal it
                    </button>
                  </div>

                  <AnimatePresence>
                    {failed && (
                      <motion.p
                        className="mt-4 text-[0.8125rem] text-rose-deep"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        role="alert"
                      >
                        This browser won't let the site store anything, so the note
                        didn't save. Try a normal window rather than a private one.
                      </motion.p>
                    )}
                  </AnimatePresence>
                </motion.div>
              )}
            </AnimatePresence>

            {/* The seal, landing on the sheet. */}
            <AnimatePresence>
              {stamping && (
                <motion.div
                  className="pointer-events-none absolute inset-0 grid place-items-center"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                >
                  <motion.div
                    initial={{ scale: 2.1, rotate: -22, opacity: 0 }}
                    animate={{ scale: 1, rotate: -8, opacity: 1 }}
                    exit={{ scale: 0.9, opacity: 0 }}
                    transition={{ duration: reduced ? 0.1 : 0.55, ease: EASE }}
                  >
                    <WaxSeal broken monogram={config.herName.charAt(0).toUpperCase()} size={104} />
                  </motion.div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </motion.div>
      </div>
    </SectionShell>
  );
}

/** A drawn capsule: a glass vessel with a cork, and notes inside. */
function Capsule({ sealed }: { sealed: boolean }) {
  const reduced = useReducedMotion();
  return (
    <div className="flex w-full max-w-[15rem] flex-col items-center">
      <motion.svg
        viewBox="0 0 160 210"
        className="w-full"
        fill="none"
        aria-hidden="true"
        animate={reduced ? {} : { y: [0, -5, 0] }}
        transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
      >
        {/* Cork */}
        <rect x="52" y="6" width="56" height="20" rx="5" fill="#D8C4A8" />
        <rect x="52" y="6" width="56" height="20" rx="5" stroke="rgba(43,33,41,0.22)" />
        <path d="M52 16h56" stroke="rgba(43,33,41,0.14)" />

        {/* Glass */}
        <path
          d="M46 26h68v104a30 30 0 0 1-30 30H76a30 30 0 0 1-30-30V26Z"
          fill="rgba(252,249,245,0.55)"
          stroke="rgba(43,33,41,0.3)"
          strokeWidth="1.2"
        />
        {/* Highlight */}
        <path
          d="M56 40v86"
          stroke="rgba(255,255,255,0.85)"
          strokeWidth="3"
          strokeLinecap="round"
        />
        {/* Base ring */}
        <path d="M52 148h56" stroke="rgba(43,33,41,0.16)" />

        {/* Notes inside */}
        <motion.g
          initial={false}
          animate={{ opacity: sealed ? 1 : 0.45, y: sealed ? 0 : 4 }}
          transition={{ duration: 0.8, ease: EASE }}
        >
          <rect
            x="60"
            y="112"
            width="40"
            height="26"
            rx="2"
            fill="#F3E6DA"
            stroke="rgba(43,33,41,0.2)"
            transform="rotate(-7 80 125)"
          />
          <path
            d="M66 120h26M66 126h20"
            stroke="rgba(43,33,41,0.28)"
            strokeLinecap="round"
            transform="rotate(-7 80 125)"
          />
          <rect
            x="64"
            y="86"
            width="34"
            height="22"
            rx="2"
            fill="#F6EDE4"
            stroke="rgba(43,33,41,0.18)"
            transform="rotate(6 81 97)"
          />
          <path
            d="M69 93h20M69 99h14"
            stroke="rgba(43,33,41,0.24)"
            strokeLinecap="round"
            transform="rotate(6 81 97)"
          />
        </motion.g>
      </motion.svg>

      <p className="eyebrow mt-6 text-center text-muted-light">
        {sealed ? "Sealed" : "Open"}
      </p>
    </div>
  );
}
