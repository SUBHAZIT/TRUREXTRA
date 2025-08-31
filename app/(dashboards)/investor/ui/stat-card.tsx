export default function StatCard({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-xl border border-white/15 bg-white/5 p-4">
      <div className="text-xs text-gray-400">{label}</div>
      <div className="text-xl font-bold text-white">{value}</div>
    </div>
  )
}
