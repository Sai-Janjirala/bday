/**
 * useChimeSound.ts — Lightweight celestial Web Audio synthesizer.
 *
 * Generates warm, dreamy acoustic chime / celesta tones on user interactions
 * (wax seal break, candle blowout, ribbon pull, heart bloom) without needing
 * any external mp3 files. Pure Web Audio API, zero latency.
 */
import { useCallback, useRef } from "react";

export function useChimeSound() {
  const ctxRef = useRef<AudioContext | null>(null);

  const getAudioContext = useCallback(() => {
    if (!ctxRef.current) {
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (AudioCtx) {
        ctxRef.current = new AudioCtx();
      }
    }
    if (ctxRef.current && ctxRef.current.state === "suspended") {
      ctxRef.current.resume();
    }
    return ctxRef.current;
  }, []);

  /** Play a dreamy celestial chime chord (e.g. on curtain open or wish complete) */
  const playCelestialChime = useCallback(() => {
    const ctx = getAudioContext();
    if (!ctx) return;

    const freqs = [523.25, 659.25, 783.99, 1046.5]; // C5, E5, G5, C6
    freqs.forEach((freq, i) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = "sine";
      osc.frequency.setValueAtTime(freq, ctx.currentTime + i * 0.08);

      gain.gain.setValueAtTime(0.001, ctx.currentTime + i * 0.08);
      gain.gain.exponentialRampToValueAtTime(0.08, ctx.currentTime + i * 0.08 + 0.04);
      gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + i * 0.08 + 1.6);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start(ctx.currentTime + i * 0.08);
      osc.stop(ctx.currentTime + i * 0.08 + 1.8);
    });
  }, [getAudioContext]);

  /** Play a subtle soft bell tone on tap / wax seal / candle touch */
  const playSoftBell = useCallback((pitchMultiplier = 1) => {
    const ctx = getAudioContext();
    if (!ctx) return;

    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = "triangle";
    osc.frequency.setValueAtTime(659.25 * pitchMultiplier, ctx.currentTime); // E5

    gain.gain.setValueAtTime(0.001, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.06, ctx.currentTime + 0.02);
    gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + 0.9);

    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.start(ctx.currentTime);
    osc.stop(ctx.currentTime + 1.0);
  }, [getAudioContext]);

  /** Play a soft whoosh / puff sound on candle blowout */
  const playCandleBlow = useCallback(() => {
    const ctx = getAudioContext();
    if (!ctx) return;

    const bufferSize = ctx.sampleRate * 0.4;
    const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
    const data = buffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) {
      data[i] = Math.random() * 2 - 1;
    }

    const noise = ctx.createBufferSource();
    noise.buffer = buffer;

    const filter = ctx.createBiquadFilter();
    filter.type = "lowpass";
    filter.frequency.setValueAtTime(450, ctx.currentTime);
    filter.frequency.exponentialRampToValueAtTime(80, ctx.currentTime + 0.35);

    const gain = ctx.createGain();
    gain.gain.setValueAtTime(0.04, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.35);

    noise.connect(filter);
    filter.connect(gain);
    gain.connect(ctx.destination);

    noise.start(ctx.currentTime);
    noise.stop(ctx.currentTime + 0.4);
  }, [getAudioContext]);

  return { playCelestialChime, playSoftBell, playCandleBlow };
}
