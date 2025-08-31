"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import LogoutButton from "@/components/ui/logout-button"
import TalentDiscoveryPanel from "./ui/talent-discovery-panel"
import SmartFilteringPanel from "./ui/smart-filtering-panel"
import JobPostingPanel from "./ui/job-posting-panel"
import CandidateShortlistingPanel from "./ui/candidate-shortlisting-panel"
import EventParticipationPanel from "./ui/event-participation-panel"
import DirectConnectPanel from "./ui/direct-connect-panel"
import AnalyticsReportsPanel from "./ui/analytics-reports-panel"
import EmployerBrandingPanel from "./ui/employer-branding-panel"
import JudgesDemoPanel from "./ui/judges-demo-panel"
import OfferManagementPanel from "./ui/offer-management-panel"
import InterviewSchedulingPanel from "./ui/interview-scheduling-panel"
import GlassCard from "./ui/glass-card"
import { getProfile, saveProfile } from "./lib/local-store"

const tabs = [
  { id: "talent", label: "TALENT DISCOVERY" },
  { id: "filters", label: "SMART FILTERING" },
  { id: "jobs", label: "JOB & INTERNSHIP POSTING" },
  { id: "shortlist", label: "CANDIDATE SHORTLISTING" },
  { id: "events", label: "EVENT PARTICIPATION" },
  { id: "connect", label: "DIRECT CONNECT" },
  { id: "analytics", label: "ANALYTICS & REPORTS" },
  { id: "branding", label: "EMPLOYER BRANDING" },
  { id: "offers", label: "OFFER MANAGEMENT" },
  { id: "interviews", label: "INTERVIEW SCHEDULING" },
  { id: "judges", label: "HACKATHON DEMO" },
] as const

