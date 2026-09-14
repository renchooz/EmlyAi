import { cn } from "../lib/utils";

/**
 * Small square brand mark — the real logo's envelope+arrow icon, cropped
 * out of the horizontal lockup (transparent background) — for tight spaces
 * where the full wordmark won't fit cleanly: nav bars, the mobile drawer
 * header, auth screens.
 */
export function BrandMark({ size = 40, className }) {
  return (
    <img
      src="/emlyai-icon.png"
      alt="EmlyAI"
      className={cn("shrink-0 object-contain", className)}
      style={{ width: size, height: size }}
    />
  );
}

/**
 * Full horizontal wordmark lockup (the real logo asset) for anywhere with
 * room for it: expanded sidebar, top nav, auth screens.
 */
export function BrandLockup({ className, height = 28 }) {
  return (
    <img
      src="/emlyai-logo.png"
      alt="EmlyAI — Smarter Resumes. Better Opportunities."
      className={cn("w-auto object-contain", className)}
      style={{ height }}
    />
  );
}
