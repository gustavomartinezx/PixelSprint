"use client";

import { useEffect, useId, useRef, type ReactNode } from "react";

type DialogProps = {
  open: boolean;
  onClose: () => void;
  title: string;
  children: ReactNode;
};

export function Dialog({ open, onClose, title, children }: DialogProps) {
  const ref = useRef<HTMLDialogElement>(null);
  const titleId = useId();

  useEffect(() => {
    const dialog = ref.current;
    if (!dialog) return;
    if (open && !dialog.open) dialog.showModal();
    if (!open && dialog.open) dialog.close();
  }, [open]);

  return (
    <dialog
      ref={ref}
      onClose={onClose}
      aria-labelledby={titleId}
      className="pixel-border m-auto w-[calc(100%-2rem)] max-w-md bg-surface p-6 text-ink backdrop:bg-black/70"
    >
      <h2 id={titleId} className="mb-4 font-pixel text-sm leading-6">
        {title}
      </h2>
      {children}
    </dialog>
  );
}
