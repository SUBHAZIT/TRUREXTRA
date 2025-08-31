"use client"
import useSWR from "swr"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { getLocalStats } from "../lib/local-store"

const fetcher = (url: string) =>
  fetch(url)
    .then((r) => r.json())
    .catch(() => null)

export function ProgressCards() {
  const { data: subs } = useSWR("/api/submissions", fetcher)
  const local = getLocalStats()
  const solved = subs?.stats?.solved ?? local.solved
  const dayStreak = subs?.stats?.day_streak ?? local.day_streak
  const weeklyGoal = 10
  const weeklySolved = subs?.stats?.weekly_solved ?? local.weekly_solved
  const contestRating = subs?.stats?.contest_rating ?? local.contest_rating

  // Placeholder skills data
  const skills = [
    { name: "JavaScript", progress: 85 },
    { name: "Python", progress: 78 },
    { name: "React", progress: 92 },
    { name: "Data Structures", progress: 72 },
    { name: "Algorithms", progress: 68 },
  ]

  // Placeholder achievements data
  const achievements = [
    { title: "Problem Solver", description: "Solved 300+ problems", icon: "</>" },
    { title: "Streak Master", description: "150-day coding streak", icon: "🔥" },
    { title: "Contest Winner", description: "Won 5 competitions", icon: "🏆" },
    { title: "Network Builder", description: "1000+ connections", icon: "⭐", disabled: true },
  ]

  // Placeholder activity data (problems solved per day)
  const activity = [
    { day: "Mon", count: 3 },
    { day: "Tue", count: 5 },
    { day: "Wed", count: 2 },
    { day: "Thu", count: 8 },
    { day: "Fri", count: 1 },
    { day: "Sat", count: 4 },
    { day: "Sun", count: 6 },
  ]

  return (
    <div className="space-y-8">
      {/* Coding Progress */}
      <Card className="bg-black/30 backdrop-blur-lg border border-white/20 shadow-2xl p-6">
        <CardHeader>
          <CardTitle className="text-white text-xl font-bold flex items-center gap-2">
            <span>↗</span> Coding Progress
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex justify-between mb-4">
            <div className="text-center">
              <div className="text-2xl font-extrabold text-blue-400">{solved}</div>
              <div className="text-sm text-gray-300">Problems Solved</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-extrabold text-blue-600">{dayStreak}</div>
              <div className="text-sm text-gray-300">Day Streak</div>
            </div>
          </div>
          <div className="mb-2 text-sm text-gray-400 flex justify-between">
            <span>Weekly Goal</span>
            <span>
              {weeklySolved}/{weeklyGoal} problems
            </span>
          </div>
          <Progress value={(weeklySolved / weeklyGoal) * 100} className="h-2 rounded-full mb-4" />
          <div className="mb-2 text-sm text-gray-400 flex justify-between">
            <span>Contest Rating</span>
            <Badge variant="outline" className="text-xs">
              {contestRating} (Expert)
            </Badge>
          </div>
          <Progress value={(contestRating / 2000) * 100} className="h-2 rounded-full" />
          <div className="text-xs text-gray-500 mt-1">Next: Master (2000+)</div>
        </CardContent>
      </Card>

      {/* Skills Overview */}
      <Card className="bg-black/30 backdrop-blur-lg border border-white/20 shadow-2xl p-6">
        <CardHeader>
          <CardTitle className="text-white text-xl font-bold flex items-center gap-2">
            <span>🎯</span> Skills Overview
          </CardTitle>
        </CardHeader>
        <CardContent>
          {skills.map((skill) => (
            <div key={skill.name} className="mb-3 last:mb-0">
              <div className="flex justify-between mb-1 text-gray-300">
                <span>{skill.name}</span>
                <span>{skill.progress}%</span>
              </div>
              <Progress value={skill.progress} className="h-2 rounded-full" />
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Achievements */}
      <Card className="bg-black/30 backdrop-blur-lg border border-white/20 shadow-2xl p-6">
        <CardHeader>
          <CardTitle className="text-white text-xl font-bold flex items-center gap-2">
            <span>🎖️</span> Achievements
          </CardTitle>
        </CardHeader>
        <CardContent>
          {achievements.map((ach) => (
            <div
              key={ach.title}
              className={`flex items-center justify-between p-3 mb-3 rounded-lg border ${
                ach.disabled ? "border-gray-600 text-gray-500" : "border-purple-500 text-purple-300"
              }`}
            >
              <div className="flex items-center gap-3">
                <div className="text-lg">{ach.icon}</div>
                <div>
                  <div className={`font-semibold ${ach.disabled ? "text-gray-400" : "text-purple-300"}`}>
                    {ach.title}
                  </div>
                  <div className="text-xs">{ach.description}</div>
                </div>
              </div>
              {!ach.disabled && <div className="text-purple-400">★</div>}
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Activity This Week */}
      <Card className="bg-black/30 backdrop-blur-lg border border-white/20 shadow-2xl p-6">
        <CardHeader>
          <CardTitle className="text-white text-xl font-bold flex items-center gap-2">
            <span>📅</span> Activity This Week
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex justify-between text-gray-400 mb-2">
            {activity.map((day) => (
              <div key={day.day} className="text-center">
                <div className="mb-1">{day.day}</div>
                <div
                  className={`w-6 h-6 mx-auto rounded-full text-white flex items-center justify-center ${
                    day.count === 0
                      ? "bg-gray-700"
                      : day.count < 3
                        ? "bg-blue-600"
                        : day.count < 6
                          ? "bg-purple-600"
                          : "bg-pink-600"
                  }`}
                >
                  {day.count}
                </div>
              </div>
            ))}
          </div>
          <div className="text-center text-gray-400 text-xs">Problems solved per day</div>
        </CardContent>
      </Card>
    </div>
  )
}
