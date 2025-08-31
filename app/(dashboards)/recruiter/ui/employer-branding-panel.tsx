"use client"

import * as React from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { useLocalStorage } from "@/hooks/use-local-storage"

type Branding = {
  company?: string
  tagline?: string
  website?: string
  logoUrl?: string
  about?: string
}

export default function EmployerBrandingPanel() {
  const [branding, setBranding] = useLocalStorage<Branding>("recruiter.branding", {})
  const [temp, setTemp] = React.useState<Branding>(branding)

  const save = () => setBranding(temp)
  const clear = () => {
    setTemp({})
    setBranding({})
  }

  return (
    <Card className="border-white/15 bg-background/30 backdrop-blur-md shadow-lg">
      <CardHeader>
        <CardTitle className="text-foreground">EMPLOYER BRANDING</CardTitle>
      </CardHeader>
      <CardContent className="grid gap-3">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          <Input
            placeholder="COMPANY NAME"
            value={temp.company || ""}
            onChange={(e) => setTemp({ ...temp, company: e.target.value })}
          />
          <Input
            placeholder="TAGLINE"
            value={temp.tagline || ""}
            onChange={(e) => setTemp({ ...temp, tagline: e.target.value })}
          />
          <Input
            placeholder="WEBSITE"
            value={temp.website || ""}
            onChange={(e) => setTemp({ ...temp, website: e.target.value })}
          />
          <Input
            placeholder="LOGO URL"
            value={temp.logoUrl || ""}
            onChange={(e) => setTemp({ ...temp, logoUrl: e.target.value })}
          />
        </div>
        <Textarea
          placeholder="ABOUT / CULTURE"
          value={temp.about || ""}
          onChange={(e) => setTemp({ ...temp, about: e.target.value })}
        />
        <div className="flex gap-2">
          <Button onClick={save} className="border border-white/20 bg-background/40 backdrop-blur-sm">
            SAVE
          </Button>
          <Button
            variant="secondary"
            onClick={clear}
            className="border border-white/20 bg-background/40 backdrop-blur-sm"
          >
            CLEAR
          </Button>
        </div>

        {branding.company && (
          <div className="rounded-lg border border-white/15 bg-background/25 p-4">
            <div className="flex items-center gap-3">
              {branding.logoUrl && (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={branding.logoUrl || "/placeholder.svg"}
                  alt="LOGO"
                  className="h-10 w-10 rounded border border-white/15 object-cover"
                />
              )}
              <div className="text-foreground font-medium">{branding.company}</div>
            </div>
            {branding.tagline && <div className="text-xs text-foreground/80 mt-1">{branding.tagline}</div>}
            {branding.about && <p className="text-xs text-foreground/80 mt-2">{branding.about}</p>}
            {branding.website && (
              <a
                href={branding.website}
                target="_blank"
                rel="noreferrer"
                className="text-xs underline mt-2 inline-block"
              >
                WEBSITE
              </a>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  )
}
