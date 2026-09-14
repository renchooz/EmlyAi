import { useEffect, useRef, useState } from "react";
import { useReducedMotion } from "framer-motion";

/**
 * Drives the self-playing product demo (hero section): cycles through
 * `steps` (each `{ dur }` in ms), tracking which step is active and 0-1
 * progress within it, looping with `restartDelay` ms pause at the end.
 * Under reduced motion it settles on the final, complete frame instead of
 * looping, so the demo doesn't auto-play indefinitely for those users.
 */
export function useDemoLoop(steps, { restartDelay = 1800 } = {}) {
  const reduced = useReducedMotion();
  const [state, setState] = useState(() =>
    reduced ? { step: steps.length - 1, t: 1 } : { step: 0, t: 0 }
  );
  const t0 = useRef(Date.now());

  useEffect(() => {
    if (reduced) return;
    const total = steps.reduce((a, s) => a + s.dur, 0);
    const tick = setInterval(() => {
      const el = Date.now() - t0.current;
      let acc = 0;
      let step = 0;
      for (let i = 0; i < steps.length; i++) {
        if (el < acc + steps[i].dur) {
          step = i;
          break;
        }
        acc += steps[i].dur;
        step = i;
      }
      if (el > total + restartDelay) {
        t0.current = Date.now();
        setState({ step: 0, t: 0 });
        return;
      }
      setState({ step, t: Math.min(1, (el - acc) / steps[step].dur) });
    }, 60);
    return () => clearInterval(tick);
  }, [steps, restartDelay, reduced]);

  const replay = () => {
    t0.current = Date.now();
    setState({ step: 0, t: 0 });
  };

  return { ...state, replay, reduced };
}
