"use client"

import { useState } from "react"
import { addOne, keys, uid, type OrgEvent } from "../lib/local-db"

const steps = ["Basic", "Prizes", "Timeline", "Eligibility", "Sponsors"] as const

export function EventForm() {
  const [step, setStep] = useState<number>(0)
  const [form, setForm] = useState<Partial<OrgEvent>>({
    title: "",
    type: "Hackathon",
    status: "draft",
  } as any)

  function next() {
    setStep((s) => Math.min(s + 1, steps.length - 1))
  }
  function prev() {
    setStep((s) => Math.max(s - 1, 0))
  }

  function save() {
    if (!form.title) return alert("Title is required")
    const ev: OrgEvent = {
      id: uid("event"),
      title: form.title!,
      type: (form.type as any) || "Hackathon",
      status: (form.status as any) || "draft",
      prizes: form.prizes || "",
      timeline: form.timeline || "",
      eligibility: form.eligibility || "",
      sponsors: form.sponsors || "",
      createdAt: Date.now(),
    }
    addOne<OrgEvent>(keys.events, ev)
    setStep(0)
    setForm({ title: "", type: "Hackathon", status: "draft" } as any)
    alert("Event saved")
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap gap-2">
        {steps.map((s, i) => (
          <button
            key={s}
            className={`px-3 py-1.5 rounded-full text-xs border ${
              i === step
                ? "border-primary/40 bg-primary text-primary-foreground"
                : "border-border bg-muted hover:bg-muted/80"
            }`}
            onClick={() => setStep(i)}
          >
            {s}
          </button>
        ))}
      </div>

      {step === 0 && (
        <div className="grid gap-3">
          <label className="text-sm">
            Title
            <input
              className="mt-1 w-full rounded-md border border-border bg-background px-3 py-2"
              value={form.title || ""}
              onChange={(e) => setForm((f) => ({ ...f, title: e.target.value }))}
              placeholder="e.g., Spring Hackathon 2025"
            />
          </label>
          <label className="text-sm">
            Type
            <select
              className="mt-1 w-full rounded-md border border-border bg-background px-3 py-2"
              value={form.type as any}
              onChange={(e) => setForm((f) => ({ ...f, type: e.target.value as any }))}
            >
              <option value="Hackathon">Hackathon</option>
              <option value="Quiz">Quiz</option>
              <option value="Webinar">Webinar</option>
              <option value="Recruitment">Recruitment</option>
            </select>
          </label>
          <label className="text-sm">
            Status
            <select
              className="mt-1 w-full rounded-md border border-border bg-background px-3 py-2"
              value={form.status as any}
              onChange={(e) => setForm((f) => ({ ...f, status: e.target.value as any }))}
            >
              <option value="draft">Draft</option>
              <option value="published">Published</option>
            </select>
          </label>
        </div>
      )}

      {step === 1 && (
        <label className="text-sm">
          Prizes
          <textarea
            className="mt-1 w-full rounded-md border border-border bg-background px-3 py-2"
            rows={3}
            value={form.prizes || ""}
            onChange={(e) => setForm((f) => ({ ...f, prizes: e.target.value }))}
            placeholder="Describe cash, swag, internships, etc."
          />
        </label>
      )}

      {step === 2 && (
        <label className="text-sm">
          Timeline
          <textarea
            className="mt-1 w-full rounded-md border border-border bg-background px-3 py-2"
            rows={3}
            value={form.timeline || ""}
            onChange={(e) => setForm((f) => ({ ...f, timeline: e.target.value }))}
            placeholder="Registration window, round dates, finale"
          />
        </label>
      )}

      {step === 3 && (
        <label className="text-sm">
          Eligibility
          <textarea
            className="mt-1 w-full rounded-md border border-border bg-background px-3 py-2"
            rows={3}
            value={form.eligibility || ""}
            onChange={(e) => setForm((f) => ({ ...f, eligibility: e.target.value }))}
            placeholder="Who can participate? (students, professionals, regions...)"
          />
        </label>
      )}

      {step === 4 && (
        <label className="text-sm">
          Sponsors
          <textarea
            className="mt-1 w-full rounded-md border border-border bg-background px-3 py-2"
            rows={3}
            value={form.sponsors || ""}
            onChange={(e) => setForm((f) => ({ ...f, sponsors: e.target.value }))}
            placeholder="Sponsor names, links"
          />
        </label>
      )}

      <div className="flex items-center gap-2">
        <button
          className="rounded-md border border-border bg-muted px-3 py-2 text-sm hover:bg-muted/80"
          onClick={prev}
          disabled={step === 0}
        >
          Back
        </button>
        <button
          className="rounded-md border border-border bg-muted px-3 py-2 text-sm hover:bg-muted/80"
          onClick={next}
          disabled={step === steps.length - 1}
        >
          Next
        </button>
        <div className="flex-1" />
        <button
          className="rounded-md bg-primary text-primary-foreground px-3 py-2 text-sm hover:opacity-90"
          onClick={save}
        >
          Save Event
        </button>
      </div>
    </div>
  )
}
