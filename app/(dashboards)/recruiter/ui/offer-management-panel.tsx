"use client"

import { useState } from "react"
import { useLocalStorage } from "@/hooks/use-local-storage"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

type Offer = {
  id: string
  candidate: string
  role: string
  status: "DRAFT" | "SENT" | "ACCEPTED" | "DECLINED"
}

export default function OfferManagementPanel() {
  const [offers, setOffers] = useLocalStorage<Offer[]>("recruiter_offers", [])
  const [candidate, setCandidate] = useState("")
  const [role, setRole] = useState("")
  const [status, setStatus] = useState<Offer["status"]>("DRAFT")

  function addOffer() {
    if (!candidate || !role) return
    const next: Offer = { id: crypto.randomUUID(), candidate, role, status }
    setOffers([next, ...offers])
    setCandidate("")
    setRole("")
    setStatus("DRAFT")
  }

  function updateStatus(id: string, status: Offer["status"]) {
    setOffers(offers.map((o) => (o.id === id ? { ...o, status } : o)))
  }

  function remove(id: string) {
    setOffers(offers.filter((o) => o.id !== id))
  }

  return (
    <div className="space-y-4">
      <h2 className="text-lg font-semibold">OFFER MANAGEMENT</h2>
      <div className="grid gap-3 md:grid-cols-3">
        <Input placeholder="CANDIDATE NAME" value={candidate} onChange={(e) => setCandidate(e.target.value)} />
        <Input placeholder="ROLE TITLE" value={role} onChange={(e) => setRole(e.target.value)} />
        <div className="flex items-center gap-2">
          <Select value={status} onValueChange={(v: Offer["status"]) => setStatus(v)}>
            <SelectTrigger>
              <SelectValue placeholder="STATUS" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="DRAFT">DRAFT</SelectItem>
              <SelectItem value="SENT">SENT</SelectItem>
              <SelectItem value="ACCEPTED">ACCEPTED</SelectItem>
              <SelectItem value="DECLINED">DECLINED</SelectItem>
            </SelectContent>
          </Select>
          <Button onClick={addOffer} className="shrink-0">
            ADD
          </Button>
        </div>
      </div>

      <ul className="space-y-2">
        {offers.length === 0 && <li className="text-sm text-foreground/70">NO OFFERS YET</li>}
        {offers.map((o) => (
          <li
            key={o.id}
            className="flex flex-wrap items-center justify-between gap-2 rounded-xl border border-border/50 bg-background/20 p-3"
          >
            <div className="space-y-1">
              <div className="font-medium">{o.candidate}</div>
              <div className="text-xs text-foreground/70">{o.role}</div>
            </div>
            <div className="flex items-center gap-2">
              <Select value={o.status} onValueChange={(v: Offer["status"]) => updateStatus(o.id, v)}>
                <SelectTrigger className="w-[140px]">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="DRAFT">DRAFT</SelectItem>
                  <SelectItem value="SENT">SENT</SelectItem>
                  <SelectItem value="ACCEPTED">ACCEPTED</SelectItem>
                  <SelectItem value="DECLINED">DECLINED</SelectItem>
                </SelectContent>
              </Select>
              <Button variant="destructive" onClick={() => remove(o.id)}>
                REMOVE
              </Button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  )
}
