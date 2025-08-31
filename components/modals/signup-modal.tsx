"use client"

import { useState } from "react"
import { ModalShell } from "./modal-shell"
import { getSupabaseClient } from "../../lib/supabase/client"
import { auth, googleProvider } from "../../lib/firebase"
import { signInWithPopup } from "firebase/auth"

const roles = [
  { key: "student", label: "STUDENT", color: "from-blue-500 to-indigo-600", icon: "🎓" },
  { key: "mentor", label: "MENTOR", color: "from-indigo-500 to-purple-600", icon: "🧑‍🏫" },
  { key: "recruiter", label: "RECRUITER", color: "from-purple-500 to-pink-600", icon: "👔" },
  { key: "organizer", label: "ORGANIZER", color: "from-pink-500 to-red-600", icon: "🗓️" },
  { key: "investor", label: "INVESTOR", color: "from-red-500 to-orange-600", icon: "💸" },
  { key: "institute", label: "INSTITUTE", color: "from-orange-500 to-yellow-600", icon: "🏛️" },
]

const roleFieldMap: Record<string, { name: string; label: string; type?: string }[]> = {
  student: [
    { name: "institute", label: "INSTITUTE" },
    { name: "degree", label: "DEGREE" },
    { name: "grad_year", label: "GRADUATION YEAR" },
  ],
  mentor: [
    { name: "headline", label: "PROFESSIONAL HEADLINE" },
    { name: "experience_years", label: "YEARS OF EXPERIENCE", type: "number" },
  ],
  recruiter: [
    { name: "company", label: "COMPANY" },
    { name: "position", label: "POSITION" },
  ],
  organizer: [
    { name: "org_name", label: "ORGANIZATION NAME" },
    { name: "org_type", label: "ORGANIZATION TYPE" },
  ],
  investor: [
    { name: "firm", label: "FIRM" },
    { name: "focus", label: "INVESTMENT FOCUS" },
  ],
  institute: [
    { name: "institute_name", label: "INSTITUTE NAME" },
    { name: "domain", label: "DOMAIN" },
  ],
}

