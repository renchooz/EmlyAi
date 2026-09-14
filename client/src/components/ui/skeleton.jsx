import { cn } from "../../lib/utils";

/**
 * Shimmering placeholder block — replaces plain "Loading…" text.
 */
function Skeleton({ className, ...props }) {
  return (
    <div
      className={cn(
        "emly-shimmer relative overflow-hidden rounded-lg bg-black/[0.05]",
        className
      )}
      {...props}
    />
  );
}

export { Skeleton };
