"use client"

import type React from "react"

import { useState } from "react"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

type Mode = "login" | "signup" | "forgot"

const ROLES = ["Student", "Mentor", "Recruiter", "Organizer", "Investor", "Academic/College"] as const

export default function ShowModal() {
  const [mode, setMode] = useState<Mode>("login")
  const [role, setRole] = useState<(typeof ROLES)[number]>("Student")

  return (
    <div className="space-y-4">
      {/* Mode Switcher */}
      <div className="flex items-center justify-center gap-2">
        <ModeButton active={mode === "login"} onClick={() => setMode("login")}>
          Login
        </ModeButton>
        <ModeButton active={mode === "signup"} onClick={() => setMode("signup")}>
          Sign up
        </ModeButton>
        <ModeButton active={mode === "forgot"} onClick={() => setMode("forgot")}>
          Forgot
        </ModeButton>
      </div>

      {mode === "login" && (
        <form
          className="grid gap-4"
          onSubmit={(e) => {
            e.preventDefault()
            // console.log("[v0] login submitted")
          }}
        >
          <div className="grid gap-2">
            <Label htmlFor="login-email">Email</Label>
            <Input id="login-email" type="email" placeholder="you@example.com" required />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="login-password">Password</Label>
            <Input id="login-password" type="password" placeholder="••••••••" required />
          </div>
          <div className="flex items-center justify-between">
            <button
              type="button"
              className="text-sm text-primary underline-offset-2 hover:underline"
              onClick={() => setMode("forgot")}
            >
              Forgot password?
            </button>
            <Button type="submit" className="bg-primary text-primary-foreground hover:opacity-90">
              Login
            </Button>
          </div>
          <p className="text-center text-sm text-muted-foreground">
            No account?{" "}
            <button
              type="button"
              onClick={() => setMode("signup")}
              className="text-secondary underline-offset-2 hover:underline"
            >
              Create one
            </button>
          </p>
        </form>
      )}

      {mode === "signup" && (
        <form
          className="grid gap-4"
          onSubmit={(e) => {
            e.preventDefault()
            // console.log("[v0] signup submitted", { role })
          }}
        >
          <div className="grid gap-2">
            <Label htmlFor="signup-name">Full name</Label>
            <Input id="signup-name" type="text" placeholder="Jane Doe" required />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="signup-email">Email</Label>
            <Input id="signup-email" type="email" placeholder="you@example.com" required />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="signup-password">Password</Label>
            <Input id="signup-password" type="password" placeholder="••••••••" required />
          </div>

          <div className="grid gap-2">
            <Label htmlFor="signup-role">Role</Label>
            <select
              id="signup-role"
              className="w-full rounded-md border bg-card px-3 py-2 text-foreground"
              value={role}
              onChange={(e) => setRole(e.target.value as (typeof ROLES)[number])}
            >
              {ROLES.map((r) => (
                <option key={r} value={r}>
                  {r}
                </option>
              ))}
            </select>
          </div>

          <div className="flex items-center justify-between">
            <button
              type="button"
              className="text-sm text-muted-foreground underline-offset-2 hover:underline"
              onClick={() => setMode("login")}
            >
              Have an account? Login
            </button>
            <Button type="submit" className="bg-secondary text-secondary-foreground hover:opacity-90">
              Create account
            </Button>
          </div>
        </form>
      )}

      {mode === "forgot" && (
        <form
          className="grid gap-4"
          onSubmit={(e) => {
            e.preventDefault()
            // console.log("[v0] forgot submitted")
          }}
        >
          <div className="grid gap-2">
            <Label htmlFor="forgot-email">Email</Label>
            <Input id="forgot-email" type="email" placeholder="you@example.com" required />
          </div>
          <div className="flex items-center justify-end">
            <Button type="submit" className="bg-primary text-primary-foreground hover:opacity-90">
              Send reset link
            </Button>
          </div>
          <p className="text-center text-sm text-muted-foreground">
            Remembered your password?{" "}
            <button
              type="button"
              onClick={() => setMode("login")}
              className="text-primary underline-offset-2 hover:underline"
            >
              Go to login
            </button>
          </p>
        </form>
      )}
    </div>
  )
}

function ModeButton({
  active,
  onClick,
  children,
}: {
  active?: boolean
  onClick?: () => void
  children: React.ReactNode
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "rounded-md border px-3 py-1.5 text-sm",
        active ? "bg-primary text-primary-foreground" : "bg-card text-foreground hover:bg-muted",
      )}
      aria-pressed={active}
    >
      {children}
    </button>
  )
}
