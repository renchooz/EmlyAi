import { useEffect, useState } from "react";
import { useReducedMotion } from "framer-motion";

/** Window-mousemove-driven 3D tilt, normalized to viewport center. */
export function useTilt() {
  const reduced = useReducedMotion();
  const [tilt, setTilt] = useState({ rx: 0, ry: 0 });

  useEffect(() => {
    if (reduced) return;
    const onMove = (e) => {
      const w = window.innerWidth || 1200;
      const h = window.innerHeight || 900;
      setTilt({
        ry: (e.clientX / w - 0.5) * 18,
        rx: -(e.clientY / h - 0.5) * 12,
      });
    };
    window.addEventListener("mousemove", onMove, { passive: true });
    return () => window.removeEventListener("mousemove", onMove);
  }, [reduced]);

  return tilt;
}
