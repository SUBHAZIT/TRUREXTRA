import type React from "react"
import { cn } from "@/lib/utils"

export default function GlassCard({
  className,
  children,
}: {
  className?: string
  children: React.ReactNode
}) {
  return (
    <section
      className={cn(
        "rounded-2xl bg-black/30 backdrop-blur-lg border border-white/20 shadow-2xl p-5 md:p-6 min-w-0 overflow-hidden text-white",
        className,
      )}
    >
      {children}
    </section>
  )
}
