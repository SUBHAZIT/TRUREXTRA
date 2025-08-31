"use client"

import * as React from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { useLocalStorage } from "@/hooks/use-local-storage"

type Filters = {
  skills?: string
  minExperience?: number
  eventParticipation?: string
}

export default function SmartFilteringPanel() {
  const [filters, setFilters] = useLocalStorage<Filters>("recruiter.filters", {})
  const [temp, setTemp] = React.useState<Filters>(filters)

  const save = () => setFilters(temp)
  const clear = () => {
    setTemp({})
    setFilters({})
  }

  return (
    <div>
      <div className="grid gap-3">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          <Input
            placeholder="SKILLS (E.G. REACT, PYTHON)"
            value={temp.skills || ""}
            onChange={(e) => setTemp({ ...temp, skills: e.target.value })}
          />
          <Input
            placeholder="MIN EXPERIENCE (YEARS)"
            type="number"
            value={temp.minExperience ?? ""}
            onChange={(e) => setTemp({ ...temp, minExperience: Number(e.target.value) || undefined })}
          />
          <Input
            placeholder="EVENT PARTICIPATION (E.G. HACKATHON)"
            value={temp.eventParticipation || ""}
            onChange={(e) => setTemp({ ...temp, eventParticipation: e.target.value })}
          />
        </div>
        <div className="flex gap-2">
          <Button onClick={save} className="border border-white/20 bg-background/40 backdrop-blur-sm">
            SAVE FILTERS
          </Button>
          <Button
            variant="secondary"
            onClick={clear}
            className="border border-white/20 bg-background/40 backdrop-blur-sm"
          >
            CLEAR
          </Button>
        </div>
        <p className="text-xs text-gray-400">FILTERS ARE SAVED LOCALLY AND CAN BE APPLIED WHEN BROWSING TALENT.</p>
      </div>
    </div>
  )
}
