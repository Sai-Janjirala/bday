/**
 * Deckle.tsx — Torn paper edge divider for the keepsake book.
 *
 * Provides an organic, deckled paper transition between sections,
 * reinforcing the physical handmade book aesthetic.
 */

interface DeckleProps {
  position?: "top" | "bottom";
  /** Background color of the adjacent section */
  fillColor?: string;
  className?: string;
}

export default function Deckle({
  position = "bottom",
  fillColor = "var(--color-porcelain)",
  className = "",
}: DeckleProps) {
  const isTop = position === "top";

  return (
    <div
      aria-hidden="true"
      data-decorative="true"
      className={`pointer-events-none absolute inset-x-0 z-10 overflow-hidden leading-none select-none ${
        isTop ? "top-0 -translate-y-[99%]" : "bottom-0 translate-y-[99%]"
      } ${className}`}
    >
      <svg
        viewBox="0 0 1200 32"
        preserveAspectRatio="none"
        className={`h-4 w-full sm:h-7 ${isTop ? "rotate-180" : ""}`}
        style={{ fill: fillColor }}
      >
        <path d="M0,0 C150,14 320,3 480,18 C640,32 780,8 940,22 C1060,11 1140,25 1200,8 L1200,32 L0,32 Z" />
        {/* Subtle deckle paper fiber roughness overlay */}
        <path
          d="M0,4 C180,18 360,6 540,24 C720,10 900,28 1080,12 L1200,16 L1200,32 L0,32 Z"
          opacity="0.25"
          fill="rgba(43,33,41,0.06)"
        />
      </svg>
    </div>
  );
}
