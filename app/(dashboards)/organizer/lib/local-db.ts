// localStorage-backed organizer "DB" (client only)
"use client"

export type OrgEvent = {
  id: string
  title: string
  type: "Hackathon" | "Quiz" | "Webinar" | "Recruitment"
  status: "draft" | "published"
  prizes?: string
  timeline?: string
  eligibility?: string
  sponsors?: string
  createdAt: number
}

export type Participant = {
  id: string
  name: string
  email: string
  role: "student" | "professional" | "mentor"
  eventId?: string
  status: "pending" | "approved" | "rejected"
  createdAt: number
}

export type Submission = {
  id: string
  eventId: string
  team: string
  repo?: string
  files?: { name: string; dataUrl: string }[]
  ppt?: string
  score?: number
  judgeNote?: string
  createdAt: number
}

export type Transaction = {
  id: string
  eventId?: string
  gateway: "Stripe" | "Razorpay" | "PayPal" | "Manual"
  amount: number
  currency: string
  status: "success" | "failed" | "pending"
  createdAt: number
}

export type Message = {
  id: string
  title: string
  body: string
  scheduleAt?: number
  createdAt: number
}

export const keys = {
  events: "org_events",
  participants: "org_participants",
  submissions: "org_submissions",
  transactions: "org_transactions",
  messages: "org_messages",
  settings: "org_settings",
} as const

export function uid(prefix = "id") {
  return `${prefix}_${Math.random().toString(36).slice(2, 9)}_${Date.now()}`
}

function read<T>(k: string): T[] {
  if (typeof window === "undefined") return []
  try {
    const raw = localStorage.getItem(k)
    return raw ? (JSON.parse(raw) as T[]) : []
  } catch {
    return []
  }
}

function write<T>(k: string, data: T[]) {
  if (typeof window === "undefined") return
  localStorage.setItem(k, JSON.stringify(data))
}

export function getAll<T>(k: string): T[] {
  return read<T>(k)
}
export function addOne<T>(k: string, item: T) {
  const cur = read<T>(k)
  cur.unshift(item)
  write<T>(k, cur)
}
export function updateOne<T extends { id: string }>(k: string, item: T) {
  const cur = read<T>(k).map((x) => ((x as any).id === item.id ? item : x))
  write<T>(k, cur)
}
export function removeOne(k: string, id: string) {
  const cur = read<any>(k).filter((x: any) => x.id !== id)
  write(k, cur)
}
