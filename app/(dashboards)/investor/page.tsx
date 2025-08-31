import { getServerSupabase } from "@/lib/supabase/server"
import PitchEvaluator from "./ui/pitch-evaluator"
import StartupDirectory from "./ui/startup-directory"
import DealFlowPanel from "./ui/dealflow-panel"
import FeaturePill from "./ui/feature-pill"
import StatCard from "./ui/stat-card"

import InvestorDashboardClient from "./InvestorDashboardClient"

export default async function InvestorDashboardPage() {
  const supabase = getServerSupabase()
  const { data: userData } = await supabase.auth.getUser()

  let startupsCount = 0
  let interestsCount = 0
  let warning: string | null = null

  if (userData?.user) {
    try {
      const { count, error } = await supabase
        .from("startups")
        .select("*", { count: "exact", head: true })
        .eq("created_by", userData.user.id)
      if (!error && typeof count === "number") startupsCount = count ?? 0
    } catch (e: any) {
      warning = "Please run scripts/006_investor.sql to create investor tables."
    }

    try {
      const { count, error } = await supabase
        .from("investor_interests")
        .select("*", { count: "exact", head: true })
        .eq("investor_id", userData.user.id)
      if (!error && typeof count === "number") interestsCount = count ?? 0
    } catch (e: any) {
      warning = "Please run scripts/006_investor.sql to create investor tables."
    }
  }

  return (
    <section className="space-y-6 uppercase">
      {/* Header: match student dashboard glass style */}
      <div className="rounded-2xl bg-black/30 backdrop-blur-lg border border-white/20 p-6 shadow-2xl">
        <div className="flex items-center justify-between gap-4 flex-wrap">
          <div>
            <h1 className="text-4xl lg:text-5xl font-extrabold bg-gradient-to-r from-cyan-400 to-indigo-400 bg-clip-text text-transparent">
              Welcome, Investor
            </h1>
            <p className="text-sm text-gray-300 font-semibold">
              Discover founders. Track portfolio. Back the next big thing.
            </p>
            {warning ? <p className="mt-2 text-yellow-300 text-xs">{warning}</p> : null}
          </div>
          <div className="flex items-center gap-2">
            <span className="rounded-full border border-white/20 text-white/90 text-xs px-3 py-1">
              Startups {startupsCount}
            </span>
            <span className="rounded-full border border-white/20 text-white/90 text-xs px-3 py-1">
              Interests {interestsCount}
            </span>
            <a
              href="/investor/startups"
              className="rounded-lg bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-4 py-2 font-semibold hover:from-blue-700 hover:to-indigo-700"
            >
              Manage Startups
            </a>
            <a
              href="/investor/interests"
              className="rounded-lg bg-white/5 text-gray-200 px-4 py-2 font-semibold hover:bg-white/10"
            >
              Manage Interests
            </a>
          </div>
        </div>

        {/* Brief key features list */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
          <FeaturePill title="Portfolio Overview" />
          <FeaturePill title="Hackathon Deal Flow" />
          <FeaturePill title="Startup Discovery" />
          <FeaturePill title="Pitch Deck Access" />
          <FeaturePill title="Funding Requests" />
          <FeaturePill title="Analytics & Insights" />
          <FeaturePill title="Connect & Network" />
          <FeaturePill title="Events & Hackathons" />
          <FeaturePill title="Community & Updates" />
        </div>
      </div>

      {/* Content grid like student dashboard */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="space-y-6">
          {/* Portfolio Overview */}
          <div className="rounded-2xl bg-black/30 backdrop-blur-lg border border-white/20 shadow-2xl p-6">
            <div className="text-white text-xl font-bold mb-4">Portfolio Overview</div>
            <div className="grid grid-cols-2 gap-4">
              <StatCard label="My Startups" value={String(startupsCount)} />
              <StatCard label="My Interests" value={String(interestsCount)} />
            </div>
            <div className="mt-4 flex items-center gap-2">
              <a
                href="/investor/startups"
                className="rounded-md px-3 py-2 bg-gradient-to-r from-blue-600 to-indigo-600 text-white hover:from-blue-700 hover:to-indigo-700"
              >
                Open Startups
              </a>
              <a href="/investor/interests" className="rounded-md px-3 py-2 bg-white/10 text-white hover:bg-white/20">
                View Interests
              </a>
            </div>
          </div>

          {/* Hackathon Deal Flow (localStorage demo) */}
          <DealFlowPanel />

          {/* Pitch Deck Access and Funding Requests moved to Client Component */}
          <InvestorDashboardClient />
        </div>

        {/* Right column */}
        <div className="space-y-6">
          {/* Startup Discovery (uses existing server StartupDirectory) */}
          <div className="rounded-2xl bg-black/30 backdrop-blur-lg border border-white/20 shadow-2xl p-0 overflow-hidden">
            <div className="p-6">
              <div className="text-white text-xl font-bold mb-1">Startup Discovery</div>
              <p className="text-sm text-gray-300 mb-4">
                AI-curated lists coming soon. For now, browse the full directory.
              </p>
            </div>
            {/* Server component renders real data (no mock) */}
            <div className="px-6 pb-6">
              <StartupDirectory />
            </div>
          </div>

          {/* Analytics & Insights */}
          <div className="rounded-2xl bg-black/30 backdrop-blur-lg border border-white/20 shadow-2xl p-6">
            <div className="text-white text-xl font-bold mb-4">Analytics & Insights</div>
            <div className="grid grid-cols-2 gap-4">
              <StatCard label="Portfolio" value={String(startupsCount)} />
              <StatCard label="Saved" value={String(interestsCount)} />
            </div>
            <p className="text-xs text-gray-400 mt-3">Advanced charts can be added once data is available.</p>
          </div>
        </div>
      </div>

      {/* Full-width panels */}
      <div className="space-y-6">
        {/* Connect & Network */}
        <div className="rounded-2xl bg-black/30 backdrop-blur-lg border border-white/20 shadow-2xl p-6">
          <div className="text-white text-xl font-bold mb-2">Connect & Network</div>
          <p className="text-sm text-gray-300">
            Chat and meeting scheduling with founders, mentors, and organizers. Not connected yet.
          </p>
        </div>

        {/* Events & Hackathons */}
        <div className="rounded-2xl bg-black/30 backdrop-blur-lg border border-white/20 shadow-2xl p-6">
          <div className="text-white text-xl font-bold mb-2">Events & Hackathons</div>
          <p className="text-sm text-gray-300">Exclusive invites, RSVP for demo days and judging panels.</p>
          <p className="text-xs text-gray-400 mt-2">No upcoming events found.</p>
        </div>

        {/* Community & Updates */}
        <div className="rounded-2xl bg-black/30 backdrop-blur-lg border border-white/20 shadow-2xl p-6">
          <div className="text-white text-xl font-bold mb-2">Community & Updates</div>
          <p className="text-sm text-gray-300">
            Newsfeed of innovation, success stories, and portfolio updates. No updates yet.
          </p>
        </div>

        {/* AI Pitch Evaluator (existing client component) */}
        <div className="rounded-2xl bg-black/30 backdrop-blur-lg border border-white/20 shadow-2xl p-6">
          <div className="text-white text-xl font-bold mb-4">AI Pitch Evaluator</div>
          <PitchEvaluator />
        </div>
      </div>
    </section>
  )
}
