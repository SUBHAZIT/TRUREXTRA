"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useLocalStorage } from "@/hooks/use-local-storage"

type Recruiter = {
  id: string
  company: string
  email?: string
}

const LS_KEY = "inst_recruiters"

export default function PlacementRecruiterPanel() {
  const [recruiters, setRecruiters] = useLocalStorage<Recruiter[]>(LS_KEY, [])
  const [company, setCompany] = useState("")
  const [email, setEmail] = useState("")

  function addRecruiter() {
    if (!company.trim()) return
    const r: Recruiter = { id: crypto.randomUUID(), company: company.trim(), email: email.trim() || undefined }
    setRecruiters((prev) => [r, ...prev])
    setCompany("")
    setEmail("")
  }

  function remove(id: string) {
    setRecruiters((prev) => prev.filter((r) => r.id !== id))
  }

  return (
    <div className="space-y-3">
      <p className="text-sm text-foreground/80">SHARE TALENT POOL WITH RECRUITERS AND MANAGE PLACEMENT DRIVES.</p>

      <div className="rounded-lg border border-border/60 bg-background/10 p-4 backdrop-blur-sm">
        <div className="grid gap-3 md:grid-cols-3">
          <div className="space-y-1.5">
            <Label htmlFor="rec-company">COMPANY</Label>
            <Input
              id="rec-company"
              value={company}
              onChange={(e) => setCompany(e.target.value)}
              placeholder="COMPANY NAME"
            />
          </div>
          <div className="space-y-1.5 md:col-span-2">
            <Label htmlFor="rec-email">EMAIL (OPTIONAL)</Label>
            <Input
              id="rec-email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="CONTACT@COMPANY.COM"
            />
          </div>
        </div>
        <div className="mt-3 flex items-center gap-2">
          <Button className="bg-primary text-primary-foreground" onClick={addRecruiter}>
            ADD RECRUITER
          </Button>
          <Button
            variant="outline"
            className="border-border/60 bg-background/20"
            onClick={() => {
              setCompany("")
              setEmail("")
            }}
          >
            RESET
          </Button>
          <div className="ml-auto text-xs text-foreground/70">TOTAL: {recruiters.length}</div>
        </div>
      </div>

      <div className="rounded-lg border border-border/60 bg-background/10 backdrop-blur-sm overflow-hidden">
        <ul className="divide-y divide-border/40">
          {recruiters.length === 0 ? (
            <li className="p-4 text-center text-foreground/70">NO RECRUITERS YET.</li>
          ) : (
            recruiters.map((r) => (
              <li key={r.id} className="p-4 flex items-center gap-3">
                <div className="min-w-0">
                  <div className="font-semibold">{r.company}</div>
                  <div className="text-xs text-foreground/70 break-words">{r.email || "-"}</div>
                </div>
                <Button
                  variant="outline"
                  className="ml-auto border-border/60 bg-background/20"
                  onClick={() => remove(r.id)}
                >
                  REMOVE
                </Button>
              </li>
            ))
          )}
        </ul>
      </div>
    </div>
  )
}
