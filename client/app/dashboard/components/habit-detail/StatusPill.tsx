type StatusPillProps = {
  status: string;
};

export default function StatusPill({ status }: StatusPillProps) {
  const key = status?.toLowerCase();

  const map: Record<string, string> = {
    complete: "bg-green-500/20 text-green-400 border-green-500/40",
    skipped: "bg-yellow-500/20 text-yellow-400 border-yellow-500/40",
    fail: "bg-red-500/20 text-red-400 border-red-500/40",
    failed: "bg-red-500/20 text-red-400 border-red-500/40",
  };

  return (
    <span
      className={
        "text-xs px-2 py-1 rounded-md border capitalize " +
        (map[key] || "text-neutral-400 border-neutral-600 bg-neutral-800")
      }
    >
      {key}
    </span>
  );
}
