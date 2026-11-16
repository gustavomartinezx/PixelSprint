import type { ComponentProps } from "react";

const variants = {
  primary: "bg-primary text-ink-dark",
  secondary: "bg-surface-2 text-ink",
  danger: "bg-danger text-ink-dark",
};

type ButtonProps = ComponentProps<"button"> & {
  variant?: keyof typeof variants;
};

export function Button({
  variant = "primary",
  className = "",
  ...props
}: ButtonProps) {
  return (
    <button
      type="button"
      className={`pixel-border min-h-11 px-4 py-2 font-pixel text-xs uppercase active:translate-x-0.5 active:translate-y-0.5 active:shadow-pixel-sm disabled:cursor-not-allowed disabled:opacity-50 ${variants[variant]} ${className}`}
      {...props}
    />
  );
}
