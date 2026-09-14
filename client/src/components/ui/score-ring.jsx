import { motion, useReducedMotion } from "framer-motion";
import { cn } from "../../lib/utils";
import { motionPresets } from "../../lib/motion";

const bandColor = (score) => {
  if (score >= 80) return "var(--color-success)";
  if (score >= 60) return "var(--color-warning)";
  return "var(--color-danger)";
};

/**
 * Circular animated progress ring for match/ATS/skill scores. Renders as a
 * real `progressbar` (proper ARIA), stroke animates in once on mount/score
 * change and respects prefers-reduced-motion.
 */
function ScoreRing({ score = 0, size = 140, strokeWidth = 10, label, className }) {
  const reduceMotion = useReducedMotion();
  const clamped = Math.max(0, Math.min(100, score));
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (clamped / 100) * circumference;
  const color = bandColor(clamped);

  return (
    <div
      role="progressbar"
      aria-valuenow={clamped}
      aria-valuemin={0}
      aria-valuemax={100}
      aria-label={label || "Score"}
      className={cn("relative inline-flex items-center justify-center", className)}
      style={{ width: size, height: size }}
    >
      <svg width={size} height={size} className="-rotate-90">
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke="var(--color-surface-sunken)"
          strokeWidth={strokeWidth}
        />
        <motion.circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke={color}
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          strokeDasharray={circumference}
          initial={{ strokeDashoffset: circumference }}
          animate={{ strokeDashoffset: offset }}
          transition={reduceMotion ? { duration: 0.01 } : motionPresets.hero}
        />
      </svg>

      <div className="absolute flex flex-col items-center">
        <span className="text-3xl font-bold text-fg">{Math.round(clamped)}%</span>
        {label && <span className="mt-0.5 text-xs text-fg-muted">{label}</span>}
      </div>
    </div>
  );
}

export { ScoreRing };
