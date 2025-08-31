"use client"

import { useState } from "react"

const roles = [
  { key: "student", label: "Student" },
  { key: "mentor", label: "Mentor" },
  { key: "recruiter", label: "Recruiter" },
  { key: "organizer", label: "Organizer" },
  { key: "investor", label: "Investor" },
  { key: "institute", label: "Institute" },
]

const roleFieldMap: Record<string, { name: string; label: string; type?: string }[]> = {
  student: [
    { name: "institute", label: "Institute" },
    { name: "degree", label: "Degree" },
    { name: "grad_year", label: "Graduation Year" },
  ],
  mentor: [
    { name: "headline", label: "Professional Headline" },
    { name: "experience_years", label: "Years of Experience", type: "number" },
  ],
  recruiter: [
    { name: "company", label: "Company" },
    { name: "position", label: "Position" },
  ],
  organizer: [
    { name: "org_name", label: "Organization Name" },
    { name: "org_type", label: "Organization Type" },
  ],
  investor: [
    { name: "firm", label: "Firm" },
    { name: "focus", label: "Investment Focus" },
  ],
  institute: [
    { name: "institute_name", label: "Institute Name" },
    { name: "domain", label: "Domain" },
  ],
}

export default function OnboardingForm() {
  const [selected, setSelected] = useState<string | null>(null)
  const [fullName, setFullName] = useState("")
  const [meta, setMeta] = useState<Record<string, string>>({})
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const fields = selected ? (roleFieldMap[selected] ?? []) : []

  return (
    <form
      onSubmit={async (e) => {
        e.preventDefault()
        setError(null)
        if (!selected) {
          setError("Please select a role")
          return
        }
        setLoading(true)
        try {
          const res = await fetch("/api/profile", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ full_name: fullName, role: selected }),
          })
          if (!res.ok) {
            const j = await res.json().catch(() => ({}) as any)
            throw new Error(j?.error || "Failed to save profile")
          }
          if (typeof window !== "undefined") window.location.assign("/student")
        } catch (e: any) {
          setError(e?.message || "Failed to save profile")
        } finally {
          setLoading(false)
        }
      }}
      className="space-y-4"
    >
      <div>
        <label className="block text-sm mb-2">Full name</label>
        <input
          className="w-full bg-white/10 border border-white/20 rounded-lg px-4 py-3"
          placeholder="Enter your full name"
          value={fullName}
          onChange={(e) => setFullName(e.target.value)}
        />
      </div>
      <div>
        <label className="block text-sm mb-2">Select role</label>
        <div className="grid grid-cols-2 gap-2">
          {roles.map((r) => (
            <button
              key={r.key}
              type="button"
              onClick={() => setSelected(r.key)}
              className={`px-3 py-2 rounded border ${selected === r.key ? "bg-primary text-primary-foreground" : "bg-white/10 border-white/20"}`}
              aria-pressed={selected === r.key}
            >
              {r.label}
            </button>
          ))}
        </div>
      </div>

      {fields.length ? (
        <div className="grid grid-cols-1 gap-3">
          {fields.map((f) => (
            <div key={f.name}>
              <label className="block text-sm mb-1">{f.label}</label>
              <input
                type={f.type ?? "text"}
                className="w-full bg-white/10 border border-white/20 rounded-lg px-4 py-3"
                value={meta[f.name] ?? ""}
                onChange={(e) => setMeta((m) => ({ ...m, [f.name]: e.target.value }))}
              />
            </div>
          ))}
        </div>
      ) : null}

      {error ? <p className="text-sm text-red-500">{error}</p> : null}

      <button
        type="submit"
        disabled={loading}
        className="w-full bg-gradient-to-r from-blue-500 to-indigo-600 py-3 rounded-lg font-medium uppercase disabled:opacity-60"
      >
        {loading ? "Saving..." : "Save and continue"}
      </button>
    </form>
  )
}
