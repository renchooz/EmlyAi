import { cn } from "../../lib/utils";

function Card({ className, ...props }) {
  return (
    <div
      className={cn(
        "rounded-2xl border border-border bg-elevated text-fg shadow-sm",
        className
      )}
      {...props}
    />
  );
}

function CardHeader({ className, ...props }) {
  return <div className={cn("p-5 pb-2", className)} {...props} />;
}

function CardTitle({ className, ...props }) {
  return (
    <h3 className={cn("text-lg font-semibold text-fg", className)} {...props} />
  );
}

function CardDescription({ className, ...props }) {
  return (
    <p className={cn("text-sm text-fg-muted", className)} {...props} />
  );
}

function CardContent({ className, ...props }) {
  return <div className={cn("p-5", className)} {...props} />;
}

function CardFooter({ className, ...props }) {
  return (
    <div className={cn("border-t border-border p-5", className)} {...props} />
  );
}

export {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
};
