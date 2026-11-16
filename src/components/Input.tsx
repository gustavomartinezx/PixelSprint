import { useId, type ComponentProps } from "react";

type InputProps = ComponentProps<"input"> & { label: string };

export function Input({ label, id, className = "", ...props }: InputProps) {
  const fallbackId = useId();
  const inputId = id ?? fallbackId;
  return (
    <div className="flex flex-col gap-1">
      <label htmlFor={inputId} className="text-sm font-semibold">
        {label}
      </label>
      <input
        id={inputId}
        className={`min-h-11 border-2 border-line bg-bg px-3 py-2 text-ink placeholder:text-ink-muted ${className}`}
        {...props}
      />
    </div>
  );
}
