import type { ComponentProps } from "react";

export function Card({ className = "", ...props }: ComponentProps<"div">) {
  return (
    <div className={`pixel-border bg-surface p-4 ${className}`} {...props} />
  );
}
