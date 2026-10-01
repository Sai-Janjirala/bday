import { useEffect, useState } from "react";

/** Hooks directory — shared, framework-agnostic behaviour.
 *  Nothing here renders, so importing any of these from a component
 *  is safe under react/only-export-components. */

/** Mirrors the OS "reduce motion" setting, and also reflects it onto
 *  <html> as a class so CSS-only decorations can switch off too. */
export function useReducedMotion(): boolean {
  const [reduced, setReduced] = useState(() => {
    if (typeof window === "undefined" || !window.matchMedia) return false;
    return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  });

  useEffect(() => {
    if (!window.matchMedia) return;
    const query = window.matchMedia("(prefers-reduced-motion: reduce)");
    const onChange = (event: MediaQueryListEvent) => setReduced(event.matches);
    query.addEventListener("change", onChange);
    return () => query.removeEventListener("change", onChange);
  }, []);

  useEffect(() => {
    document.documentElement.classList.toggle("reduce-motion", reduced);
  }, [reduced]);

  return reduced;
}
