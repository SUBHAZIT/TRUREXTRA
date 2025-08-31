"use client"

type MentorProfile = {
  name?: string
  headline?: string
  skills?: string[]
  industries?: string[]
  availability?: { day: string; slots: string }[]
}

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

type Mentee = {
  id: string
  name: string
  skills?: string[]
}

const KEYS = {
  profile: "mentor_profile",
  requests: "mentor_requests",
  sessions: "mentor_sessions",
  resources: "mentor_resources",
  mentees: "mentor_mentees",
  notifications: "mentor_notifications",
} as const

function read<T>(key: string, fallback: T): T {
  try {
    const raw = localStorage.getItem(key)
    return raw ? JSON.parse(raw) : fallback
  } catch {
    return fallback
  }
}

function write<T>(key: string, value: T) {
  try {
    localStorage.setItem(key, JSON.stringify(value))
  } catch {}
}

export function addNotification(text: string) {
  const list = read<{ id: string; text: string; at: number }[]>(KEYS.notifications, [])
  list.unshift({ id: `${Date.now()}`, text, at: Date.now() })
  write(KEYS.notifications, list)
}

export function getMentorProfile(): MentorProfile | null {
  return read<MentorProfile | null>(KEYS.profile, null)
}

export function saveMentorProfile(p: MentorProfile) {
  write(KEYS.profile, p)
}

export function getMenteeRequests(): Request[] {
  return read(KEYS.requests, []) as Request[]
}

export function saveMenteeRequests(list: Request[]) {
  write(KEYS.requests, list)
}

export function getSessions(): Session[] {
  return read(KEYS.sessions, []) as Session[]
}

export function saveSessions(list: Session[]) {
  write(KEYS.sessions, list)
}

export function getResources(): Resource[] {
  return read(KEYS.resources, []) as Resource[]
}

export function saveResources(list: Resource[]) {
  write(KEYS.resources, list)
}

export function getMentees(): Mentee[] {
  return read(KEYS.mentees, []) as Mentee[]
}

export function saveMentees(list: Mentee[]) {
  write(KEYS.mentees, list)
}
