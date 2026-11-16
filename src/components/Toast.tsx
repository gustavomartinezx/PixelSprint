const tones = {
  info: "bg-surface-2 text-ink",
  success: "bg-success text-ink-dark",
  error: "bg-danger text-ink-dark",
};

export function Toast({
  message,
  tone = "info",
}: {
  message: string | null;
  tone?: keyof typeof tones;
}) {
  return (
    <div
      role="status"
      aria-live="polite"
      className="pointer-events-none fixed inset-x-4 top-4 z-50 flex justify-center"
    >
      {message && (
        <p className={`pixel-border max-w-md px-4 py-3 ${tones[tone]}`}>
          {message}
        </p>
      )}
    </div>
  );
}