export function SignupModal({ onClose, onLogin }: { onClose: () => void; onLogin: () => void }) {
  const [selected, setSelected] = useState<string | null>(null)
  const [fullName, setFullName] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [confirm, setConfirm] = useState("")
  const [agree, setAgree] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [info, setInfo] = useState<string | null>(null)
  const [meta, setMeta] = useState<Record<string, string>>({})

  const fields = selected ? (roleFieldMap[selected] ?? []) : []

  return (
    <ModalShell onClose={onClose} labelledBy="signup-title">
      <button onClick={onClose} className="absolute top-4 right-4 text-white/70 hover:text-white" aria-label="Close">
        ×
      </button>
      <h2 id="signup-title" className="text-2xl font-bold text-center mb-6 uppercase">
        CREATE AN ACCOUNT
      </h2>
      <form
        onSubmit={async (e) => {
          e.preventDefault()
          setError(null)
          setInfo(null)

          if (!selected) {
            setError("PLEASE SELECT USER TYPE")
            return
          }
          for (const f of fields) {
            const v = (meta[f.name] || "").trim()
            if (!v) {
              setError(`PLEASE FILL ${f.label}`)
              return
            }
          }
          if (!agree) {
            setError("YOU MUST AGREE TO THE TERMS")
            return
          }
          if (!email || !password) {
            setError("EMAIL AND PASSWORD ARE REQUIRED")
            return
          }
          if (password !== confirm) {
            setError("PASSWORDS DO NOT MATCH")
            return
          }

          setLoading(true)
          try {
            const supabase = getSupabaseClient()
            const origin = typeof window !== "undefined" ? window.location.origin : ""
            const redirectTo =
              process.env.NEXT_PUBLIC_DEV_SUPABASE_REDIRECT_URL || (origin ? `${origin}/auth/callback` : undefined)
            const { error } = await supabase.auth.signUp({
              email,
              password,
              options: {
                emailRedirectTo: redirectTo,
                data: { role: selected, full_name: fullName, ...meta },
              },
            })
            if (error) {
              setError(error.message)
            } else {
              try {
                const { data: sessionData } = await supabase.auth.getSession()
                if (sessionData?.session) {
                  await fetch("/api/profile", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ full_name: fullName, role: selected }),
                  })
                }
              } catch {
                // ignore; profile will be created via trigger or on first login
              }
              setInfo("CHECK YOUR EMAIL TO VERIFY YOUR ACCOUNT")
            }
          } finally {
            setLoading(false)
          }
        }}
      >
        <div className="mb-4">
          <label className="block text-white/80 mb-2 uppercase">SELECT USER TYPE</label>
          <div className="grid grid-cols-2 gap-3 mb-2">
            {roles.map((r) => {
              const active = selected === r.key
              return (
                <button
                  key={r.key}
                  type="button"
                  aria-pressed={active}
                  onClick={() => setSelected(r.key)}
                  className={[
                    "w-full py-3 flex items-center gap-2 justify-center rounded-lg border border-white/20 bg-white/10 text-white font-bold uppercase transition-all",
                    active ? "ring-4 ring-blue-400 bg-blue-900/60" : "",
                  ].join(" ")}
                >
                  <span className="text-xl">{r.icon}</span> {r.label}
                </button>
              )
            })}
          </div>
          <input type="hidden" name="userType" value={selected ?? ""} />
        </div>

        <div className="mb-4">
          <label className="block text-white/80 mb-2 uppercase">FULL NAME</label>
          <input
            type="text"
            className="w-full bg-white/10 border border-white/20 rounded-lg px-4 py-3 text-white"
            placeholder="ENTER YOUR FULL NAME"
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
          />
        </div>
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
        <div className="mb-4">
          <label className="block text-white/80 mb-2 uppercase">PASSWORD</label>
          <input
            type="password"
            className="w-full bg-white/10 border border-white/20 rounded-lg px-4 py-3 text-white"
            placeholder="CREATE A PASSWORD"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>
        <div className="mb-6">
          <label className="block text-white/80 mb-2 uppercase">CONFIRM PASSWORD</label>
          <input
            type="password"
            className="w-full bg-white/10 border border-white/20 rounded-lg px-4 py-3 text-white"
            placeholder="CONFIRM YOUR PASSWORD"
            value={confirm}
            onChange={(e) => setConfirm(e.target.value)}
          />
        </div>
        <div className="mb-6">
          <label className="flex items-center gap-2">
            <input type="checkbox" checked={agree} onChange={(e) => setAgree(e.target.checked)} />
            <span className="text-white/80 text-sm uppercase">
              I AGREE TO THE <a className="text-blue-300">TERMS OF SERVICE</a> AND{" "}
              <a className="text-blue-300">PRIVACY POLICY</a>
            </span>
          </label>
        </div>

        {selected ? (
          <div className="mb-4 grid grid-cols-1 gap-4">
            {fields.map((f) => (
              <div key={f.name}>
                <label className="block text-white/80 mb-2 uppercase">{f.label}</label>
                <input
                  type={f.type ?? "text"}
                  className="w-full bg-white/10 border border-white/20 rounded-lg px-4 py-3 text-white"
                  placeholder={`ENTER ${f.label}`}
                  value={meta[f.name] ?? ""}
                  onChange={(e) => setMeta((m) => ({ ...m, [f.name]: e.target.value }))}
                />
              </div>
            ))}
          </div>
        ) : null}

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
          {loading ? "CREATING..." : "CREATE ACCOUNT"}
        </button>
      </form>

      {/* OR divider + Supabase OAuth sign-up button that requires role/meta */}
      <div className="my-4 flex items-center gap-4">
        <div className="h-px flex-1 bg-white/10" />
        <span className="text-white/60 text-xs tracking-wider">OR</span>
        <div className="h-px flex-1 bg-white/10" />
      </div>
      <button
        type="button"
        onClick={async () => {
          setError(null)
          setInfo(null)

          // enforce role + required fields for Firebase OAuth-based signup
          if (!selected) {
            setError("PLEASE SELECT USER TYPE")
            return
          }
          const fields = selected ? (roleFieldMap[selected] ?? []) : []
          for (const f of fields) {
            const v = (meta[f.name] || "").trim()
            if (!v) {
              setError(`PLEASE FILL ${f.label}`)
              return
            }
          }

          setLoading(true)
          try {
            const result = await signInWithPopup(auth, googleProvider)
            const user = result.user

            // Create user profile in Supabase after Firebase auth
            const supabase = getSupabaseClient()
            const { data: existingProfile } = await supabase
              .from('profiles')
              .select('id')
              .eq('email', user.email)
              .single()

            if (!existingProfile) {
              // Create new profile with selected role and metadata
              await supabase.from('profiles').insert({
                email: user.email,
                full_name: fullName || user.displayName || '',
                role: selected,
                firebase_uid: user.uid,
                ...meta
              })
            }

            onClose()
            if (typeof window !== "undefined") {
              window.location.assign(`/${selected}`)
            }
          } catch (err: any) {
            setError((err?.message || "GOOGLE SIGN-UP FAILED").toString())
          } finally {
            setLoading(false)
          }
        }}
        className="w-full bg-white/10 hover:bg-white/15 border border-white/20 py-3 rounded-lg font-medium uppercase flex items-center justify-center gap-2"
      >
        <svg width="18" height="18" viewBox="0 0 48 48" aria-hidden="true" className="shrink-0">
          <path
            fill="#FFC107"
            d="M43.6 20.5H42V20H24v8h11.3C33.9 32.4 29.4 36 24 36c-6.6 0-12-5.4-12-12s5.4-12 12-12c3 0 5.7 1.1 7.8 3l5.7-5.7C34.3 6.1 29.4 4 24 4 12.9 4 4 12.9 4 24s8.9 20 20 20 20-8.9 20-20c0-1.2-.1-2.3-.4-3.5z"
          />
          <path
            fill="#FF3D00"
            d="M6.3 14.7l6.6 4.8C14.6 16.1 18.9 12 24 12c3 0 5.7 1.1 7.8 3l5.7-5.7C29.3 34.9 26.9 36 24 36c-5.4 0-9.9-3.6-11.3-8.5l-6.6 5.1C9 39.4 15.9 44 24 44z"
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
          ALREADY HAVE AN ACCOUNT?{" "}
          <button className="text-blue-300 hover:text-blue-200" onClick={onLogin}>
            LOGIN
          </button>
        </p>
      </div>
    </ModalShell>
  )
}
