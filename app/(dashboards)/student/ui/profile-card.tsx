"use client"

import { useState } from "react"
import { User, Edit3, Camera } from "lucide-react"
import { loadLocalProfile, saveLocalProfile } from "../lib/local-store"

type Profile = {
  full_name: string | null
  role: string | null
  bio?: string | null
  skills?: string | null
  photo_url?: string | null
}

export default function ProfileCard({ initialProfile }: { initialProfile: Profile | null }) {
  const local = loadLocalProfile()
  const [fullName, setFullName] = useState(initialProfile?.full_name ?? local.full_name ?? "")
  const [bio, setBio] = useState(initialProfile?.bio ?? local.bio ?? "")
  const [skills, setSkills] = useState(initialProfile?.skills ?? local.skills ?? "")
  const [photoUrl, setPhotoUrl] = useState(initialProfile?.photo_url ?? local.photo_url ?? "")
  const role = (initialProfile?.role ?? "student") as string
  const [saving, setSaving] = useState(false)
  const [message, setMessage] = useState<string | null>(null)
  const [isEditing, setIsEditing] = useState(false)

  async function onSave() {
    setSaving(true)
    saveLocalProfile({ full_name: fullName, bio, skills, photo_url: photoUrl })
    setMessage("Profile saved locally")
    setSaving(false)
    setIsEditing(false)
    setTimeout(() => setMessage(null), 1500)
  }

  return (
    <div className="rounded-2xl bg-white/10 backdrop-blur-sm border border-white/20 p-6 shadow-2xl relative overflow-hidden">
      <div className="absolute -top-10 -left-10 w-20 h-20 rounded-full bg-blue-500/20 blur-2xl" />
      <div className="absolute -bottom-10 -right-10 w-32 h-32 rounded-full bg-purple-500/20 blur-2xl" />
      <div className="relative z-10">
        <div className="flex items-center gap-4 mb-6">
          <div className="relative">
            <div
              className="w-20 h-20 rounded-full bg-gradient-to-r from-blue-400 to-purple-600 flex items-center justify-center cursor-pointer hover:scale-105 transition-transform"
              onClick={() => setIsEditing(!isEditing)}
            >
              {photoUrl ? (
                <img
                  src={photoUrl || "/placeholder.svg"}
                  alt="Profile"
                  className="w-full h-full rounded-full object-cover"
                />
              ) : (
                <User className="w-10 h-10 text-white" />
              )}
              <div className="absolute bottom-0 right-0 w-6 h-6 bg-white rounded-full flex items-center justify-center">
                <Camera className="w-3 h-3 text-gray-600" />
              </div>
            </div>
          </div>
          <div className="flex-1">
            <h2 className="text-2xl font-bold text-white mb-1">{fullName || "Your Name"}</h2>
            <p className="text-blue-200">{role}</p>
            <button
              onClick={() => setIsEditing(!isEditing)}
              className="mt-2 px-3 py-1 rounded-full bg-white/10 backdrop-blur-sm border border-white/20 text-white text-sm hover:bg-white/20 transition flex items-center gap-1"
            >
              <Edit3 className="w-3 h-3" />
              Edit Profile
            </button>
          </div>
        </div>

        <div className="mb-4">
          <p className="text-blue-100">{bio || "Add a bio to tell people about yourself."}</p>
        </div>

        <div className="mb-4">
          <h3 className="text-lg font-semibold text-white mb-2">Skills</h3>
          <div className="flex flex-wrap gap-2">
            {skills ? (
              skills.split(",").map((skill, idx) => (
                <span key={idx} className="px-3 py-1 rounded-full bg-blue-500/20 text-blue-200 text-sm">
                  {skill.trim()}
                </span>
              ))
            ) : (
              <span className="text-blue-300">No skills added yet.</span>
            )}
          </div>
        </div>

        {isEditing && (
          <div className="space-y-4 mb-2 p-4 rounded-xl bg-white/5 border border-white/10">
            <div>
              <label className="block text-sm font-medium mb-1 text-white">Full Name</label>
              <input
                className="w-full bg-white/10 border border-white/20 rounded-lg px-3 py-2 text-white placeholder-blue-200 focus:ring-2 focus:ring-blue-500"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                placeholder="Enter your full name"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1 text-white">Bio</label>
              <textarea
                className="w-full bg-white/10 border border-white/20 rounded-lg px-3 py-2 text-white placeholder-blue-200 focus:ring-2 focus:ring-blue-500"
                value={bio}
                onChange={(e) => setBio(e.target.value)}
                placeholder="Tell us about yourself"
                rows={3}
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1 text-white">Skills</label>
              <input
                className="w-full bg-white/10 border border-white/20 rounded-lg px-3 py-2 text-white placeholder-blue-200 focus:ring-2 focus:ring-blue-500"
                value={skills}
                onChange={(e) => setSkills(e.target.value)}
                placeholder="e.g., JavaScript, Python, React"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1 text-white">Profile Photo URL</label>
              <input
                className="w-full bg-white/10 border border-white/20 rounded-lg px-3 py-2 text-white placeholder-blue-200 focus:ring-2 focus:ring-blue-500"
                value={photoUrl}
                onChange={(e) => setPhotoUrl(e.target.value)}
                placeholder="https://example.com/photo.jpg"
              />
            </div>

            {message ? <p className="text-sm text-green-400">{message}</p> : null}

            <div className="pt-2 flex gap-2">
              <button
                onClick={onSave}
                disabled={saving}
                className="rounded-lg bg-gradient-to-r from-blue-500 to-purple-500 text-white px-4 py-2 uppercase disabled:opacity-60 hover:from-blue-600 hover:to-purple-600"
              >
                {saving ? "Saving..." : "Save"}
              </button>
              <button
                onClick={() => setIsEditing(false)}
                className="rounded-lg bg-white/10 text-white px-4 py-2 uppercase hover:bg-white/20"
              >
                Cancel
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
