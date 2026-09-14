import { useEffect, useRef } from "react";
import { useReducedMotion } from "framer-motion";

/**
 * One of the brand's grainy "Sound Flow" gradient orbs — drifts on its own
 * loop (`animation`) and scroll-parallaxes at rate `k`. Per the design
 * handoff, these are real PNG assets (film-grain texture), never CSS
 * gradients, and the parallax/drift are skipped under reduced motion.
 */
export function ParallaxOrb({ src, k = 0.1, animation, className, style }) {
  const ref = useRef(null);
  const reduced = useReducedMotion();

  useEffect(() => {
    if (reduced) return;
    const el = ref.current;
    if (!el) return;
    let raf = null;
    const apply = () => {
      raf = null;
      const r = el.getBoundingClientRect();
      const vh = window.innerHeight || 900;
      const rel = (r.top + r.height / 2 - vh / 2) / vh;
      el.style.translate = `0 ${(rel * k * vh * -1).toFixed(1)}px`;
    };
    const onScroll = () => {
      if (raf === null) raf = requestAnimationFrame(apply);
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll, { passive: true });
    apply();
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, [k, reduced]);

  return (
    <img
      ref={ref}
      src={src}
      alt=""
      aria-hidden="true"
      className={className}
      style={{
        position: "absolute",
        pointerEvents: "none",
        animation: reduced ? undefined : animation,
        ...style,
      }}
    />
  );
}
