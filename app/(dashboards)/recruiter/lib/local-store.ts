"use client"

type RecruiterState = {
  profile?: {
    full_name?: string
    company?: string
    position?: string
    bio?: string
    skills?: string[]
    photo_url?: string
  }
  jobs?: {
    id: string
    title: string
    type: "JOB" | "INTERNSHIP"
    location?: string
    description?: string
    postedAt: number
  }[]
  candidates?: {
    id: string
    name: string
    skills: string
    resumeUrl?: string
    projectUrl?: string
    experience?: number
    addedAt: number
  }[]
}

const KEY = "recruiter-dashboard-state:v1"

function read(): RecruiterState {
  try {
    const raw = localStorage.getItem(KEY)
    return raw ? (JSON.parse(raw) as RecruiterState) : {}
  } catch {
    return {}
  }
}

function write(s: RecruiterState) {
  try {
    localStorage.setItem(KEY, JSON.stringify(s))
  } catch {}
}

export function loadProgress() {
  return read()
}

export function saveProgress(partial: Partial<RecruiterState>) {
  const current = read()
  write({ ...current, ...partial })
}

export function getProfile() {
  const s = read()
  return s.profile || {}
}

export function saveProfile(p: {
  full_name?: string
  company?: string
  position?: string
  bio?: string
  skills?: string[]
  photo_url?: string
}) {
  const s = read()
  write({ ...s, profile: { ...(s.profile || {}), ...p } })
}

export function getJobs() {
  const s = read()
  return s.jobs || []
}

export function addJob(job: {
  title: string
  type: "JOB" | "INTERNSHIP"
  location?: string
  description?: string
}) {
  const s = read()
  const jobs = s.jobs || []
  const newJob = {
    id: crypto.randomUUID(),
    ...job,
    postedAt: Date.now()
  }
  write({ ...s, jobs: [...jobs, newJob] })
  return newJob
}

export function removeJob(id: string) {
  const s = read()
  const jobs = s.jobs || []
  write({ ...s, jobs: jobs.filter(j => j.id !== id) })
}

export function getCandidates() {
  const s = read()
  return s.candidates || []
}

export function addCandidate(candidate: {
  name: string
  skills: string
  resumeUrl?: string
  projectUrl?: string
  experience?: number
}) {
  const s = read()
  const candidates = s.candidates || []
  const newCandidate = {
    id: crypto.randomUUID(),
    ...candidate,
    addedAt: Date.now()
  }
  write({ ...s, candidates: [...candidates, newCandidate] })
  return newCandidate
}

export function removeCandidate(id: string) {
  const s = read()
  const candidates = s.candidates || []
  write({ ...s, candidates: candidates.filter(c => c.id !== id) })
}
