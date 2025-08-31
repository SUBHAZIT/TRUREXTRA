"use client"

import type React from "react"

import { useEffect, useState } from "react"
import { keys } from "../lib/local-db"

type Settings = { logoDataUrl?: string; themeColor?: string }

export function SettingsPanel() {
  const [settings, setSettings] = useState<Settings>({})

  useEffect(() => {
    const raw = localStorage.getItem(keys.settings)
    if (raw) setSettings(JSON.parse(raw))
  }, [])

  function save() {
    localStorage.setItem(keys.settings, JSON.stringify(settings))
    alert("Settings saved")
  }

  function onLogo(e: React.ChangeEvent<HTMLInputElement>) {
    const f = e.target.files?.[0]
    if (!f) return
    const reader = new FileReader()
    reader.onload = () => setSettings((s) => ({ ...s, logoDataUrl: reader.result as string }))
    reader.readAsDataURL(f)
  }

  return (
    <div className="space-y-4">
      <div className="grid md:grid-cols-3 gap-4">
        <div className="space-y-2">
          <div className="text-sm">Organizer Logo</div>
          <input type="file" accept="image/*" onChange={onLogo} />
          {settings.logoDataUrl && (
            <img
              src={settings.logoDataUrl || "/placeholder.svg"}
              alt="logo preview"
              className="h-16 w-16 rounded-md object-cover border border-border"
            />
          )}
        </div>
        <label className="text-sm">
          Theme Color
          <input
            type="color"
            className="mt-2 block h-10 w-20 rounded-md border border-border bg-background"
            value={settings.themeColor || "#60a5fa"}
            onChange={(e) => setSettings((s) => ({ ...s, themeColor: e.target.value }))}
          />
        </label>
      </div>

      <button
        onClick={save}
        className="rounded-md bg-primary text-primary-foreground px-3 py-2 text-sm hover:opacity-90"
      >
        Save Settings
      </button>
    </div>
  )
}
