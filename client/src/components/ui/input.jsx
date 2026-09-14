import { Input as InputPrimitive } from "@base-ui/react/input";
import { cn } from "../../lib/utils";

function Input({ className, type = "text", ...props }) {
  return (
    <InputPrimitive
      type={type}
      className={cn(
        "h-11 w-full rounded-xl border border-border bg-surface px-3 text-sm text-fg outline-none placeholder:text-fg-subtle focus:border-brand-500 focus:ring-2 focus:ring-brand-500/10 disabled:opacity-50",
        className
      )}
      {...props}
    />
  );
}

export { Input };