export default function RecruiterDashboardClient() {
  const [profile, setProfile] = useState(getProfile())
  const [editMode, setEditMode] = useState(false)
  const [formData, setFormData] = useState({
    full_name: profile.full_name || "",
    company: profile.company || "",
    position: profile.position || "",
    bio: profile.bio || "",
    skills: profile.skills?.join(", ") || ""
  })

  useEffect(() => {
    const updatedProfile = getProfile()
    setProfile(updatedProfile)
    setFormData({
      full_name: updatedProfile.full_name || "",
      company: updatedProfile.company || "",
      position: updatedProfile.position || "",
      bio: updatedProfile.bio || "",
      skills: updatedProfile.skills?.join(", ") || ""
    })
  }, [])

  const handleSaveProfile = () => {
    const updates = {
      full_name: formData.full_name.trim() || undefined,
      company: formData.company.trim() || undefined,
      position: formData.position.trim() || undefined,
      bio: formData.bio.trim() || undefined,
      skills: formData.skills.trim() ? formData.skills.split(",").map(s => s.trim()) : undefined
    }
    saveProfile(updates)
    setProfile(getProfile())
    setEditMode(false)
  }

  const recruiterName = profile.full_name || "RECRUITER"

  return (
    <div className="space-y-6 uppercase">
      {/* Header */}
      <div className="rounded-2xl bg-black/30 backdrop-blur-lg border border-white/20 p-6 shadow-2xl">
        <div className="flex items-center justify-between gap-4 flex-wrap">
          <div>
            <h1 className="text-4xl lg:text-5xl font-extrabold bg-gradient-to-r from-cyan-400 to-indigo-400 bg-clip-text text-transparent">
              {`WELCOME, ${recruiterName}`.toUpperCase()}
            </h1>
            <p className="text-sm text-gray-300 font-semibold">
              {"DISCOVER TALENT, POST ROLES, SHORTLIST CANDIDATES, AND CONNECT — ALL IN ONE PLACE".toUpperCase()}
            </p>
          </div>
          <div className="flex items-center gap-2">
            <Button
              onClick={() => setEditMode(!editMode)}
              variant="secondary"
              className="border border-white/20 bg-background/40 hover:bg-background/50 text-white backdrop-blur-sm"
            >
              {editMode ? "CANCEL" : "EDIT PROFILE"}
            </Button>
            <LogoutButton />
          </div>
        </div>

        {/* Profile Display */}
        {!editMode && profile.full_name && (
          <div className="mt-4 grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="rounded-xl border border-white/15 bg-white/5 p-4">
              <div className="text-xs text-gray-400">COMPANY</div>
              <div className="text-lg font-bold text-white">{profile.company || "Not specified"}</div>
            </div>
            <div className="rounded-xl border border-white/15 bg-white/5 p-4">
              <div className="text-xs text-gray-400">POSITION</div>
              <div className="text-lg font-bold text-white">{profile.position || "Not specified"}</div>
            </div>
            <div className="rounded-xl border border-white/15 bg-white/5 p-4">
              <div className="text-xs text-gray-400">SKILLS</div>
              <div className="text-sm text-white">{profile.skills?.join(", ") || "Not specified"}</div>
            </div>
          </div>
        )}

        {/* Edit Profile Form */}
        {editMode && (
          <Card className="mt-4 bg-black/30 backdrop-blur-lg border border-white/20 shadow-2xl">
            <CardHeader>
              <CardTitle className="text-white">{"EDIT RECRUITER PROFILE".toUpperCase()}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <Input
                placeholder="FULL NAME"
                value={formData.full_name}
                onChange={(e) => setFormData({ ...formData, full_name: e.target.value })}
                className="bg-white/10 border-white/20 text-white placeholder:text-gray-400"
              />
              <Input
                placeholder="COMPANY"
                value={formData.company}
                onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                className="bg-white/10 border-white/20 text-white placeholder:text-gray-400"
              />
              <Input
                placeholder="POSITION"
                value={formData.position}
                onChange={(e) => setFormData({ ...formData, position: e.target.value })}
                className="bg-white/10 border-white/20 text-white placeholder:text-gray-400"
              />
              <Textarea
                placeholder="BIO"
                value={formData.bio}
                onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                className="bg-white/10 border-white/20 text-white placeholder:text-gray-400"
              />
              <Input
                placeholder="SKILLS (COMMA SEPARATED)"
                value={formData.skills}
                onChange={(e) => setFormData({ ...formData, skills: e.target.value })}
                className="bg-white/10 border-white/20 text-white placeholder:text-gray-400"
              />
              <div className="flex gap-2">
                <Button onClick={handleSaveProfile} className="bg-blue-600 hover:bg-blue-700">
                  {"SAVE PROFILE".toUpperCase()}
                </Button>
                <Button onClick={() => setEditMode(false)} variant="outline">
                  {"CANCEL".toUpperCase()}
                </Button>
              </div>
            </CardContent>
          </Card>
        )}
      </div>

      {/* Dashboard Grid Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Left Column */}
        <div className="space-y-6">
          {/* Talent Discovery */}
          <div className="rounded-2xl bg-black/30 backdrop-blur-lg border border-white/20 shadow-2xl p-6">
            <div className="text-white text-xl font-bold mb-4">TALENT DISCOVERY</div>
            <TalentDiscoveryPanel />
          </div>

          {/* Job & Internship Posting */}
          <div className="rounded-2xl bg-black/30 backdrop-blur-lg border border-white/20 shadow-2xl p-6">
            <div className="text-white text-xl font-bold mb-4">JOB & INTERNSHIP POSTING</div>
            <JobPostingPanel />
          </div>

          {/* Smart Filtering */}
          <div className="rounded-2xl bg-black/30 backdrop-blur-lg border border-white/20 shadow-2xl p-6">
            <div className="text-white text-xl font-bold mb-4">SMART FILTERING</div>
            <SmartFilteringPanel />
          </div>

          {/* Candidate Shortlisting */}
          <div className="rounded-2xl bg-black/30 backdrop-blur-lg border border-white/20 shadow-2xl p-6">
            <div className="text-white text-xl font-bold mb-4">CANDIDATE SHORTLISTING</div>
            <CandidateShortlistingPanel />
          </div>
        </div>

        {/* Right Column */}
        <div className="space-y-6">
          {/* Event Participation */}
          <div className="rounded-2xl bg-black/30 backdrop-blur-lg border border-white/20 shadow-2xl p-6">
            <div className="text-white text-xl font-bold mb-4">EVENT PARTICIPATION</div>
            <EventParticipationPanel />
          </div>

          {/* Direct Connect */}
          <div className="rounded-2xl bg-black/30 backdrop-blur-lg border border-white/20 shadow-2xl p-6">
            <div className="text-white text-xl font-bold mb-4">DIRECT CONNECT</div>
            <DirectConnectPanel />
          </div>

          {/* Analytics & Reports */}
          <div className="rounded-2xl bg-black/30 backdrop-blur-lg border border-white/20 shadow-2xl p-6">
            <div className="text-white text-xl font-bold mb-4">ANALYTICS & REPORTS</div>
            <AnalyticsReportsPanel />
          </div>

          {/* Employer Branding */}
          <div className="rounded-2xl bg-black/30 backdrop-blur-lg border border-white/20 shadow-2xl p-6">
            <div className="text-white text-xl font-bold mb-4">EMPLOYER BRANDING</div>
            <EmployerBrandingPanel />
          </div>
        </div>
      </div>

      {/* Full-width panels */}
      <div className="space-y-6">
        {/* Offer Management */}
        <div className="rounded-2xl bg-black/30 backdrop-blur-lg border border-white/20 shadow-2xl p-6">
          <div className="text-white text-xl font-bold mb-4">OFFER MANAGEMENT</div>
          <OfferManagementPanel />
        </div>

        {/* Interview Scheduling */}
        <div className="rounded-2xl bg-black/30 backdrop-blur-lg border border-white/20 shadow-2xl p-6">
          <div className="text-white text-xl font-bold mb-4">INTERVIEW SCHEDULING</div>
          <InterviewSchedulingPanel />
        </div>

        {/* Hackathon Demo */}
        <div className="rounded-2xl bg-black/30 backdrop-blur-lg border border-white/20 shadow-2xl p-6">
          <div className="text-white text-xl font-bold mb-4">HACKATHON DEMO</div>
          <JudgesDemoPanel />
        </div>
      </div>
    </div>
  )
}
