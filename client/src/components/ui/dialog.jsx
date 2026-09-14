import { Dialog as DialogPrimitive } from "@base-ui/react/dialog";
import { X } from "lucide-react";
import { cn } from "../../lib/utils";

// Thin wrapper around Base UI's Dialog (already installed — no new
// dependency) giving it EmlyAI's look. Enter/exit is driven by CSS
// transitions keyed off Base UI's own data-starting-style/data-ending-style
// attributes rather than Framer Motion, so it never fights the primitive's
// own mount/unmount timing.

function Dialog(props) {
  return <DialogPrimitive.Root {...props} />;
}

function DialogTrigger(props) {
  return <DialogPrimitive.Trigger {...props} />;
}

function DialogContent({ className, children, showClose = true, ...props }) {
  return (
    <DialogPrimitive.Portal>
      <DialogPrimitive.Backdrop
        className={cn(
          "fixed inset-0 z-50 bg-black/70 backdrop-blur-sm transition-opacity duration-200",
          "data-[starting-style]:opacity-0 data-[ending-style]:opacity-0"
        )}
      />
      <DialogPrimitive.Popup
        className={cn(
          "fixed left-1/2 top-1/2 z-50 w-full max-w-md -translate-x-1/2 -translate-y-1/2 rounded-2xl border border-border bg-elevated p-6 text-fg shadow-2xl outline-none transition-all duration-200",
          "data-[starting-style]:scale-95 data-[starting-style]:opacity-0 data-[ending-style]:scale-95 data-[ending-style]:opacity-0",
          className
        )}
        {...props}
      >
        {children}
        {showClose && (
          <DialogPrimitive.Close className="absolute right-4 top-4 rounded-lg p-1.5 text-fg-subtle transition hover:bg-black/5 hover:text-fg">
            <X size={18} />
          </DialogPrimitive.Close>
        )}
      </DialogPrimitive.Popup>
    </DialogPrimitive.Portal>
  );
}

function DialogTitle({ className, ...props }) {
  return (
    <DialogPrimitive.Title
      className={cn("text-xl font-semibold text-fg", className)}
      {...props}
    />
  );
}

function DialogDescription({ className, ...props }) {
  return (
    <DialogPrimitive.Description
      className={cn("mt-2 text-sm leading-6 text-fg-muted", className)}
      {...props}
    />
  );
}

function DialogFooter({ className, ...props }) {
  return (
    <div
      className={cn("mt-6 flex justify-end gap-3", className)}
      {...props}
    />
  );
}

export {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogTitle,
  DialogDescription,
  DialogFooter,
};
