import { useEffect, useState } from "react";

/** Fixed top-of-viewport bar showing scroll progress through the page. */
export function ScrollProgressBar() {
  const [pct, setPct] = useState(0);

  useEffect(() => {
    let raf = null;
    const apply = () => {
      raf = null;
      const doc = document.documentElement;
      const max = doc.scrollHeight - window.innerHeight || 1;
      const y = window.scrollY || doc.scrollTop || 0;
      setPct(Math.min(100, Math.max(0, (y / max) * 100)));
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
  }, []);

  return (
    <div
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        height: 2,
        zIndex: 90,
        pointerEvents: "none",
      }}
    >
      <div
        style={{
          height: "100%",
          width: `${pct}%`,
          background: "linear-gradient(90deg, var(--el-accent-violet), var(--el-accent-orange))",
          transition: "width .12s linear",
        }}
      />
    </div>
  );
}
