export default function FeaturePill({ title }: { title: string }) {
  return (
    <div
      className="rounded-xl border border-white/15 bg-white/5 p-3 text-sm text-gray-200 font-medium"
      role="note"
      aria-label={title}
      title={title}
    >
      {title}
    </div>
  )
}
