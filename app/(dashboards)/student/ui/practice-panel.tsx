"use client"

import { useEffect, useMemo, useState } from "react"
import { questions, type Question, type TestResult, getStarterFor, type Lang } from "../data/question-bank"
import { runUserCode } from "../lib/run-eval"
import { loadProgress, saveProgress, getSolvedCount, saveSubmission } from "../lib/local-store"
import { cn } from "@/lib/utils"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"

const difficultyColors: Record<Question["difficulty"], string> = {
  Easy: "bg-emerald-500/20 text-emerald-300 border-emerald-500/30",
  Medium: "bg-blue-500/20 text-blue-300 border-blue-500/30",
  Hard: "bg-rose-500/20 text-rose-300 border-rose-500/30",
}

export default function PracticePanel() {
  // Seed from stored selection if present
  const initialId = (typeof window !== "undefined" && localStorage.getItem("practice:selectedId")) || questions[0].id
  const [activeId, setActiveId] = useState<string>(initialId as string)
  const [lang, setLang] = useState<Lang>("javascript")
  const [codeById, setCodeById] = useState<Record<string, string>>({})
  const [filter, setFilter] = useState("")
  const [difficulty, setDifficulty] = useState<"All" | Question["difficulty"]>("All")
  const [results, setResults] = useState<TestResult[] | null>(null)
  const [running, setRunning] = useState(false)
  const [message, setMessage] = useState<string | null>(null)

  const q = useMemo(() => questions.find((x) => x.id === activeId)!, [activeId])

  // Load/save per-question code locally
  useEffect(() => {
    const saved = loadProgress()
    setCodeById(saved.codeById || {})
  }, [])
  useEffect(() => {
    saveProgress({ codeById })
  }, [codeById])

  // Update code when language changes
  useEffect(() => {
    setCodeById((prev) => ({ ...prev, [activeId]: getStarterFor(q, lang) }))
  }, [lang, activeId, q])

  // Listen for external open-problem events
  useEffect(() => {
    function onOpen(e: Event) {
      const id = (e as CustomEvent)?.detail?.id as string | undefined
      if (id && questions.some((x) => x.id === id)) {
        setActiveId(id)
        localStorage.setItem("practice:selectedId", id)
        setResults(null)
      }
    }
    window.addEventListener("open-problem" as any, onOpen as any)
    return () => window.removeEventListener("open-problem" as any, onOpen as any)
  }, [])

  const currentCode = codeById[activeId] ?? getStarterFor(q, lang)

  const filtered = useMemo(() => {
    const f = filter.trim().toLowerCase()
    return questions.filter((x) => {
      if (difficulty !== "All" && x.difficulty !== difficulty) return false
      if (!f) return true
      return (
        x.title.toLowerCase().includes(f) ||
        x.topics.join(" ").toLowerCase().includes(f) ||
        x.companies.join(" ").toLowerCase().includes(f)
      )
    })
  }, [filter, difficulty])

  async function onRun() {
    setRunning(true)
    setResults(null)
    try {
      const out = await runUserCode(q, currentCode, lang)
      setResults(out)
    } catch (e: any) {
      setResults([
        {
          index: 0,
          pass: false,
          input: "n/a",
          expected: "n/a",
          got: e?.message || "Error",
          timeMs: 0,
        },
      ])
    } finally {
      setRunning(false)
    }
  }

  async function onSubmit() {
    if (!results) {
      setMessage("Run your code first.")
      setTimeout(() => setMessage(null), 1500)
      return
    }
    const passed = results.every((r) => r.pass)
    saveSubmission({
      questionId: q.id,
      code: currentCode,
      passed,
    })
    try {
      await fetch("/api/submissions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          challenge_id: q.id,
          code: currentCode,
          passed,
          score: passed ? 100 : Math.round((results.filter((r) => r.pass).length / results.length) * 100),
        }),
      })
    } catch {}
    setMessage(passed ? "All tests passed! Submission saved." : "Submitted. Keep going!")
    setTimeout(() => setMessage(null), 1800)
  }

  function onReset() {
    setResults(null)
    setCodeById((m) => ({ ...m, [activeId]: getStarterFor(q, lang) }))
  }

  function onNext(prev = false) {
    const idx = questions.findIndex((x) => x.id === activeId)
    const nextIdx = (idx + (prev ? -1 : 1) + questions.length) % questions.length
    setActiveId(questions[nextIdx].id)
    setResults(null)
    localStorage.setItem("practice:selectedId", questions[nextIdx].id)
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
      {/* Left: problems list */}
      <Card className="lg:col-span-4 bg-black/30 backdrop-blur-lg border-white/20">
        <CardHeader>
          <CardTitle className="text-white text-pretty">Practice Problems</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="flex items-center gap-2">
            <Input
              placeholder="Search title, topic, company"
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
              className="bg-white/5 text-white placeholder:text-gray-400"
            />
            <select
              value={difficulty}
              onChange={(e) => setDifficulty(e.target.value as any)}
              className="rounded-md bg-white/5 text-white px-2 py-2 border border-white/10"
            >
              <option>All</option>
              <option>Easy</option>
              <option>Medium</option>
              <option>Hard</option>
            </select>
          </div>
          <div className="max-h-[520px] overflow-auto pr-1">
            {filtered.map((item) => {
              const solved = getSolvedCount([item.id]) > 0
              return (
                <button
                  key={item.id}
                  onClick={() => setActiveId(item.id)}
                  className={cn(
                    "w-full text-left p-3 rounded-md border mb-2 transition",
                    activeId === item.id ? "border-blue-500/60 bg-blue-500/10" : "border-white/10 hover:bg-white/5",
                  )}
                >
                  <div className="flex items-center justify-between">
                    <div className="font-medium text-white">{item.title}</div>
                    <span className={cn("text-xs px-2 py-0.5 rounded-full border", difficultyColors[item.difficulty])}>
                      {item.difficulty}
                    </span>
                  </div>
                  <div className="mt-1 text-xs text-gray-400">
                    {item.topics.join(", ")} {solved ? " • Solved" : ""}
                  </div>
                </button>
              )
            })}
          </div>
          <div className="text-xs text-gray-400">
            Total questions: {questions.length} • Solved: {getSolvedCount()}
          </div>
        </CardContent>
      </Card>

      {/* Right: description + editor + results */}
      <Card className="lg:col-span-8 bg-black/30 backdrop-blur-lg border-white/20">
        <CardHeader>
          <CardTitle className="text-white flex items-center justify-between">
            <span>{q.title}</span>
            <div className="flex items-center gap-2">
              <Badge className={cn("border", difficultyColors[q.difficulty])}>{q.difficulty}</Badge>
              <Button variant="outline" onClick={() => onNext(true)} disabled={running} className="bg-orange-500 hover:bg-orange-600 text-white border-orange-500">
                Prev
              </Button>
              <Button onClick={() => onNext(false)} disabled={running}>
                Next
              </Button>
            </div>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 xl:grid-cols-2 gap-4">
            <div className="p-3 rounded-lg border border-white/10 bg-white/5">
              <div className="text-sm text-white/90 font-medium mb-2">Problem Statement</div>
              <p className="text-sm text-gray-300 whitespace-pre-wrap">{q.description}</p>
              <div className="mt-3">
                <div className="text-xs text-gray-400">Function Signature</div>
                <code className="text-xs text-blue-200 bg-black/40 px-2 py-1 rounded-md inline-block">
                  {q.signature}
                </code>
              </div>
              <div className="mt-3">
                <div className="text-xs text-gray-400">Example</div>
                <pre className="text-xs text-gray-200 bg-black/40 p-2 rounded-md overflow-auto">{q.example}</pre>
              </div>
              {q.constraints?.length ? (
                <div className="mt-3">
                  <div className="text-xs text-gray-400">Constraints</div>
                  <ul className="list-disc pl-5 text-xs text-gray-300">
                    {q.constraints.map((c, i) => (
                      <li key={i}>{c}</li>
                    ))}
                  </ul>
                </div>
              ) : null}
              <div className="mt-3 flex flex-wrap gap-2">
                {q.topics.map((t) => (
                  <Badge key={t} variant="outline" className="text-xs">
                    {t}
                  </Badge>
                ))}
              </div>
            </div>

            <div className="p-3 rounded-lg border border-white/10 bg-white/5">
              <div className="flex items-center justify-between mb-2">
                <div className="text-sm text-white/90 font-medium">Code Editor</div>
                <div className="flex items-center gap-2">
                  <span className="text-xs text-gray-400">Language:</span>
                  <select
                    value={lang}
                    onChange={(e) => setLang(e.target.value as Lang)}
                    className="rounded-md bg-white/5 text-white px-2 py-1 text-xs border border-white/10"
                  >
                    <option value="javascript">JavaScript</option>
                    <option value="python">Python</option>
                    <option value="java">Java</option>
                    <option value="cpp">C++</option>
                  </select>
                </div>
              </div>
              <Textarea
                className="min-h-[280px] font-mono text-sm bg-black/40 text-white"
                spellCheck={false}
                value={currentCode}
                onChange={(e) => setCodeById((m) => ({ ...m, [activeId]: e.target.value }))}
              />
              <div className="mt-3 flex flex-wrap gap-2">
                <Button size="sm" onClick={onRun} disabled={running}>
                  {running ? "Running..." : "Run Code"}
                </Button>
                <Button size="sm" variant="outline" onClick={onSubmit} disabled={running}>
                  Submit
                </Button>
                <Button size="sm" variant="ghost" onClick={onReset} disabled={running}>
                  Reset
                </Button>
                {message && <span className="text-xs text-blue-300">{message}</span>}
              </div>
            </div>
          </div>

          <div className="p-3 rounded-lg border border-white/10 bg-white/5">
            <div className="text-sm text-white/90 font-medium mb-2">Test Results</div>
            {!results && <div className="text-sm text-gray-400">No results yet. Click "Run Code".</div>}
            {results && (
              <div className="space-y-2">
                {results.map((r, idx) => (
                  <div
                    key={idx}
                    className={cn(
                      "text-xs rounded-md border p-2",
                      r.pass
                        ? "border-emerald-600/30 bg-emerald-500/10 text-emerald-200"
                        : "border-rose-600/30 bg-rose-500/10 text-rose-200",
                    )}
                  >
                    <div className="flex items-center justify-between">
                      <span>
                        {r.pass ? "✓" : "✗"} Test {idx + 1} — {r.timeMs.toFixed(2)}ms
                      </span>
                      <span className="text-[10px] opacity-80">input: {format(r.input)}</span>
                    </div>
                    {!r.pass && (
                      <div className="mt-1 grid grid-cols-1 md:grid-cols-2 gap-2">
                        <div>Expected: {format(r.expected)}</div>
                        <div>Got: {format(r.got)}</div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

function format(v: any) {
  try {
    return typeof v === "string" ? v : JSON.stringify(v)
  } catch {
    return String(v)
  }
}
