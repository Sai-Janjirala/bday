import { useEffect, useState } from "react";

export interface Countdown {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
  /** True once config.birthday has a real month + day. */
  isActive: boolean;
}

const MS_PER_SECOND = 1000;
const MS_PER_MINUTE = 60 * MS_PER_SECOND;
const MS_PER_HOUR = 60 * MS_PER_MINUTE;
const MS_PER_DAY = 24 * MS_PER_HOUR;

function nextBirthday(month: number, day: number): Date {
  const now = new Date();
  // month is 1-based. Resolve to a Date at local midnight so the
  // difference is a clean count of days rather than a rounding artefact.
  let target = new Date(now.getFullYear(), month - 1, day, 0, 0, 0, 0);
  if (target.getTime() <= now.getTime()) {
    target = new Date(now.getFullYear() + 1, month - 1, day, 0, 0, 0, 0);
  }
  return target;
}

/** Ticks once a second towards her next birthday.
 *  Stays inert (and reports isActive: false) until config.birthday
 *  is filled in, so the hero never shows a broken countdown. */
export function useCountdown(month: number, day: number): Countdown {
  const isActive = month >= 1 && month <= 12 && day >= 1 && day <= 31;

  const compute = (): Countdown => {
    if (!isActive) {
      return { days: 0, hours: 0, minutes: 0, seconds: 0, isActive: false };
    }
    const diff = Math.max(0, nextBirthday(month, day).getTime() - Date.now());
    return {
      days: Math.floor(diff / MS_PER_DAY),
      hours: Math.floor((diff % MS_PER_DAY) / MS_PER_HOUR),
      minutes: Math.floor((diff % MS_PER_HOUR) / MS_PER_MINUTE),
      seconds: Math.floor((diff % MS_PER_MINUTE) / MS_PER_SECOND),
      isActive: true,
    };
  };

  const [countdown, setCountdown] = useState<Countdown>(compute);

  useEffect(() => {
    if (!isActive) {
      setCountdown(compute);
      return;
    }
    setCountdown(compute);
    const timer = window.setInterval(() => setCountdown(compute), MS_PER_SECOND);
    return () => window.clearInterval(timer);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isActive, month, day]);

  return countdown;
}
