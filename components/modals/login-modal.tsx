"use client"

import { ModalShell } from "./modal-shell"
import { useState } from "react"
import { getSupabaseClient } from "../../lib/supabase/client"
import { auth, googleProvider } from "../../lib/firebase"
import { signInWithPopup } from "firebase/auth"

export function LoginModal({
  onClose,
  onForgot,
  onSignup,
}: {
  onClose: () => void
  onForgot: () => void
  onSignup: () => void
}) {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  return (
    <ModalShell onClose={onClose} labelledBy="login-title">
      <button onClick={onClose} className="absolute top-4 right-4 text-white/70 hover:text-white" aria-label="Close">
        ×
      </button>
      <h2 id="login-title" className="text-2xl font-bold text-center mb-6 uppercase">
        LOGIN TO TRUREXTRA
      </h2>
      <form
        onSubmit={async (e) => {
          e.preventDefault()
          setError(null)
          setLoading(true)
          try {
            const supabase = getSupabaseClient()
            const { error } = await supabase.auth.signInWithPassword({ email, password })
            if (error) {
              setError(error.message)
            } else {
              onClose()
              if (typeof window !== "undefined") {
                window.location.assign("/student")
              }
            }
          } finally {
            setLoading(false)
          }
        }}
      >
        <div className="mb-4">
          <label className="block text-white/80 mb-2 uppercase">EMAIL</label>
          <input
            type="email"
            className="w-full bg-white/10 border border-white/20 rounded-lg px-4 py-3 text-white"
            placeholder="ENTER YOUR EMAIL"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>
        <div className="mb-6">
          <label className="block text-white/80 mb-2 uppercase">PASSWORD</label>
          <input
            type="password"
            className="w-full bg-white/10 border border-white/20 rounded-lg px-4 py-3 text-white"
            placeholder="ENTER YOUR PASSWORD"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>
        {error ? (
          <div className="mb-4 text-red-300 text-sm" role="alert" aria-live="polite">
            {error.toUpperCase()}
          </div>
        ) : null}
        <button
          type="submit"
          disabled={loading}
          className="w-full bg-gradient-to-r from-blue-500 to-indigo-600 py-3 rounded-lg font-medium mb-4 uppercase disabled:opacity-60"
        >
          {loading ? "LOGGING IN..." : "LOGIN"}
        </button>
        <div className="text-center">
          <button type="button" className="text-blue-300 hover:text-blue-200" onClick={() => onForgot()}>
            FORGOT PASSWORD?
          </button>
        </div>
      </form>

      <div className="my-4 flex items-center gap-4">
        <div className="h-px flex-1 bg-white/10" />
        <span className="text-white/60 text-xs tracking-wider">OR</span>
        <div className="h-px flex-1 bg-white/10" />
      </div>
      <button
        type="button"
        onClick={async () => {
          setError(null)
          setLoading(true)
          try {
            const result = await signInWithPopup(auth, googleProvider)
            const user = result.user

            // Create or update user profile in Supabase after Firebase auth
            const supabase = getSupabaseClient()
            const { data: existingProfile } = await supabase
              .from('profiles')
              .select('id')
              .eq('email', user.email)
              .single()

            if (!existingProfile) {
              // Create new profile if it doesn't exist
              await supabase.from('profiles').insert({
                email: user.email,
                full_name: user.displayName || '',
                role: 'student', // Default role, can be changed later
                firebase_uid: user.uid
              })
            }

            onClose()
            if (typeof window !== "undefined") {
              window.location.assign("/student")
            }
          } catch (err: any) {
            setError((err?.message || "GOOGLE SIGN-IN FAILED").toString())
          } finally {
            setLoading(false)
          }
        }}
        className="w-full bg-white/10 hover:bg-white/15 border border-white/20 py-3 rounded-lg font-medium uppercase flex items-center justify-center gap-2"
      >
        {/* simple G icon */}
        <svg width="18" height="18" viewBox="0 0 48 48" aria-hidden="true" className="shrink-0">
          <path
            fill="#FFC107"
            d="M43.6 20.5H42V20H24v8h11.3C33.9 32.4 29.4 36 24 36c-6.6 0-12-5.4-12-12s5.4-12 12-12c3 0 5.7 1.1 7.8 3l5.7-5.7C38.2 38 44 32.7 44 24c0-1.2-.1-2.3-.4-3.5z"
          />
          <path
            fill="#FF3D00"
            d="M6.3 14.7l6.6 4.8C14.6 16.1 18.9 12 24 12c3 0 5.7 1.1 7.8 3l5.7-5.7C38.2 38 44 32.7 44 24c0-1.2-.1-2.3-.4-3.5z"
          />
          <path
            fill="#4CAF50"
            d="M24 44c5.3 0 10.2-2 13.8-5.2l-6.4-5.4C29.3 34.9 26.9 36 24 36c-5.4 0-9.9-3.6-11.3-8.5l-6.6 5.1C9 39.4 15.9 44 24 44z"
          />
          <path
            fill="#1976D2"
            d="M43.6 20.5H42V20H24v8h11.3c-1.1 3.4-3.6 5.9-6.5 7.3l6.4 5.4C38.2 38 44 32.7 44 24c0-1.2-.1-2.3-.4-3.5z"
          />
        </svg>
        CONTINUE WITH GOOGLE
      </button>

      <div className="mt-6 pt-6 border-t border-white/10">
        <p className="text-center text-white/70 uppercase">
          DON&apos;T HAVE AN ACCOUNT?{" "}
          <button className="text-blue-300 hover:text-blue-200" onClick={() => onSignup()}>
            SIGN UP
          </button>
        </p>
      </div>
    </ModalShell>
  )
}
