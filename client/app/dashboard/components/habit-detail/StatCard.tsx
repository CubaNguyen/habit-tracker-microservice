type StatCardProps = {
  label: string;
  value: number;
  color: string;
};

export default function StatCard({ label, value, color }: StatCardProps) {
  return (
    <div className="bg-neutral-900/60 border border-neutral-800 rounded-xl p-4">
      <div className="text-sm text-neutral-400">{label}</div>
      <div className={`text-2xl font-bold mt-1 ${color}`}>{value}</div>
    </div>
  );
}
