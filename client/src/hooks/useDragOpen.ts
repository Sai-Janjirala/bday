import { useCallback, useEffect, useRef, useState } from "react";

interface UseDragOpenOptions {
  /** Callback fired when the curtain has been opened past threshold or triggered via keyboard/tap */
  onOpen: () => void;
  /** Whether assets are ready and drag is enabled */
  enabled: boolean;
  /** Distance in pixels to drag up before opening triggers */
  threshold?: number;
  /** Reduced motion flag to open immediately */
  reducedMotion?: boolean | null;
}

export function useDragOpen({
  onOpen,
  enabled,
  threshold = 160,
  reducedMotion = false,
}: UseDragOpenOptions) {
  const [dragProgress, setDragProgress] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const startYRef = useRef<number | null>(null);
  const currentProgressRef = useRef(0);
  const onOpenRef = useRef(onOpen);
  const enabledRef = useRef(enabled);
  const triggeredRef = useRef(false);

  useEffect(() => {
    onOpenRef.current = onOpen;
  });
  useEffect(() => {
    enabledRef.current = enabled;
  });

  const triggerOpen = useCallback(() => {
    if (triggeredRef.current || !enabledRef.current) return;
    triggeredRef.current = true;
    setDragProgress(1);
    onOpenRef.current();
  }, []);

  const handlePointerDown = useCallback(
    (e: React.PointerEvent) => {
      if (!enabledRef.current || triggeredRef.current) return;
      if (reducedMotion) {
        triggerOpen();
        return;
      }
      startYRef.current = e.clientY;
      setIsDragging(true);
      try {
        (e.target as HTMLElement).setPointerCapture(e.pointerId);
      } catch {
        /* Ignore if setPointerCapture fails on some elements */
      }
    },
    [reducedMotion, triggerOpen],
  );

  const handlePointerMove = useCallback(
    (e: React.PointerEvent) => {
      if (startYRef.current === null || triggeredRef.current) return;
      const deltaY = startYRef.current - e.clientY; // Positive when dragging UP
      if (deltaY <= 0) {
        currentProgressRef.current = 0;
        setDragProgress(0);
        return;
      }

      const progress = Math.min(1, Math.max(0, deltaY / threshold));
      currentProgressRef.current = progress;
      setDragProgress(progress);

      if (progress >= 1) {
        setIsDragging(false);
        startYRef.current = null;
        triggerOpen();
      }
    },
    [threshold, triggerOpen],
  );

  const handlePointerUp = useCallback(
    (e: React.PointerEvent) => {
      if (startYRef.current === null) return;
      try {
        (e.target as HTMLElement).releasePointerCapture(e.pointerId);
      } catch {
        /* Ignore */
      }

      if (currentProgressRef.current > 0.45) {
        triggerOpen();
      } else {
        // Snap back
        setDragProgress(0);
        currentProgressRef.current = 0;
      }
      setIsDragging(false);
      startYRef.current = null;
    },
    [triggerOpen],
  );

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (!enabledRef.current || triggeredRef.current) return;
      if (e.key === "Enter" || e.key === " " || e.key === "ArrowUp") {
        e.preventDefault();
        triggerOpen();
      }
    },
    [triggerOpen],
  );

  return {
    dragProgress,
    isDragging,
    handlePointerDown,
    handlePointerMove,
    handlePointerUp,
    handleKeyDown,
    triggerOpen,
  };
}
