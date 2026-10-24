import { useCallback, useEffect, useRef, useState } from "react";

export const CONFETTI_DURATION_MS = 4200;
export const GIFT_OPEN_DELAY_MS = 2000;

export function useBirthdayCelebration(onGiftOpened?: () => void) {
  const [burst, setBurst] = useState<number | null>(null);
  const [looping, setLooping] = useState(false);
  const [opening, setOpening] = useState(false);
  const opened = useRef(onGiftOpened);
  opened.current = onGiftOpened;
  useEffect(() => {
    if (burst === null || looping) return;
    const timer = window.setTimeout(() => setBurst(null), CONFETTI_DURATION_MS);
    return () => window.clearTimeout(timer);
  }, [burst, looping]);
  useEffect(() => {
    if (!opening) return;
    const timer = window.setTimeout(() => { setOpening(false); opened.current?.(); }, GIFT_OPEN_DELAY_MS);
    return () => window.clearTimeout(timer);
  }, [opening]);
  const stop = useCallback(() => { setBurst(null); setLooping(false); }, []);
  return {
    burst, looping, opening, stop,
    openGift: () => { if (opening) return; setOpening(true); setLooping(false); setBurst(value => (value ?? 0) + 1); },
    celebrate: (repeat = false) => { setLooping(repeat); setBurst(value => (value ?? 0) + 1); },
  };
}