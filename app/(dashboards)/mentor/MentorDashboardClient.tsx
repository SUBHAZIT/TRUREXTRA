"use client"

import { useEffect, useMemo, useState } from "react"
import { Tabs, TabsContent } from "@/components/ui/tabs"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import LogoutButton from "@/components/ui/logout-button"
import QRCode from "react-qr-code"
import { v4 as uuidv4 } from "uuid"
import {
  getMentorProfile,
  saveMentorProfile,
  getMenteeRequests,
  saveMenteeRequests,
  getSessions,
  saveSessions,
  getResources,
  saveResources,
  getMentees,
  saveMentees,
  addNotification,
} from "./lib/local-db"

type Availability = { day: string; slots: string }
type Request = {
  id: string
  name: string
  bio?: string
  skills?: string[]
  status: "pending" | "approved" | "rejected"
  createdAt: number
}
type Session = {
  id: string
  title: string
  type: "1-1" | "group"
  time: string
  link: string
  menteeIds: string[]
  rsvpSent?: boolean
  checkinCode: string
}
type Resource = {
  id: string
  title: string
  note?: string
  fileName?: string
  fileDataUrl?: string
  createdAt: number
}

export default function MentorDashboardClient() {
  const [tab, setTab] = useState("profile")

  // profile
  const [name, setName] = useState("")
  const [headline, setHeadline] = useState("")
  const [skills, setSkills] = useState<string[]>([])
  const [industries, setIndustries] = useState<string[]>([])
  const [availability, setAvailability] = useState<Availability[]>([])

  // mentee requests
  const [requests, setRequests] = useState<Request[]>([])

  // sessions
  const [sessions, setSessions] = useState<Session[]>([])
  const [sessionForm, setSessionForm] = useState({
    title: "",
    type: "1-1" as "1-1" | "group",
    time: "",
  })

  // resources
  const [resources, setResources] = useState<Resource[]>([])

  // mentees
  const [mentees, setMentees] = useState(getMentees())

  useEffect(() => {
    const p = getMentorProfile()
    if (p) {
      setName(p.name || "")
      setHeadline(p.headline || "")
      setSkills(p.skills || [])
      setIndustries(p.industries || [])
      setAvailability(p.availability || [])
    }
    // Ensure status is properly typed
    const loadedRequests = getMenteeRequests().map((r: any) => ({
      ...r,
      status: r.status as "pending" | "approved" | "rejected",
    }))
    setRequests(loadedRequests)
    setSessions(getSessions())
    setResources(getResources())
    setMentees(getMentees())
  }, [])

  function handleSaveProfile() {
    saveMentorProfile({
      name,
      headline,
      skills,
      industries,
      availability,
    })
    addNotification("Profile saved")
  }

  function addSkill(value: string) {
    const v = value.trim()
    if (!v) return
    if (!skills.includes(v)) setSkills([...skills, v])
  }
  function removeSkill(v: string) {
    setSkills(skills.filter((s) => s !== v))
  }

  function addIndustry(value: string) {
    const v = value.trim()
    if (!v) return
    if (!industries.includes(v)) setIndustries([...industries, v])
  }
  function removeIndustry(v: string) {
    setIndustries(industries.filter((s) => s !== v))
  }

  function addAvailability() {
    setAvailability([...availability, { day: "Mon", slots: "10:00-12:00" }])
  }
  function updateAvailability(i: number, patch: Partial<Availability>) {
    setAvailability(availability.map((a, idx) => (idx === i ? { ...a, ...patch } : a)))
  }
  function removeAvailability(i: number) {
    setAvailability(availability.filter((_, idx) => idx !== i))
  }

  // mentee requests
  function approveRequest(id: string) {
    const next: Request[] = []
    for (const r of (requests as Request[])) {
      if (r.id === id) {
        next.push({ ...r, status: "approved" })
      } else {
        next.push(r)
      }
    }
    // @ts-ignore
    setRequests(next)
    // @ts-ignore
    saveMenteeRequests(next)
    // move to mentees list
    const req = next.find((r) => r.id === id)
    if (req && !mentees.find((m) => m.id === req.id)) {
      const updated = [...mentees, { id: req.id, name: req.name, skills: req.skills || [] }]
      setMentees(updated)
      saveMentees(updated)
    }
    addNotification("Mentee approved")
  }

  function rejectRequest(id: string) {
    const next = requests.map((r) => (r.id === id ? { ...r, status: "rejected" } : r))
    setRequests(next)
    saveMenteeRequests(next)
  }

  function addFakeIncomingRequest() {
    const id = crypto.randomUUID ? crypto.randomUUID() : uuidv4()
    const next: Request[] = [
      ...requests,
      {
        id,
        name: "Student " + id.substring(0, 4),
        bio: "Aspiring developer",
        status: "pending" as "pending",
        skills: ["JS"],
        createdAt: Date.now(),
      },
    ]
    setRequests(next)
    saveMenteeRequests(next)
  }

  // sessions
  function createSession() {
    if (!sessionForm.title || !sessionForm.time) return
    const id = crypto.randomUUID ? crypto.randomUUID() : uuidv4()
    const link =
      sessionForm.type === "group"
        ? `https://meet.google.com/${id.slice(0, 3)}-${id.slice(3, 7)}-${id.slice(7, 10)}`
        : `https://zoom.us/j/${id.slice(0, 11)}`

    const s: Session = {
      id,
      title: sessionForm.title,
      type: sessionForm.type,
      time: sessionForm.time,
      link,
      menteeIds: mentees.map((m) => m.id),
      checkinCode: id.slice(0, 6).toUpperCase(),
    }
    const next = [s, ...sessions]
    setSessions(next)
    saveSessions(next)
    setSessionForm({ title: "", type: "1-1", time: "" })
    addNotification("Session created")
  }

  function toggleRSVP(id: string) {
    const next = sessions.map((s) => (s.id === id ? { ...s, rsvpSent: !s.rsvpSent } : s))
    setSessions(next)
    saveSessions(next)
  }

  // resources
  async function handleFileUpload(file: File, title: string, note?: string) {
    const dataUrl = await new Promise<string>((res, rej) => {
      const reader = new FileReader()
      reader.onload = () => res(reader.result as string)
      reader.onerror = rej
      reader.readAsDataURL(file)
    })
    const resource: Resource = {
      id: crypto.randomUUID ? crypto.randomUUID() : uuidv4(),
      title: title || file.name,
      note,
      fileName: file.name,
      fileDataUrl: dataUrl,
      createdAt: Date.now(),
    }
    const next = [resource, ...resources]
    setResources(next)
    saveResources(next)
    addNotification("Resource uploaded")
  }

  // derived stats
  const totalApproved = useMemo(() => requests.filter((r) => r.status === "approved").length, [requests])
  const upcoming = useMemo(() => sessions.filter((s) => new Date(s.time).getTime() >= Date.now()).length, [sessions])

  return (
    <div className="relative z-10 flex flex-col gap-6 p-6">
      <div className="rounded-2xl bg-black/30 backdrop-blur-lg border border-white/20 p-6 shadow-2xl">
        <div className="flex items-center justify-between gap-4 flex-wrap">
          <div>
            <h1 className="text-4xl lg:text-5xl font-extrabold bg-gradient-to-r from-cyan-400 to-indigo-400 bg-clip-text text-transparent uppercase">
              WELCOME, MENTOR
            </h1>
            <p className="text-sm text-gray-300 font-semibold uppercase">
              GUIDE STUDENTS. HOST SESSIONS. TRACK PROGRESS.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setTab("profile")}
              className={`px-4 py-2 rounded-lg font-semibold transition ${
                tab === "profile" ? "bg-purple-600 text-white" : "bg-white/5 text-gray-300 hover:bg-white/10"
              }`}
            >
              PROFILE
            </button>
            <button
              onClick={() => setTab("requests")}
              className={`px-4 py-2 rounded-lg font-semibold transition ${
                tab === "requests" ? "bg-purple-600 text-white" : "bg-white/5 text-gray-300 hover:bg-white/10"
              }`}
            >
              REQUESTS
            </button>
            <button
              onClick={() => setTab("sessions")}
              className={`px-4 py-2 rounded-lg font-semibold transition ${
                tab === "sessions" ? "bg-purple-600 text-white" : "bg-white/5 text-gray-300 hover:bg-white/10"
              }`}
            >
              SESSIONS
            </button>
            <button
              onClick={() => setTab("resources")}
              className={`px-4 py-2 rounded-lg font-semibold transition ${
                tab === "resources" ? "bg-purple-600 text-white" : "bg-white/5 text-gray-300 hover:bg-white/10"
              }`}
            >
              RESOURCES
            </button>
            <button
              onClick={() => setTab("progress")}
              className={`px-4 py-2 rounded-lg font-semibold transition ${
                tab === "progress" ? "bg-purple-600 text-white" : "bg-white/5 text-gray-300 hover:bg-white/10"
              }`}
            >
              PROGRESS
            </button>
            <button
              onClick={() => setTab("assistant")}
              className={`px-4 py-2 rounded-lg font-semibold transition ${
                tab === "assistant" ? "bg-purple-600 text-white" : "bg-white/5 text-gray-300 hover:bg-white/10"
              }`}
            >
              ASSISTANT
            </button>
            <button
              onClick={() => setTab("leaderboard")}
              className={`px-4 py-2 rounded-lg font-semibold transition ${
                tab === "leaderboard" ? "bg-purple-600 text-white" : "bg-white/5 text-gray-300 hover:bg-white/10"
              }`}
            >
              LEADERBOARD
            </button>
            <LogoutButton />
          </div>
        </div>

        {/* Student-like stat cards row */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6">
          <GlassStat label="APPROVED MENTEES" value={String(totalApproved)} />
          <GlassStat label="UPCOMING SESSIONS" value={String(upcoming)} />
          <GlassStat label="RESOURCES SHARED" value={String(resources.length)} />
          <GlassStat label="MENTEES TOTAL" value={String(mentees.length)} />
        </div>
      </div>

      {/* Keep Tabs logic but hide the native TabsList; use our custom pills above */}
      <Tabs value={tab} onValueChange={setTab}>
        {/* PROFILE */}
        <TabsContent value="profile" className="space-y-4">
          <Card className="rounded-2xl bg-black/30 backdrop-blur-lg border border-white/20 shadow-2xl">
            <CardHeader>
              <CardTitle className="uppercase">PROFILE & EXPERTISE</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-3 md:grid-cols-2">
                <div>
                  <label className="text-sm uppercase">NAME</label>
                  <Input value={name} onChange={(e) => setName(e.target.value)} placeholder="YOUR NAME" />
                </div>
                <div>
                  <label className="text-sm uppercase">HEADLINE</label>
                  <Input
                    value={headline}
                    onChange={(e) => setHeadline(e.target.value)}
                    placeholder="E.G., SENIOR BACKEND ENGINEER"
                  />
                </div>
              </div>

              <div className="grid gap-3 md:grid-cols-2">
                <div>
                  <label className="text-sm uppercase">SKILLS</label>
                  <Input
                    placeholder="ADD A SKILL AND PRESS ENTER"
                    onKeyDown={(e) => {
                      if (e.key === "Enter") {
                        e.preventDefault()
                        addSkill((e.target as HTMLInputElement).value)
                        ;(e.target as HTMLInputElement).value = ""
                      }
                    }}
                  />
                  <div className="mt-2 flex flex-wrap gap-2">
                    {skills.map((s) => (
                      <Badge
                        key={s}
                        variant="secondary"
                        className="cursor-pointer uppercase"
                        onClick={() => removeSkill(s)}
                      >
                        {s} ×
                      </Badge>
                    ))}
                  </div>
                </div>
                <div>
                  <label className="text-sm uppercase">INDUSTRIES</label>
                  <Input
                    placeholder="ADD AN INDUSTRY AND PRESS ENTER"
                    onKeyDown={(e) => {
                      if (e.key === "Enter") {
                        e.preventDefault()
                        addIndustry((e.target as HTMLInputElement).value)
                        ;(e.target as HTMLInputElement).value = ""
                      }
                    }}
                  />
                  <div className="mt-2 flex flex-wrap gap-2">
                    {industries.map((s) => (
                      <Badge
                        key={s}
                        variant="secondary"
                        className="cursor-pointer uppercase"
                        onClick={() => removeIndustry(s)}
                      >
                        {s} ×
                      </Badge>
                    ))}
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <label className="text-sm uppercase">AVAILABILITY</label>
                  <Button size="sm" className="uppercase" onClick={addAvailability}>
                    ADD
                  </Button>
                </div>
                <div className="grid gap-3">
                  {availability.map((a, i) => (
                    <div key={i} className="grid gap-2 md:grid-cols-3">
                      <Input
                        value={a.day}
                        onChange={(e) => updateAvailability(i, { day: e.target.value })}
                        placeholder="DAY (MON)"
                      />
                      <Input
                        value={a.slots}
                        onChange={(e) => updateAvailability(i, { slots: e.target.value })}
                        placeholder="SLOTS (10:00-12:00)"
                      />
                      <Button
                        variant="outline"
                        className="uppercase bg-transparent"
                        onClick={() => removeAvailability(i)}
                      >
                        REMOVE
                      </Button>
                    </div>
                  ))}
                </div>
              </div>

              <div className="flex justify-end">
                <Button className="uppercase" onClick={handleSaveProfile}>
                  SAVE PROFILE
                </Button>
              </div>
            </CardContent>
          </Card>

          <Card className="rounded-2xl bg-black/30 backdrop-blur-lg border border-white/20 shadow-2xl">
            <CardHeader>
              <CardTitle className="uppercase">AT A GLANCE</CardTitle>
            </CardHeader>
            <CardContent className="grid gap-4 md:grid-cols-3">
              <Stat label="APPROVED MENTEES" value={totalApproved} />
              <Stat label="UPCOMING SESSIONS" value={upcoming} />
              <Stat label="RESOURCES SHARED" value={resources.length} />
            </CardContent>
          </Card>
        </TabsContent>

        {/* REQUESTS */}
        <TabsContent value="requests" className="space-y-4">
          <div className="rounded-2xl bg-black/30 backdrop-blur-lg border border-white/20 shadow-2xl p-4 flex items-center justify-between">
            <h2 className="text-lg font-medium uppercase">MENTEE REQUESTS</h2>
            <Button variant="outline" className="uppercase bg-transparent" onClick={addFakeIncomingRequest}>
              ADD INCOMING REQUEST
            </Button>
          </div>
          <div className="grid gap-4 md:grid-cols-2">
            {requests.map((r) => (
              <Card key={r.id} className="rounded-2xl bg-black/30 backdrop-blur-lg border border-white/20 shadow-2xl">
                <CardHeader>
                  <CardTitle className="flex items-center justify-between">
                    <span className="uppercase">{r.name}</span>
                    <Badge
                      variant={
                        r.status === "pending" ? "secondary" : r.status === "approved" ? "default" : "destructive"
                      }
                      className="uppercase"
                    >
                      {r.status}
                    </Badge>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <p className="text-sm text-muted-foreground uppercase">{r.bio || "NO BIO"}</p>
                  <div className="flex flex-wrap gap-2">
                    {(r.skills || []).map((s) => (
                      <Badge key={s} variant="outline" className="uppercase">
                        {s}
                      </Badge>
                    ))}
                  </div>
                  <div className="flex gap-2">
                    <Button size="sm" className="uppercase" onClick={() => approveRequest(r.id)}>
                      APPROVE
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      className="uppercase bg-transparent"
                      onClick={() => rejectRequest(r.id)}
                    >
                      REJECT
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
            {requests.length === 0 && <p className="text-sm text-muted-foreground uppercase">NO REQUESTS YET.</p>}
          </div>
        </TabsContent>

        {/* SESSIONS */}
        <TabsContent value="sessions" className="space-y-4">
          <Card className="rounded-2xl bg-black/30 backdrop-blur-lg border border-white/20 shadow-2xl">
            <CardHeader>
              <CardTitle className="uppercase">SCHEDULE SESSION</CardTitle>
            </CardHeader>
            <CardContent className="grid gap-3 md:grid-cols-4">
              <Input
                placeholder="TITLE"
                value={sessionForm.title}
                onChange={(e) => setSessionForm({ ...sessionForm, title: e.target.value })}
              />
              <select
                className="h-10 rounded-md border bg-background px-3 text-sm uppercase"
                value={sessionForm.type}
                onChange={(e) => setSessionForm({ ...sessionForm, type: e.target.value as "1-1" | "group" })}
              >
                <option value="1-1">1:1</option>
                <option value="group">GROUP</option>
              </select>
              <Input
                type="datetime-local"
                value={sessionForm.time}
                onChange={(e) => setSessionForm({ ...sessionForm, time: e.target.value })}
              />
              <Button className="uppercase" onClick={createSession}>
                CREATE
              </Button>
            </CardContent>
          </Card>

          <div className="grid gap-4 md:grid-cols-2">
            {sessions.map((s) => (
              <Card key={s.id} className="rounded-2xl bg-black/30 backdrop-blur-lg border border-white/20 shadow-2xl">
                <CardHeader>
                  <CardTitle className="flex items-center justify-between">
                    <span className="uppercase">
                      {s.title} • {s.type}
                    </span>
                    <Badge variant="secondary" className="uppercase">
                      {new Date(s.time).toLocaleString()}
                    </Badge>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="text-sm uppercase">
                      MEETING LINK:{" "}
                      <a className="underline" href={s.link} target="_blank" rel="noreferrer">
                        {s.link}
                      </a>
                    </div>
                    <Button
                      size="sm"
                      className="uppercase"
                      variant={s.rsvpSent ? "secondary" : "default"}
                      onClick={() => toggleRSVP(s.id)}
                    >
                      {s.rsvpSent ? "RSVP SENT" : "SEND RSVPS"}
                    </Button>
                  </div>
                  <div>
                    <p className="text-sm mb-2 uppercase">
                      QR CHECK-IN CODE: <b>{s.checkinCode}</b>
                    </p>
                    <div className="bg-white p-3 inline-block rounded-md">
                      <QRCode value={`session:${s.id}:${s.checkinCode}`} size={96} />
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
            {sessions.length === 0 && <p className="text-sm text-muted-foreground uppercase">NO SESSIONS YET.</p>}
          </div>
        </TabsContent>

        {/* RESOURCES */}
        <TabsContent value="resources" className="space-y-4">
          <Card className="rounded-2xl bg-black/30 backdrop-blur-lg border border-white/20 shadow-2xl">
            <CardHeader>
              <CardTitle className="uppercase">UPLOAD RESOURCE</CardTitle>
            </CardHeader>
            <CardContent className="grid gap-3 md:grid-cols-4">
              <Input id="res_title" placeholder="TITLE" />
              <Input id="res_note" placeholder="NOTE (OPTIONAL)" />
              <Input id="res_file" type="file" />
              <Button
                className="uppercase"
                onClick={() => {
                  const fileInput = document.getElementById("res_file") as HTMLInputElement
                  const titleInput = document.getElementById("res_title") as HTMLInputElement
                  const noteInput = document.getElementById("res_note") as HTMLInputElement
                  const f = fileInput?.files?.[0]
                  if (!f) return
                  handleFileUpload(f, titleInput.value, noteInput.value)
                  titleInput.value = ""
                  noteInput.value = ""
                  if (fileInput) fileInput.value = ""
                }}
              >
                UPLOAD
              </Button>
            </CardContent>
          </Card>

          <div className="grid gap-4 md:grid-cols-3">
            {resources.map((r) => (
              <Card key={r.id} className="rounded-2xl bg-black/30 backdrop-blur-lg border border-white/20 shadow-2xl">
                <CardHeader>
                  <CardTitle className="truncate uppercase">{r.title}</CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  {r.note && <p className="text-sm text-muted-foreground uppercase">{r.note}</p>}
                  {r.fileDataUrl && (
                    <a className="text-sm underline uppercase" href={r.fileDataUrl} download={r.fileName || "resource"}>
                      DOWNLOAD
                    </a>
                  )}
                  <div className="text-xs text-muted-foreground uppercase">
                    {new Date(r.createdAt).toLocaleString()}
                  </div>
                </CardContent>
              </Card>
            ))}
            {resources.length === 0 && (
              <p className="text-sm text-muted-foreground uppercase">NO RESOURCES SHARED YET.</p>
            )}
          </div>
        </TabsContent>

        {/* PROGRESS */}
        <TabsContent value="progress" className="space-y-4">
          <Card className="rounded-2xl bg-black/30 backdrop-blur-lg border border-white/20 shadow-2xl">
            <CardHeader>
              <CardTitle className="uppercase">MENTEE PROGRESS</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {mentees.length === 0 && <p className="text-sm text-muted-foreground uppercase">NO MENTEES YET.</p>}
              <div className="grid gap-4 md:grid-cols-2">
                {mentees.map((m: any) => (
                  <Card
                    key={m.id}
                    className="rounded-2xl bg-black/30 backdrop-blur-lg border border-white/20 shadow-2xl"
                  >
                    <CardHeader>
                      <CardTitle className="flex items-center justify-between">
                        <span className="uppercase">{m.name}</span>
                        <Badge variant="secondary" className="uppercase">
                          {(m.skills || []).join(", ") || "NO SKILLS LISTED"}
                        </Badge>
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-2">
                      <ProgressRow label="PROBLEMS SOLVED" value={m.metrics?.solved || 0} />
                      <ProgressRow label="STREAK (DAYS)" value={m.metrics?.streak || 0} />
                      <ProgressRow label="HACKATHONS" value={m.metrics?.hackathons || 0} />
                      <Button
                        size="sm"
                        variant="outline"
                        className="uppercase bg-transparent"
                        onClick={() =>
                          fetch("/api/mentor/ai", {
                            method: "POST",
                            headers: { "Content-Type": "application/json" },
                            body: JSON.stringify({ action: "summarize", mentee: m }),
                          })
                            .then((r) => r.json())
                            .then((d) => alert(d.text))
                            .catch(() => alert("AI ASSISTANT UNAVAILABLE"))
                        }
                      >
                        ASK AI SUMMARY
                      </Button>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* ASSISTANT */}
        <TabsContent value="assistant" className="space-y-4">
          <Card className="rounded-2xl bg-black/30 backdrop-blur-lg border border-white/20 shadow-2xl">
            <CardHeader>
              <CardTitle className="uppercase">AI ASSISTANT</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <p className="text-sm text-muted-foreground uppercase">
                PROVIDE A MENTEE GOAL. SPHINIX AI WILL PROPOSE A LEARNING PATH.
              </p>
              <Textarea id="ai_goal" placeholder="E.G., HELP JANE LEARN DATA STRUCTURES FOR INTERVIEWS" />
              <Button
                className="uppercase"
                onClick={() => {
                  const t = (document.getElementById("ai_goal") as HTMLTextAreaElement)?.value || ""
                  fetch("/api/mentor/ai", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ action: "plan", goal: t }),
                  })
                    .then((r) => r.json())
                    .then((d) => {
                      alert(d.text)
                    })
                    .catch(() => alert("AI ASSISTANT UNAVAILABLE"))
                }}
              >
                GENERATE PLAN
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        {/* LEADERBOARD */}
        <TabsContent value="leaderboard">
          <Card className="rounded-2xl bg-black/30 backdrop-blur-lg border border-white/20 shadow-2xl">
            <CardHeader>
              <CardTitle className="uppercase">RECOGNITION</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <p className="text-sm text-muted-foreground uppercase">
                BASED ON SESSIONS CREATED, RESOURCES SHARED, AND MENTEES APPROVED.
              </p>
              <ol className="list-decimal pl-5 space-y-1 uppercase">
                <li>YOU • SCORE {sessions.length * 2 + resources.length + totalApproved * 3}</li>
                <li>MENTOR A • SCORE 21</li>
                <li>MENTOR B • SCORE 17</li>
              </ol>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}

function GlassStat({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-xl border border-white/15 bg-white/5 p-4">
      <div className="text-xs text-gray-400 uppercase">{label}</div>
      <div className="text-xl font-bold text-white">{value}</div>
    </div>
  )
}

// Restyle small Stat rows to match student card tokens a bit closer
function Stat({ label, value }: { label: string; value: number | string }) {
  return (
    <div className="rounded-xl border border-white/15 bg-white/5 p-4">
      <div className="text-sm text-gray-400 uppercase">{label}</div>
      <div className="text-2xl font-semibold text-white">{value}</div>
    </div>
  )
}

function ProgressRow({ label, value }: { label: string; value: number }) {
  return (
    <div className="flex items-center justify-between text-sm">
      <span className="text-muted-foreground uppercase">{label}</span>
      <span className="font-medium">{value}</span>
    </div>
  )
}
