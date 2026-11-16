import type { ReactNode } from "react";

const tones = {
  neutral: "bg-surface-2 text-ink",
  accent: "bg-accent text-ink-dark",
  success: "bg-success text-ink-dark",
};

export function Badge({
  tone = "neutral",
  children,
}: {
  tone?: keyof typeof tones;
  children: ReactNode;
}) {
  return (
    <span
      className={`inline-block border-2 border-black px-2 py-1 font-pixel text-[0.625rem] leading-none uppercase ${tones[tone]}`}
    >
      {children}
    </span>
  );
}
