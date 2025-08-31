"use client"

import * as React from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { useLocalStorage } from "@/hooks/use-local-storage"

type Talent = {
  id: string
  name: string
  skills: string
  resumeUrl?: string
  projectUrl?: string
  experience?: number // new optional field
}

type Filters = {
  skills?: string
  minExperience?: number
  eventParticipation?: string
}

export default function TalentDiscoveryPanel() {
  const [talent, setTalent] = useLocalStorage<Talent[]>("recruiter.talent", [])
  const [form, setForm] = React.useState<Partial<Talent>>({})

  const isBrowser = typeof window !== "undefined"
  const savedFilters: Filters = React.useMemo(() => {
    if (!isBrowser) return {}
    try {
      return JSON.parse(window.localStorage.getItem("recruiter.filters") || "{}") as Filters
    } catch {
      return {}
    }
  }, [isBrowser])

  const add = () => {
    if (!form.name) return
    const item: Talent = {
      id: crypto.randomUUID(),
      name: (form.name || "").toString(),
      skills: (form.skills || "").toString(),
      resumeUrl: form.resumeUrl?.toString(),
      projectUrl: form.projectUrl?.toString(),
      experience: form.experience ? Number(form.experience) : undefined, //
    }
    setTalent([...talent, item])
    setForm({})
  }

  const remove = (id: string) => setTalent(talent.filter((t) => t.id !== id))

  const filteredTalent = React.useMemo(() => {
    const fSkills = (savedFilters.skills || "")
      .toLowerCase()
      .split(",")
      .map((s) => s.trim())
      .filter(Boolean)
    const minExp = savedFilters.minExperience
    return talent.filter((t) => {
      let ok = true
      if (fSkills.length) {
        const tSkills = (t.skills || "")
          .toLowerCase()
          .split(",")
          .map((s) => s.trim())
          .filter(Boolean)
        ok = fSkills.some((s) => tSkills.includes(s))
      }
      if (ok && typeof minExp === "number") {
        ok = (t.experience ?? 0) >= minExp
      }
      return ok
    })
  }, [talent, savedFilters])

  return (
    <div>
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-white mb-4">TALENT DISCOVERY</h2>
      </div>
      <div className="grid gap-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          <Input
            placeholder="NAME"
            value={form.name || ""}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
          />
          <Input
            placeholder="SKILLS (COMMA SEPARATED)"
            value={form.skills || ""}
            onChange={(e) => setForm({ ...form, skills: e.target.value })}
          />
          <Input
            placeholder="RESUME URL"
            value={form.resumeUrl || ""}
            onChange={(e) => setForm({ ...form, resumeUrl: e.target.value })}
          />
          <Input
            placeholder="PROJECT URL"
            value={form.projectUrl || ""}
            onChange={(e) => setForm({ ...form, projectUrl: e.target.value })}
          />
          <Input
            placeholder="EXPERIENCE (YEARS)"
            type="number"
            value={form.experience ?? ""}
            onChange={(e) => setForm({ ...form, experience: Number(e.target.value) || undefined })}
          />
        </div>
        <div className="flex gap-2">
          <Button onClick={add} className="border border-border/60 bg-background/30 backdrop-blur-sm">
            ADD CANDIDATE
          </Button>
          {(savedFilters.skills || savedFilters.minExperience) && (
            <span className="text-xs rounded-full border border-border/60 bg-background/30 px-2 py-1 text-foreground/80">
              FILTERS ACTIVE
            </span>
          )}
        </div>

        <div className="grid gap-3">
          {filteredTalent.length === 0 ? (
            <p className="text-sm text-foreground/80">NO CANDIDATES MATCH THE CURRENT FILTERS.</p>
          ) : (
            <ul className="grid gap-2">
              {filteredTalent.map((t) => (
                <li key={t.id} className="rounded-lg border border-border/60 bg-background/20 p-3">
                  <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-2">
                    <div className="min-w-0">
                      <div className="font-medium text-foreground">{t.name}</div>
                      <div className="text-xs text-foreground/80 break-words">SKILLS: {t.skills || "-"}</div>
                      {typeof t.experience === "number" && (
                        <div className="text-xs text-foreground/80">EXPERIENCE: {t.experience}Y</div>
                      )}
                      <div className="text-xs text-foreground/80 flex gap-2 flex-wrap">
                        {t.resumeUrl && (
                          <a className="underline" href={t.resumeUrl} target="_blank" rel="noreferrer">
                            RESUME
                          </a>
                        )}
                        {t.projectUrl && (
                          <a className="underline" href={t.projectUrl} target="_blank" rel="noreferrer">
                            PROJECT
                          </a>
                        )}
                      </div>
                    </div>
                    <Button variant="destructive" onClick={() => remove(t.id)}>
                      REMOVE
                    </Button>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  )
}
