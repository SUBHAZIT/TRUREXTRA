"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { getCompeteData, addHackathon, createTeam, submitProject } from "../lib/local-store"

export default function CompetePanel() {
  const [competeData, setCompeteData] = useState(getCompeteData())
  const [newHackathonName, setNewHackathonName] = useState("")
  const [newHackathonDate, setNewHackathonDate] = useState("")
  const [teamName, setTeamName] = useState("")
  const [selectedHackathon, setSelectedHackathon] = useState("")
  const [repoUrl, setRepoUrl] = useState("")
  const [demoUrl, setDemoUrl] = useState("")
  const [description, setDescription] = useState("")
  const [selectedTeam, setSelectedTeam] = useState("")

  useEffect(() => {
    setCompeteData(getCompeteData())
  }, [])

  const handleAddHackathon = () => {
    if (newHackathonName.trim() && newHackathonDate.trim()) {
      addHackathon(newHackathonName.trim(), newHackathonDate.trim())
      setCompeteData(getCompeteData())
      setNewHackathonName("")
      setNewHackathonDate("")
    }
  }

  const handleCreateTeam = () => {
    if (teamName.trim() && selectedHackathon) {
      createTeam(teamName.trim(), selectedHackathon)
      setCompeteData(getCompeteData())
      setTeamName("")
      setSelectedHackathon("")
    }
  }

  const handleSubmitProject = () => {
    if (selectedTeam && (repoUrl.trim() || demoUrl.trim() || description.trim())) {
      submitProject(selectedTeam, repoUrl.trim(), demoUrl.trim(), description.trim())
      setCompeteData(getCompeteData())
      setRepoUrl("")
      setDemoUrl("")
      setDescription("")
      setSelectedTeam("")
    }
  }

  return (
    <div className="space-y-6">
      {/* Hackathons */}
      <Card className="bg-black/30 backdrop-blur-lg border border-white/20 shadow-2xl">
        <CardHeader>
          <CardTitle className="text-white">Hackathons</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
            <Input
              placeholder="Hackathon name"
              value={newHackathonName}
              onChange={(e) => setNewHackathonName(e.target.value)}
              className="bg-white/10 border-white/20 text-white placeholder:text-gray-400"
            />
            <Input
              type="date"
              value={newHackathonDate}
              onChange={(e) => setNewHackathonDate(e.target.value)}
              className="bg-white/10 border-white/20 text-white"
            />
            <Button onClick={handleAddHackathon} className="bg-blue-600 hover:bg-blue-700">
              Add Hackathon
            </Button>
          </div>
          <div className="space-y-2">
            {competeData.hackathons?.map((hack) => (
              <div key={hack.id} className="bg-white/5 p-3 rounded-lg">
                <div className="text-white font-medium">{hack.name}</div>
                <div className="text-sm text-gray-400">Date: {hack.date} | Status: {hack.status}</div>
              </div>
            ))}
            {(!competeData.hackathons || competeData.hackathons.length === 0) && (
              <p className="text-gray-400">No hackathons yet.</p>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Teams */}
      <Card className="bg-black/30 backdrop-blur-lg border border-white/20 shadow-2xl">
        <CardHeader>
          <CardTitle className="text-white">Teams</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
            <Input
              placeholder="Team name"
              value={teamName}
              onChange={(e) => setTeamName(e.target.value)}
              className="bg-white/10 border-white/20 text-white placeholder:text-gray-400"
            />
            <select
              value={selectedHackathon}
              onChange={(e) => setSelectedHackathon(e.target.value)}
              className="bg-white/10 border border-white/20 text-white rounded px-3 py-2"
            >
              <option value="">Select Hackathon</option>
              {competeData.hackathons?.map((hack) => (
                <option key={hack.id} value={hack.id}>
                  {hack.name}
                </option>
              ))}
            </select>
            <Button onClick={handleCreateTeam} className="bg-green-600 hover:bg-green-700">
              Create Team
            </Button>
          </div>
          <div className="space-y-2">
            {competeData.teams?.map((team) => (
              <div key={team.id} className="bg-white/5 p-3 rounded-lg">
                <div className="text-white font-medium">{team.name}</div>
                <div className="text-sm text-gray-400">
                  Hackathon: {competeData.hackathons?.find(h => h.id === team.hackathonId)?.name} |
                  Members: {team.members.join(", ")}
                </div>
              </div>
            ))}
            {(!competeData.teams || competeData.teams.length === 0) && (
              <p className="text-gray-400">No teams yet.</p>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Submissions */}
      <Card className="bg-black/30 backdrop-blur-lg border border-white/20 shadow-2xl">
        <CardHeader>
          <CardTitle className="text-white">Project Submissions</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
            <select
              value={selectedTeam}
              onChange={(e) => setSelectedTeam(e.target.value)}
              className="bg-white/10 border border-white/20 text-white rounded px-3 py-2"
            >
              <option value="">Select Team</option>
              {competeData.teams?.map((team) => (
                <option key={team.id} value={team.id}>
                  {team.name}
                </option>
              ))}
            </select>
            <Input
              placeholder="Repository URL"
              value={repoUrl}
              onChange={(e) => setRepoUrl(e.target.value)}
              className="bg-white/10 border-white/20 text-white placeholder:text-gray-400"
            />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
            <Input
              placeholder="Demo URL"
              value={demoUrl}
              onChange={(e) => setDemoUrl(e.target.value)}
              className="bg-white/10 border-white/20 text-white placeholder:text-gray-400"
            />
            <Button onClick={handleSubmitProject} className="bg-purple-600 hover:bg-purple-700">
              Submit Project
            </Button>
          </div>
          <Textarea
            placeholder="Project description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="bg-white/10 border-white/20 text-white placeholder:text-gray-400"
          />
          <div className="space-y-2">
            {competeData.submissions?.map((sub) => (
              <div key={sub.id} className="bg-white/5 p-3 rounded-lg">
                <div className="text-white font-medium">
                  Team: {competeData.teams?.find(t => t.id === sub.teamId)?.name}
                </div>
                <div className="text-sm text-gray-400">
                  Repo: {sub.repoUrl || "N/A"} | Demo: {sub.demoUrl || "N/A"}
                </div>
                <div className="text-sm text-gray-300 mt-1">{sub.description}</div>
              </div>
            ))}
            {(!competeData.submissions || competeData.submissions.length === 0) && (
              <p className="text-gray-400">No submissions yet.</p>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
