import { useCallback, useEffect, useRef, useState } from "react";

/** Ambient score, generated in the browser.
 *
 *  Two sources, one contract:
 *   · `src` present → a real audio file (your song).
 *   · `src` absent  → a soft, slow chord bed synthesised with the
 *     Web Audio API. No asset, no download, no autoplay.
 *
 *  Nothing ever starts on its own: an AudioContext can only be
 *  created inside a user gesture, and we only try on toggle(). */
export interface MusicController {
  isPlaying: boolean;
  /** False only when the browser has no Web Audio at all. */
  isSupported: boolean;
  /** Human-readable reason playback failed, if it did. */
  error: string | null;
  toggle: () => void;
}

type Engine = {
  dispose: () => void;
  setPlaying: (playing: boolean) => void;
  setVolume: (volume: number) => void;
};

// A slow, warm progression. Fmaj7 → Dm7 → Bbmaj7 → C, eight seconds
// each. Read as four loose chords rather than a progression you hum.
const PROGRESSION: number[][] = [
  [87.31, 130.81, 174.61, 220.0], // Fmaj7
  [73.42, 116.54, 146.83, 174.61], // Dm7
  [58.27, 116.54, 146.83, 174.61], // Bbmaj7
  [65.41, 130.81, 164.81, 196.0], // Cmaj7
];

// A pentatonic figure for the occasional bell, so the bed has a
// heartbeat without ever becoming a melody.
const BELL_NOTES = [349.23, 392.0, 440.0, 523.25, 587.33];

const CHORD_SECONDS = 8;
const MASTER_VOLUME = 0.16;

function createSynthEngine(): Engine {
  const AudioContextCtor =
    window.AudioContext ??
    (window as unknown as { webkitAudioContext?: typeof AudioContext })
      .webkitAudioContext;
  if (!AudioContextCtor) {
    throw new Error("Web Audio is unavailable");
  }
  const ctx = new AudioContextCtor();

  const master = ctx.createGain();
  master.gain.value = 0;
  master.connect(ctx.destination);

  // Everything sits behind a low-pass so the chords feel like they're
  // in a room rather than on top of you.
  const tone = ctx.createBiquadFilter();
  tone.type = "lowpass";
  tone.frequency.value = 820;
  tone.Q.value = 0.6;
  tone.connect(master);

  // Slow filter drift — the room "breathes" over a ~24s cycle.
  const drift = ctx.createOscillator();
  const driftDepth = ctx.createGain();
  drift.frequency.value = 0.042;
  driftDepth.gain.value = 340;
  drift.connect(driftDepth);
  driftDepth.connect(tone.frequency);
  drift.start();

  // Feedback delay adds air without a convolver or an impulse file.
  const delay = ctx.createDelay(1.5);
  delay.delayTime.value = 0.42;
  const feedback = ctx.createGain();
  feedback.gain.value = 0.34;
  const wet = ctx.createGain();
  wet.gain.value = 0.32;
  delay.connect(feedback);
  feedback.connect(delay);
  delay.connect(wet);
  wet.connect(tone);

  let stopped = false;
  let chordIndex = 0;
  let chordTimer: number | undefined;
  let bellTimer: number | undefined;
  const voices = new Set<OscillatorNode>();

  const releaseVoice = (
    osc: OscillatorNode,
    gain: GainNode,
    at: number,
    seconds: number,
  ) => {
    const target = Math.max(0.0001, gain.gain.value);
    gain.gain.cancelScheduledValues(at);
    gain.gain.setValueAtTime(target, at);
    gain.gain.exponentialRampToValueAtTime(0.0001, at + seconds);
    osc.stop(at + seconds + 0.1);
    osc.onended = () => {
      voices.delete(osc);
      osc.disconnect();
      gain.disconnect();
    };
  };

  const playChord = () => {
    if (stopped) return;
    const now = ctx.currentTime;
    const notes = PROGRESSION[chordIndex % PROGRESSION.length];
    chordIndex += 1;

    for (const [index, frequency] of notes.entries()) {
      // Triangle for body, sine an octave up for shimmer.
      const shapes: Array<[OscillatorType, number, number]> = [
        ["triangle", frequency, 0.5],
        ["sine", frequency * 2, 0.16],
        ["sine", frequency * 4, 0.05],
      ];
      for (const [type, freq, level] of shapes) {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = type;
        osc.frequency.value = freq;
        // Detune pairs very slightly to keep the chord from sounding sterile.
        osc.detune.value = (index - 1.5) * 3;
        gain.gain.value = 0.0001;
        osc.connect(gain);
        gain.connect(tone);
        if (index === 1) gain.connect(delay);
        osc.start(now);
        gain.gain.exponentialRampToValueAtTime(level, now + 2.6);
        voices.add(osc);
        releaseVoice(osc, gain, now, CHORD_SECONDS - 2.2);
      }
    }
  };

  const playBell = () => {
    if (stopped) return;
    const now = ctx.currentTime;
    const frequency =
      BELL_NOTES[Math.floor(Math.random() * BELL_NOTES.length)] *
      (Math.random() < 0.35 ? 2 : 1);
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = "sine";
    osc.frequency.value = frequency;
    gain.gain.value = 0.0001;
    osc.connect(gain);
    gain.connect(tone);
    gain.connect(delay);
    osc.start(now);
    gain.gain.exponentialRampToValueAtTime(0.075, now + 0.02);
    voices.add(osc);
    releaseVoice(osc, gain, now, 3.4);
  };

  const scheduleBell = () => {
    if (stopped) return;
    bellTimer = window.setTimeout(() => {
      playBell();
      scheduleBell();
    }, 2600 + Math.random() * 4200);
  };

  return {
    setPlaying(playing) {
      if (stopped) return;
      if (playing) {
        void ctx.resume();
        const now = ctx.currentTime;
        master.gain.cancelScheduledValues(now);
        master.gain.setValueAtTime(Math.max(0.0001, master.gain.value), now);
        master.gain.linearRampToValueAtTime(MASTER_VOLUME, now + 2.4);
        playChord();
        chordTimer = window.setTimeout(function tick() {
          if (stopped) return;
          playChord();
          chordTimer = window.setTimeout(tick, CHORD_SECONDS * 1000);
        }, CHORD_SECONDS * 1000);
        scheduleBell();
      } else {
        const now = ctx.currentTime;
        master.gain.cancelScheduledValues(now);
        master.gain.setValueAtTime(Math.max(0.0001, master.gain.value), now);
        master.gain.linearRampToValueAtTime(0, now + 1.1);
        window.clearTimeout(chordTimer);
        window.clearTimeout(bellTimer);
        for (const osc of voices) {
          try {
            osc.stop(now + 0.05);
          } catch {
            /* already scheduled to stop */
          }
        }
      }
    },
    setVolume(volume) {
      master.gain.value = Math.max(0, Math.min(1, volume));
    },
    dispose() {
      stopped = true;
      window.clearTimeout(chordTimer);
      window.clearTimeout(bellTimer);
      for (const osc of voices) {
        try {
          osc.stop();
        } catch {
          /* ignore */
        }
      }
      try {
        void ctx.close();
      } catch {
        /* ignore */
      }
    },
  };
}

