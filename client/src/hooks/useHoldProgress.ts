import { useCallback, useEffect, useRef, useState } from "react";

interface HoldOptions {
  /** Milliseconds to fill from 0 → 1. */
  duration?: number;
  /** When false, `start()` is a no-op. */
  enabled?: boolean;
}

/**
 * The site's press-and-hold mechanic, shared by the intro seal and the
 * candle ritual so they feel like one system.
 *
 * Releasing early does not reset it — the fill simply continues on its
 * own, which keeps a quick tap and a real hold equivalent, and makes
 * the gesture usable with a keyboard. This is deliberate: a wish or an
 * opening should never be cancellable.
 */
export function useHoldProgress(
  onComplete: () => void,
  { duration = 2400, enabled = true }: HoldOptions = {},
) {
  const [progress, setProgress] = useState(0);
  const rafRef = useRef(0);
  const onCompleteRef = useRef(onComplete);
  const enabledRef = useRef(enabled);
  const doneRef = useRef(false);

  useEffect(() => {
    onCompleteRef.current = onComplete;
  });
  useEffect(() => {
    enabledRef.current = enabled;
  });
  useEffect(() => () => cancelAnimationFrame(rafRef.current), []);

  const start = useCallback(() => {
    if (!enabledRef.current || doneRef.current) return;
    cancelAnimationFrame(rafRef.current);
    const begin = performance.now() - progress * duration;

    const step = (now: number) => {
      const next = Math.min(1, (now - begin) / duration);
      setProgress(next);
      if (next >= 1) {
        doneRef.current = true;
        onCompleteRef.current();
        return;
      }
      rafRef.current = requestAnimationFrame(step);
    };
    rafRef.current = requestAnimationFrame(step);
  }, [duration, progress]);

  const reset = useCallback(() => {
    cancelAnimationFrame(rafRef.current);
    doneRef.current = false;
    setProgress(0);
  }, []);

  return { progress, start, reset };
}