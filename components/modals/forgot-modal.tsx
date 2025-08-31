"use client"

import { ModalShell } from "./modal-shell"
import { useState } from "react"
import { getSupabaseClient } from "../../lib/supabase/client"

export function ForgotModal({
  onClose,
  onBackToLogin,
}: {
  onClose: () => void
  onBackToLogin: () => void
}) {
  const [email, setEmail] = useState("")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [info, setInfo] = useState<string | null>(null)

  return (
    <ModalShell onClose={onClose} labelledBy="forgot-title">
      <button onClick={onClose} className="absolute top-4 right-4 text-white/70 hover:text-white" aria-label="Close">
        ×
      </button>
      <h2 id="forgot-title" className="text-2xl font-bold text-center mb-6 uppercase">
        RESET PASSWORD
      </h2>
      <p className="text-white/80 text-center mb-6 uppercase">
        ENTER YOUR EMAIL ADDRESS AND WE&apos;LL SEND YOU A LINK TO RESET YOUR PASSWORD.
      </p>
      <form
        onSubmit={async (e) => {
          e.preventDefault()
          setError(null)
          setInfo(null)
          if (!email) {
            setError("EMAIL IS REQUIRED")
            return
          }
          setLoading(true)
          try {
            const supabase = getSupabaseClient()
            const origin = typeof window !== "undefined" ? window.location.origin : ""
            const redirectTo =
              process.env.NEXT_PUBLIC_DEV_SUPABASE_REDIRECT_URL || (origin ? `${origin}/reset-password` : undefined)
            const { error } = await supabase.auth.resetPasswordForEmail(email, { redirectTo })
            if (error) {
              setError(error.message)
            } else {
              setInfo("CHECK YOUR EMAIL FOR THE RESET LINK")
            }
          } finally {
            setLoading(false)
          }
        }}
      >
        <div className="mb-6">
          <label className="block text-white/80 mb-2 uppercase">EMAIL</label>
          <input
            type="email"
            className="w-full bg-white/10 border border-white/20 rounded-lg px-4 py-3 text-white"
            placeholder="ENTER YOUR EMAIL"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>

        {error ? (
          <div className="mb-4 text-red-300 text-sm" role="alert" aria-live="polite">
            {error.toUpperCase()}
          </div>
        ) : null}
        {info ? (
          <div className="mb-4 text-green-300 text-sm" role="status" aria-live="polite">
            {info}
          </div>
        ) : null}

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-gradient-to-r from-blue-500 to-indigo-600 py-3 rounded-lg font-medium mb-4 uppercase disabled:opacity-60"
        >
          {loading ? "SENDING..." : "SEND RESET LINK"}
        </button>
      </form>
      <div className="mt-6 pt-6 border-t border-white/10 text-center">
        <button className="text-blue-300 hover:text-blue-200 uppercase" onClick={onBackToLogin}>
          BACK TO LOGIN
        </button>
      </div>
    </ModalShell>
  )
}