function createFileEngine(src: string): Engine {
  const audio = new Audio(src);
  audio.loop = true;
  audio.preload = "none";
  audio.volume = MASTER_VOLUME;
  return {
    setPlaying(playing) {
      if (playing) void audio.play().catch(() => undefined);
      else audio.pause();
    },
    setVolume(volume) {
      audio.volume = Math.max(0, Math.min(1, volume));
    },
    dispose() {
      audio.pause();
      audio.src = "";
    },
  };
}

export function useAmbientMusic(src: string | null): MusicController {
  const engineRef = useRef<Engine | null>(null);
  const desiredRef = useRef(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const isSupported =
    typeof window !== "undefined" &&
    Boolean(
      window.AudioContext ??
        (window as unknown as { webkitAudioContext?: unknown }).webkitAudioContext,
    );

  useEffect(() => {
    return () => {
      engineRef.current?.dispose();
      engineRef.current = null;
    };
  }, []);

  // If the visitor starts the music then switches tabs, don't leave
  // a synth graph running in the background forever.
  useEffect(() => {
    if (!isPlaying) return;
    const onVisibility = () => {
      if (document.hidden) engineRef.current?.setPlaying(false);
      else if (desiredRef.current) engineRef.current?.setPlaying(true);
    };
    document.addEventListener("visibilitychange", onVisibility);
    return () =>
      document.removeEventListener("visibilitychange", onVisibility);
  }, [isPlaying]);

  const toggle = useCallback(() => {
    setError(null);
    desiredRef.current = !desiredRef.current;
    const next = desiredRef.current;

    if (!next) {
      engineRef.current?.setPlaying(false);
      setIsPlaying(false);
      return;
    }

    try {
      if (!engineRef.current) {
        engineRef.current = src
          ? createFileEngine(src)
          : createSynthEngine();
      }
      engineRef.current.setPlaying(true);
      setIsPlaying(true);
    } catch {
      desiredRef.current = false;
      setIsPlaying(false);
      setError("Couldn't start the music — everything else still works.");
    }
  }, [src]);

  return { isPlaying, isSupported, error, toggle };
}
