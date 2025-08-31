import type React from "react"
import Helpbot from "./HelpbotClient"

export default function DashboardsLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen">
      <main className="mx-auto max-w-6xl px-4 py-8">{children}</main>
      <Helpbot />
    </div>
  )
}
