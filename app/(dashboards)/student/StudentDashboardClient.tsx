"use client"

import { useMemo, useState, useEffect } from "react"
import PracticePanel from "./ui/practice-panel"
import ProfileCard from "./ui/profile-card"
import Feed from "./ui/feed"
import { questions } from "./data/question-bank"
import { getLocalStats, getNetworkData, updateNetworkProfile, getProfile } from "./lib/local-store"
import StudentLogoutButton from "./ui/logout-button"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

import NetworkPanel from "./ui/network-panel"
import CompetePanel from "./ui/compete-panel"

import CommunityFeed from "./ui/CommunityFeed"

const tabs = [
  { id: "overview", label: "OVERVIEW" },
  { id: "practice", label: "PRACTICE" },
  { id: "profile", label: "PROFILE" },
  { id: "network", label: "NETWORK" },
  { id: "compete", label: "COMPETE" },
  { id: "community", label: "COMMUNITY" },
] as const

export default function StudentDashboardClient() {
  const [active, setActive] = useState<(typeof tabs)[number]["id"]>("overview")
  const stats = getLocalStats()
  const profile = getProfile()
  const level = Math.min(50, 1 + Math.floor(stats.solved / 10))
  const xp = stats.solved * 35
  const studentName = profile.full_name || "STUDENT"

  const [bio, setBio] = useState("")
  const [currentWork, setCurrentWork] = useState("")
  const [pastExperience, setPastExperience] = useState("")
  const [skills, setSkills] = useState("")

  useEffect(() => {
    const data = getNetworkData()
    setBio(data.bio || "")
    setCurrentWork(data.currentWork || "")
    setPastExperience(data.pastExperience?.join(", ") || "")
    setSkills(data.skills?.join(", ") || "")
  }, [])

  const handleUpdateProfile = () => {
    const updates: any = {}
    if (bio.trim()) updates.bio = bio.trim()
    if (currentWork.trim()) updates.currentWork = currentWork.trim()
    if (pastExperience.trim()) updates.pastExperience = pastExperience.split(",").map((e) => e.trim())
    if (skills.trim()) updates.skills = skills.split(",").map((s) => s.trim())
    updateNetworkProfile(updates)
  }

  const todays = useMemo(() => {
    const by = { Easy: [] as typeof questions, Medium: [] as typeof questions, Hard: [] as typeof questions }
    for (const q of questions) (by as any)[q.difficulty]?.push(q)
    const pick = (arr: any[]) => (arr.length ? arr[Math.floor(Math.random() * arr.length)] : null)
    return [pick(by.Easy), pick(by.Medium), pick(by.Hard)].filter(Boolean) as (typeof questions)[number][]
  }, [])

  function openProblem(id: string) {
    window.dispatchEvent(new CustomEvent("open-problem", { detail: { id } }) as any)
    localStorage.setItem("practice:selectedId", id)
    setActive("practice")
  }

  return (
    <main className="relative z-10 flex flex-col gap-6 p-6">
      {/* Header */}
      <div className="rounded-2xl bg-black/30 backdrop-blur-lg border border-white/20 p-6 shadow-2xl">
        <div className="flex items-center justify-between gap-4 flex-wrap">
          <div>
            <h1 className="text-4xl lg:text-5xl font-extrabold bg-gradient-to-r from-cyan-400 to-indigo-400 bg-clip-text text-transparent">
              {`WELCOME, ${studentName}`.toUpperCase()}
            </h1>
            <p className="text-sm text-gray-300 font-semibold">{"BUILD BOLDLY. SOLVE HARDER. ROCK YOUR JOURNEY.".toUpperCase()}</p>
          </div>
          <div className="flex items-center gap-2">
            <span className="rounded-full border border-white/20 text-white/90 text-xs px-3 py-1">{"LEVEL ".toUpperCase()}{level}</span>
            <span className="rounded-full border border-white/20 text-white/90 text-xs px-3 py-1">{xp} {"XP".toUpperCase()}</span>
            <button
              onClick={() => setActive("practice")}
              className="rounded-lg bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-4 py-2 font-semibold hover:from-blue-700 hover:to-indigo-700"
            >
              {"PRACTICE NOW".toUpperCase()}
            </button>
            <button
              onClick={() => window.open('https://edukit.pages.dev/', '_blank')}
              className="rounded-lg bg-gradient-to-r from-green-600 to-teal-600 text-white px-4 py-2 font-semibold hover:from-green-700 hover:to-teal-700"
            >
              {"EDUKIT".toUpperCase()}
            </button>
            <StudentLogoutButton />
          </div>
        </div>

        {/* Stat cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6">
          <StatCard label="Problems Solved" value={String(stats.solved)} />
          <StatCard label="Weekly Goal" value={`${stats.weekly_progress}/10`} />
          <StatCard label="Day Streak" value={`${stats.day_streak} days`} />
          <StatCard label="Total Submissions" value={String(stats.submissions)} />
        </div>

        {/* Tabs */}
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

      {/* Content */}
      {active === "overview" && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="space-y-6">
            {/* Today's Challenges */}
            <div className="rounded-2xl bg-black/30 backdrop-blur-lg border border-white/20 shadow-2xl p-6">
              <div className="text-white text-xl font-bold mb-4">Today's Challenges</div>
              <div className="divide-y divide-white/10">
                {todays.map((t) => (
                  <div key={t.id} className="py-3 flex items-center justify-between">
                    <div>
                      <div className="text-white font-medium">{t.title}</div>
                      <div className="text-xs text-gray-400">{t.topics.join(", ")}</div>
                    </div>
                    <button
                      onClick={() => openProblem(t.id)}
                      className="text-sm rounded-md px-3 py-1 bg-white/10 text-white hover:bg-white/20"
                    >
                      Solve
                    </button>
                  </div>
                ))}
              </div>
            </div>

            {/* Feed: posts + likes */}
            <div className="rounded-2xl bg-black/30 backdrop-blur-lg border border-white/20 shadow-2xl p-6">
              <div className="text-white text-xl font-bold mb-4">Share Your Journey</div>
              <Feed />
            </div>
          </div>

          {/* Recommended and Profile snapshot */}
          <div className="space-y-6">
          {/* Quick Profile */}
          <ProfileCard initialProfile={null} />

          {/* Recommended Problems */}
          <div className="rounded-2xl bg-black/30 backdrop-blur-lg border border-white/20 shadow-2xl p-6">
            <div className="text-white text-xl font-bold mb-4">Recommended Problems</div>
            <div className="space-y-3">
              {questions.slice(0, 6).map((q) => (
                <div
                  key={q.id}
                  className="flex items-center justify-between rounded-lg border border-white/10 bg-white/5 p-3"
                >
                  <div>
                    <div className="text-white font-medium">{q.title}</div>
                    <div className="text-xs text-gray-400">{q.topics.join(", ")}</div>
                  </div>
                  <button
                    onClick={() => openProblem(q.id)}
                    className="rounded-md px-3 py-1 bg-gradient-to-r from-blue-600 to-indigo-600 text-white hover:from-blue-700 hover:to-indigo-700"
                  >
                    Solve
                  </button>
                </div>
              ))}
            </div>
          </div>
          </div>
        </div>
      )}

      {active === "practice" && <PracticePanel />}

      {active === "profile" && (
        <div className="grid grid-cols-1 gap-6">
          <ProfileCard initialProfile={null} />

          {/* Edit Profile */}
          <Card className="bg-black/30 backdrop-blur-lg border border-white/20 shadow-2xl">
            <CardHeader>
              <CardTitle className="text-white">{"EDIT PROFESSIONAL PROFILE".toUpperCase()}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <Textarea
                placeholder="BIO"
                value={bio}
                onChange={(e) => setBio(e.target.value)}
                className="bg-white/10 border-white/20 text-white placeholder:text-gray-400"
              />
              <Input
                placeholder="CURRENT WORK"
                value={currentWork}
                onChange={(e) => setCurrentWork(e.target.value)}
                className="bg-white/10 border-white/20 text-white placeholder:text-gray-400"
              />
              <Input
                placeholder="PAST EXPERIENCE (COMMA SEPARATED)"
                value={pastExperience}
                onChange={(e) => setPastExperience(e.target.value)}
                className="bg-white/10 border-white/20 text-white placeholder:text-gray-400"
              />
              <Input
                placeholder="SKILLS (COMMA SEPARATED)"
                value={skills}
                onChange={(e) => setSkills(e.target.value)}
                className="bg-white/10 border-white/20 text-white placeholder:text-gray-400"
              />
              <Button onClick={handleUpdateProfile} className="bg-blue-600 hover:bg-blue-700">
                {"UPDATE PROFILE".toUpperCase()}
              </Button>
            </CardContent>
          </Card>
        </div>
      )}

      {active === "network" && <NetworkPanel />}

      {active === "compete" && <CompetePanel />}

      {active === "community" && <CommunityFeed />}
    </main>
  )
}

function StatCard({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-xl border border-white/15 bg-white/5 p-4">
      <div className="text-xs text-gray-400">{label}</div>
      <div className="text-xl font-bold text-white">{value}</div>
    </div>
  )
}
