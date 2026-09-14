import { cva } from "class-variance-authority";
import { cn } from "../../lib/utils";

const badgeVariants = cva(
  "inline-flex w-fit items-center justify-center gap-1 rounded-full border px-2.5 py-1 text-xs font-medium whitespace-nowrap",
  {
    variants: {
      variant: {
        default: "border-brand-500/20 bg-brand-500/[0.06] text-fg",
        ai: "border-ai-500/30 bg-ai-500/10 text-ai-500",
        secondary: "border-border bg-surface text-fg-muted",
        outline: "border-border text-fg-muted",
        success: "border-success/30 bg-success/10 text-success",
        warning: "border-warning/30 bg-warning/10 text-warning",
        destructive: "border-danger/30 bg-danger/10 text-danger",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
);

function Badge({ className, variant = "default", ...props }) {
  return (
    <span className={cn(badgeVariants({ variant }), className)} {...props} />
  );
}

export { Badge, badgeVariants };
