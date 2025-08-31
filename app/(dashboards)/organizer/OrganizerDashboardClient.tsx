"use client"

import { useMemo, useState } from "react"
import { EventsTable } from "./ui/events-table"
import { EventForm } from "./ui/event-form"
import { ParticipantsTable } from "./ui/participants-table"
import { SubmissionsPanel } from "./ui/submissions-panel"
import { AnalyticsPanel } from "./ui/analytics-panel"
import { FinancePanel } from "./ui/finance-panel"
import { CommunicationPanel } from "./ui/communication-panel"
import { SettingsPanel } from "./ui/settings-panel"
import LogoutButton from "@/components/ui/logout-button"
import { getAll, keys, type OrgEvent, type Participant, type Submission, type Transaction } from "./lib/local-db"

function StatCard({ label, value }: { label: string; value: string | number }) {
  return (
    <div className="rounded-xl border border-white/15 bg-white/5 p-4">
      <div className="text-xs text-gray-400">{label}</div>
      <div className="mt-1 text-xl font-bold text-white">{value}</div>
    </div>
  )
}

export default function OrganizerDashboardClient() {
  const [tab, setTab] = useState<
    "overview" | "events" | "participants" | "submissions" | "analytics" | "finance" | "comms" | "settings"
  >("overview")

  const stats = useMemo(() => {
    const events = getAll<OrgEvent>(keys.events)
    const participants = getAll<Participant>(keys.participants)
    const submissions = getAll<Submission>(keys.submissions)
    const tx = getAll<Transaction>(keys.transactions)
    const revenue = tx.reduce((sum, t) => sum + (Number(t.amount) || 0), 0)
    return {
      events: events.length,
      activeParticipants: participants.filter((p) => p.status === "approved").length,
      submissions: submissions.length,
      revenue,
    }
  }, [tab])

  return (
    <>
      <main className="relative z-10 flex flex-col gap-6 p-6">
        <div className="rounded-2xl bg-black/30 backdrop-blur-lg border border-white/20 p-6 shadow-2xl">
          <div className="flex items-center justify-between gap-4 flex-wrap">
            <div>
              <h1 className="text-4xl lg:text-5xl font-extrabold bg-gradient-to-r from-cyan-400 to-indigo-400 bg-clip-text text-transparent">
                Welcome, Organizer
              </h1>
              <p className="text-sm text-gray-300 font-semibold">
                Manage hackathons, webinars, recruitments. Publish events, track participants, judge submissions, and
                view live analytics.
              </p>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setTab("events")}
                className="rounded-lg bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-4 py-2 font-semibold hover:from-blue-700 hover:to-indigo-700"
              >
                New Event
              </button>
              <button
                onClick={() => setTab("analytics")}
                className="rounded-lg bg-white/5 text-gray-200 px-4 py-2 font-semibold border border-white/20 hover:bg-white/10"
              >
                View Analytics
              </button>
              <LogoutButton />
            </div>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6">
            <StatCard label="Total Events" value={stats.events} />
            <StatCard label="Active Participants" value={stats.activeParticipants} />
            <StatCard label="Submissions" value={stats.submissions} />
            <StatCard label="Revenue" value={`₹${stats.revenue.toLocaleString()}`} />
          </div>

          <div className="flex gap-3 mt-6">
            {(
              [
                ["overview", "Overview"],
                ["events", "Events"],
                ["participants", "Participants"],
                ["submissions", "Submissions"],
                ["analytics", "Analytics"],
                ["finance", "Finance"],
                ["comms", "Communication"],
                ["settings", "Settings"],
              ] as const
            ).map(([key, label]) => (
              <button
                key={key}
                onClick={() => setTab(key)}
                className={`px-4 py-2 rounded-lg font-semibold transition ${
                  tab === key ? "bg-purple-600 text-white" : "bg-white/5 text-gray-300 hover:bg-white/10"
                }`}
              >
                {label}
              </button>
            ))}
          </div>
        </div>

        {tab === "overview" && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="rounded-2xl bg-black/30 backdrop-blur-lg border border-white/20 shadow-2xl p-6">
              <div className="text-white text-xl font-bold mb-4">Create Your First Event</div>
              <p className="text-sm text-gray-300 mb-4">
                Use the multi-step form to configure basics, prizes, timeline, eligibility, and sponsors.
              </p>
              <EventForm />
            </div>

            <div className="rounded-2xl bg-black/30 backdrop-blur-lg border border-white/20 shadow-2xl p-6">
              <div className="text-white text-xl font-bold mb-4">Recent Events</div>
              <EventsTable compact />
            </div>

            <div className="rounded-2xl bg-black/30 backdrop-blur-lg border border-white/20 shadow-2xl p-6 lg:col-span-2">
              <div className="text-white text-xl font-bold mb-4">Analytics</div>
              <AnalyticsPanel compact />
            </div>
          </div>
        )}

        {tab === "events" && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="md:col-span-1 rounded-2xl bg-black/30 backdrop-blur-lg border border-white/20 shadow-2xl p-6">
              <div className="text-white text-xl font-bold mb-4">New / Edit Event</div>
              <EventForm />
            </div>
            <div className="md:col-span-2 rounded-2xl bg-black/30 backdrop-blur-lg border border-white/20 shadow-2xl p-6">
              <div className="text-white text-xl font-bold mb-4">All Events</div>
              <EventsTable />
            </div>
          </div>
        )}

        {tab === "participants" && (
          <div className="rounded-2xl bg-black/30 backdrop-blur-lg border border-white/20 shadow-2xl p-6">
            <div className="text-white text-xl font-bold mb-4">Participants</div>
            <ParticipantsTable />
          </div>
        )}

        {tab === "submissions" && (
          <div className="rounded-2xl bg-black/30 backdrop-blur-lg border border-white/20 shadow-2xl p-6">
            <div className="text-white text-xl font-bold mb-4">Submissions</div>
            <SubmissionsPanel />
          </div>
        )}

        {tab === "analytics" && (
          <div className="rounded-2xl bg-black/30 backdrop-blur-lg border border-white/20 shadow-2xl p-6">
            <div className="text-white text-xl font-bold mb-4">Analytics</div>
            <AnalyticsPanel />
          </div>
        )}

        {tab === "finance" && (
          <div className="rounded-2xl bg-black/30 backdrop-blur-lg border border-white/20 shadow-2xl p-6">
            <div className="text-white text-xl font-bold mb-4">Finance</div>
            <FinancePanel />
          </div>
        )}

        {tab === "comms" && (
          <div className="rounded-2xl bg-black/30 backdrop-blur-lg border border-white/20 shadow-2xl p-6">
            <div className="text-white text-xl font-bold mb-4">Communication</div>
            <CommunicationPanel />
          </div>
        )}

        {tab === "settings" && (
          <div className="rounded-2xl bg-black/30 backdrop-blur-lg border border-white/20 shadow-2xl p-6">
            <div className="text-white text-xl font-bold mb-4">Settings</div>
            <SettingsPanel />
          </div>
        )}
      </main>
    </>
  )
}
