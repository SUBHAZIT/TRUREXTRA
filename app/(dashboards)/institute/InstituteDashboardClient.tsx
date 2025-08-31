"use client"

import type React from "react"
import { useState } from "react"

import StudentManagementPanel from "./ui/student-management-panel"
import LogoutButton from "@/components/ui/logout-button"
import EventHostingPanel from "./ui/event-hosting-panel"
import CommunityHubPanel from "./ui/community-hub-panel"
import PlacementRecruiterPanel from "./ui/placement-recruiter-panel"
import MentorAlumniPanel from "./ui/mentor-alumni-panel"
import AnalyticsReportsPanel from "./ui/analytics-reports-panel"
import ResourceLibraryPanel from "./ui/resource-library-panel"
import InstituteBrandingPanel from "./ui/institute-branding-panel"
import JudgesDemoPanel from "./ui/judges-demo-panel"

const tabs = [
  { id: "overview", label: "OVERVIEW" },
  { id: "manage", label: "MANAGE" },
] as const

export default function InstituteDashboardClient() {
  const [active, setActive] = useState<(typeof tabs)[number]["id"]>("overview")

  return (
    <main className="relative z-10 flex flex-col gap-6 p-6">
      <div className="rounded-2xl bg-black/30 backdrop-blur-lg border border-white/20 p-6 shadow-2xl">
        <div className="flex items-center justify-between gap-4 flex-wrap">
          <div>
            <h1 className="text-4xl lg:text-5xl font-extrabold bg-gradient-to-r from-cyan-400 to-indigo-400 bg-clip-text text-transparent">
              WELCOME, INSTITUTE
            </h1>
            <p className="text-sm text-gray-300 font-semibold">
              MANAGE STUDENTS • HOST EVENTS • BUILD COMMUNITY • CONNECT WITH RECRUITERS & MENTORS • ANALYZE • PUBLISH •
              SHOWCASE
            </p>
          </div>
          <div className="flex items-center gap-2">
            <LogoutButton />
          </div>
        </div>

        <div className="flex gap-3 mt-6">
          {tabs.map((t) => (
            <button
              key={t.id}
              onClick={() => setActive(t.id)}
              className={`px-4 py-2 rounded-lg font-semibold transition ${
                active === t.id ? "bg-purple-600 text-white" : "bg-white/5 text-gray-300 hover:bg-white/10"
              }`}
            >
              {t.label}
            </button>
          ))}
        </div>
      </div>

      {active === "overview" && (
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3 min-w-0">
          <GlassCard title="STUDENT MANAGEMENT">
            <StudentManagementPanel />
          </GlassCard>

          <GlassCard title="EVENT HOSTING">
            <EventHostingPanel />
          </GlassCard>

          <GlassCard title="COMMUNITY HUB">
            <CommunityHubPanel />
          </GlassCard>

          <GlassCard title="PLACEMENT & RECRUITER CONNECT">
            <PlacementRecruiterPanel />
          </GlassCard>

          <GlassCard title="MENTOR & ALUMNI CONNECT">
            <MentorAlumniPanel />
          </GlassCard>

          <GlassCard title="ANALYTICS & REPORTS">
            <AnalyticsReportsPanel />
          </GlassCard>

          <GlassCard title="RESOURCE LIBRARY">
            <ResourceLibraryPanel />
          </GlassCard>

          <GlassCard title="INSTITUTE BRANDING">
            <InstituteBrandingPanel />
          </GlassCard>

          <GlassCard title="HACKATHON JUDGES DEMO (LOCAL)">
            <JudgesDemoPanel />
          </GlassCard>
        </div>
      )}

      {active === "manage" && (
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 min-w-0">
          <GlassCard title="EVENT HOSTING">
            <EventHostingPanel />
          </GlassCard>
          <GlassCard title="RESOURCE LIBRARY">
            <ResourceLibraryPanel />
          </GlassCard>
        </div>
      )}
    </main>
  )
}

function GlassCard({
  title,
  children,
}: {
  title: string
  children: React.ReactNode
}) {
  return (
    <div className="rounded-2xl bg-black/30 backdrop-blur-lg border border-white/20 shadow-2xl p-6 overflow-hidden min-w-0">
      <div className="text-white text-xl font-bold mb-4 break-words whitespace-normal">{title}</div>
      <div className="min-w-0 overflow-hidden text-white/95">{children}</div>
    </div>
  )
}
