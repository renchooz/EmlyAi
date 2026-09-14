import { Button as ButtonPrimitive } from "@base-ui/react/button";
import { cva } from "class-variance-authority";
import { Loader2 } from "lucide-react";
import { cn } from "../../lib/utils";

const buttonVariants = cva(
  "inline-flex shrink-0 items-center justify-center rounded-full border border-transparent text-sm font-medium transition-all outline-none disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:shrink-0",
  {
    variants: {
      variant: {
        default:
          "bg-brand-500 text-white hover:bg-brand-400 active:bg-brand-600",
        outline:
          "border-border bg-transparent text-fg hover:bg-black/[0.04] hover:border-border-strong",
        secondary: "bg-elevated text-fg border-border hover:bg-surface-sunken",
        ghost: "text-fg-muted hover:bg-black/[0.04] hover:text-fg",
        destructive: "bg-danger/10 text-danger hover:bg-danger/20",
        link: "text-fg underline-offset-4 hover:underline",
      },
      size: {
        default: "h-10 gap-2 px-4",
        sm: "h-8 gap-1.5 px-3 text-xs",
        lg: "h-12 gap-2 px-6 text-base",
        icon: "size-10",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
);

function Button({
  className,
  variant = "default",
  size = "default",
  loading = false,
  disabled,
  children,
  ...props
}) {
  return (
    <ButtonPrimitive
      className={cn(buttonVariants({ variant, size }), className)}
      disabled={disabled || loading}
      {...props}
    >
      {loading ? <Loader2 size={16} className="animate-spin" /> : null}
      {children}
    </ButtonPrimitive>
  );
}

export { Button, buttonVariants };
