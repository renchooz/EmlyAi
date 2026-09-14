import { useEffect, useRef, useState } from "react";
import { useReducedMotion } from "framer-motion";
import { cn } from "../../lib/utils";

/**
 * Scroll-reveal wrapper — fades/rises an element in once it crosses ~94% of
 * the viewport height. Matches the design handoff's `data-reveal` behavior;
 * the handoff notes an IntersectionObserver is an equally valid substitute
 * for its own then-polling implementation, which is what this uses.
 */
export function Reveal({ as: Tag = "div", delay = 0, className, style, children, ...props }) {
  const ref = useRef(null);
  const [shown, setShown] = useState(false);
  const reduced = useReducedMotion();

  useEffect(() => {
    if (reduced) {
      setShown(true);
      return;
    }
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setShown(true);
          io.disconnect();
        }
      },
      { rootMargin: "0px 0px -6% 0px", threshold: 0.01 }
    );
    io.observe(el);
    return () => io.disconnect();
  }, [reduced]);

  return (
    <Tag
      ref={ref}
      className={cn(className)}
      style={{
        ...style,
        opacity: shown ? 1 : 0,
        transform: shown ? "none" : "translate3d(0,28px,0)",
        transition: shown
          ? `opacity .72s cubic-bezier(.2,0,0,1) ${delay}ms, transform .72s cubic-bezier(.2,0,0,1) ${delay}ms`
          : "none",
      }}
      {...props}
    >
      {children}
    </Tag>
  );
}
