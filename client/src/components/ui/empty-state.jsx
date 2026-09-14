import { cn } from "../../lib/utils";

/**
 * Reusable empty-list state: icon + heading + short copy + optional CTA.
 * Used anywhere a list can legitimately be empty (no fake/placeholder data).
 */
function EmptyState({ icon: Icon, title, description, action, className }) {
  return (
    <div
      className={cn(
        "flex flex-col items-center justify-center rounded-2xl border border-dashed border-border p-12 text-center",
        className
      )}
    >
      {Icon && (
        <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-surface-sunken text-fg-muted">
          <Icon size={30} />
        </div>
      )}

      <h2 className="text-xl font-semibold text-fg">{title}</h2>

      {description && (
        <p className="mt-2 max-w-md text-sm text-fg-muted">{description}</p>
      )}

      {action && <div className="mt-6">{action}</div>}
    </div>
  );
}

export { EmptyState };
