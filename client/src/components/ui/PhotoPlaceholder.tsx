/**
 * PhotoPlaceholder — renders a real photo, or a frame that clearly
 * says a photo is missing.
 *
 * The empty state is deliberately designed rather than a grey box: it
 * looks like an empty film sleeve and names the exact file to drop in,
 * so filling the site in later is obvious and nothing looks broken in
 * the meantime. Add the image to `client/public/photos/` and it swaps
 * in with a blur-up, no code change.
 */
import { useState } from "react";
import { motion, useReducedMotion } from "framer-motion";

interface PhotoPlaceholderProps {
  src?: string;
  alt?: string;
  className?: string;
  style?: React.CSSProperties;
  aspectRatio?: string;
  /** `night` for dark sections. */
  tone?: "light" | "night";
  /** Skip lazy-loading for above-the-fold frames. */
  eager?: boolean;
  /** Rounded corners. Use 0 for full-bleed editorial frames. */
  radius?: number;
  objectPosition?: string;
}

/** "/photos/first-date.jpg" → "FIRST-DATE" */
function slotName(src: string): string {
  const file = src.split("/").pop() ?? src;
  const base = file.replace(/\.[a-z0-9]+$/i, "").replace(/[-_]+/g, " ");
  return base.trim().toUpperCase() || "PHOTO";
}

export default function PhotoPlaceholder({
  src,
  alt = "",
  className = "",
  style,
  aspectRatio = "4 / 5",
  tone = "light",
  eager = false,
  radius = 4,
  objectPosition = "center",
}: PhotoPlaceholderProps) {
  const [state, setState] = useState<"idle" | "loaded" | "missing">("idle");
  const reduced = useReducedMotion();
  const isNight = tone === "night";

  const label = src ? slotName(src) : "PHOTO";

  return (
    <div
      className={`relative overflow-hidden ${className}`}
      style={{
        aspectRatio,
        borderRadius: radius,
        backgroundColor: isNight ? "var(--color-ink-raised)" : "var(--color-linen)",
        ...style,
      }}
    >
      {src && state !== "missing" && (
        <motion.img
          src={src}
          alt={alt}
          loading={eager ? "eager" : "lazy"}
          decoding="async"
          fetchPriority={eager ? "high" : "auto"}
          onLoad={() => setState("loaded")}
          onError={() => setState("missing")}
          className="absolute inset-0 h-full w-full object-cover"
          style={{
            objectPosition,
            opacity: state === "loaded" ? 1 : 0,
            filter:
              state === "loaded" || reduced
                ? "none"
                : "blur(18px) saturate(0.8)",
            transition: "opacity 900ms cubic-bezier(0.16,1,0.3,1), filter 900ms cubic-bezier(0.16,1,0.3,1)",
          }}
        />
      )}

      {state !== "loaded" && (
        <div
          className={`absolute inset-0 flex flex-col items-center justify-center gap-3 px-4 text-center ${
            isNight
              ? "bg-[linear-gradient(145deg,rgba(69,51,71,0.55),rgba(36,27,34,0.9))]"
              : "bg-[linear-gradient(145deg,var(--color-linen),var(--color-blush))]"
          }`}
        >
          {/* Film-sleeve corner marks */}
          <svg
            aria-hidden="true"
            viewBox="0 0 40 40"
            className={`h-7 w-7 ${isNight ? "text-porcelain/25" : "text-ink-text/20"}`}
            fill="none"
            stroke="currentColor"
            strokeWidth="1"
          >
            <path d="M2 12V4a2 2 0 0 1 2-2h8" />
            <path d="M28 2h8a2 2 0 0 1 2 2v8" />
            <path d="M38 28v8a2 2 0 0 1-2 2h-8" />
            <path d="M12 38H4a2 2 0 0 1-2-2v-8" />
            <circle cx="20" cy="20" r="6.5" opacity="0.6" />
          </svg>

          <p
            className={`font-sans text-[0.6rem] font-medium tracking-[0.2em] ${
              isNight ? "text-porcelain/40" : "text-ink-text/35"
            }`}
          >
            {label}
          </p>
        </div>
      )}
    </div>
  );
}
