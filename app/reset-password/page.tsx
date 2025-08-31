"use client"

import { useState } from "react"
import { getSupabaseClient } from "@/lib/supabase/client"

export default function ResetPasswordPage() {
  const [password, setPassword] = useState("")
  const [confirm, setConfirm] = useState("")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [info, setInfo] = useState<string | null>(null)

  return (
    <main className="min-h-[60vh] max-w-md mx-auto px-4 py-16">
      <h1 className="text-2xl font-bold mb-6 uppercase text-center">SET NEW PASSWORD</h1>
      <form
        onSubmit={async (e) => {
          e.preventDefault()
          setError(null)
          setInfo(null)
          if (!password || !confirm) {
            setError("PASSWORD AND CONFIRMATION ARE REQUIRED")
            return
          }
          if (password !== confirm) {
            setError("PASSWORDS DO NOT MATCH")
            return
          }
          setLoading(true)
          try {
            const supabase = getSupabaseClient()
            const { error } = await supabase.auth.updateUser({ password })
            if (error) {
              setError(error.message)
            } else {
              setInfo("PASSWORD UPDATED. REDIRECTING...")
              setTimeout(() => {
                if (typeof window !== "undefined") window.location.assign("/student")
              }, 1200)
            }
          } finally {
            setLoading(false)
          }
        }}
        className="space-y-4"
      >
        <div>
          <label className="block text-sm mb-1 uppercase">NEW PASSWORD</label>
          <input
            type="password"
            className="w-full bg-white/10 border border-white/20 rounded-lg px-4 py-3"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="ENTER NEW PASSWORD"
          />
        </div>
        <div>
          <label className="block text-sm mb-1 uppercase">CONFIRM PASSWORD</label>
          <input
            type="password"
            className="w-full bg-white/10 border border-white/20 rounded-lg px-4 py-3"
            value={confirm}
            onChange={(e) => setConfirm(e.target.value)}
            placeholder="CONFIRM NEW PASSWORD"
          />
        </div>

        {error ? (
          <div className="text-red-600 text-sm" role="alert" aria-live="polite">
            {error}
          </div>
        ) : null}
        {info ? (
          <div className="text-green-600 text-sm" role="status" aria-live="polite">
            {info}
          </div>
        ) : null}

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-gradient-to-r from-blue-500 to-indigo-600 py-3 rounded-lg font-medium uppercase disabled:opacity-60"
        >
          {loading ? "UPDATING..." : "UPDATE PASSWORD"}
        </button>
      </form>
    </main>
  )
}
