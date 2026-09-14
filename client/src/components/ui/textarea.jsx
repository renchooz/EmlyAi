import { cn } from "../../lib/utils";

function Textarea({ className, ...props }) {
  return (
    <textarea
      className={cn(
        "w-full resize-none rounded-xl border border-border bg-surface p-3 text-sm text-fg outline-none placeholder:text-fg-subtle focus:border-brand-500 focus:ring-2 focus:ring-brand-500/10 disabled:opacity-50",
        className
      )}
      {...props}
    />
  );
}

export { Textarea };
