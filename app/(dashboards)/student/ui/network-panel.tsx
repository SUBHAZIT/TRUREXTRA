"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { getNetworkData, addConnection, acceptConnection, addPost, likePost, addEndorsement, updateNetworkProfile } from "../lib/local-store"

export default function NetworkPanel() {
  const [networkData, setNetworkData] = useState(getNetworkData())
  const [newConnection, setNewConnection] = useState("")
  const [newPost, setNewPost] = useState("")
  const [newEndorsementFrom, setNewEndorsementFrom] = useState("")
  const [newEndorsementSkill, setNewEndorsementSkill] = useState("")
  const [projectName, setProjectName] = useState("")
  const [projectDesc, setProjectDesc] = useState("")
  const [projectUrl, setProjectUrl] = useState("")
  const [certName, setCertName] = useState("")
  const [certIssuer, setCertIssuer] = useState("")
  const [certDate, setCertDate] = useState("")

  useEffect(() => {
    const data = getNetworkData()
    setNetworkData(data)
  }, [])

  const handleAddConnection = () => {
    if (newConnection.trim()) {
      addConnection(newConnection.trim())
      setNetworkData(getNetworkData())
      setNewConnection("")
    }
  }

  const handleAcceptConnection = (id: string) => {
    acceptConnection(id)
    setNetworkData(getNetworkData())
  }

  const handleAddPost = () => {
    if (newPost.trim()) {
      addPost(newPost.trim())
      setNetworkData(getNetworkData())
      setNewPost("")
    }
  }

  const handleLikePost = (id: string) => {
    likePost(id)
    setNetworkData(getNetworkData())
  }

  const handleAddEndorsement = () => {
    if (newEndorsementFrom.trim() && newEndorsementSkill.trim()) {
      addEndorsement(newEndorsementFrom.trim(), newEndorsementSkill.trim())
      setNetworkData(getNetworkData())
      setNewEndorsementFrom("")
      setNewEndorsementSkill("")
    }
  }

  const handleAddProject = () => {
    if (projectName.trim() && projectDesc.trim()) {
      const currentProjects = networkData.projects || []
      const newProject = { name: projectName.trim(), description: projectDesc.trim(), url: projectUrl.trim() || undefined }
      updateNetworkProfile({ projects: [...currentProjects, newProject] })
      setNetworkData(getNetworkData())
      setProjectName("")
      setProjectDesc("")
      setProjectUrl("")
    }
  }

  const handleAddCertificate = () => {
    if (certName.trim() && certIssuer.trim() && certDate.trim()) {
      const currentCerts = networkData.certificates || []
      const newCert = { name: certName.trim(), issuer: certIssuer.trim(), date: certDate.trim() }
      updateNetworkProfile({ certificates: [...currentCerts, newCert] })
      setNetworkData(getNetworkData())
      setCertName("")
      setCertIssuer("")
      setCertDate("")
    }
  }

  const acceptedConnections = networkData.connections?.filter(c => c.status === 'accepted') || []

  return (
    <div className="space-y-6">
      {/* Profile Summary */}
      <Card className="bg-black/30 backdrop-blur-lg border border-white/20 shadow-2xl">
        <CardHeader>
          <CardTitle className="text-white">{"PROFILE SUMMARY".toUpperCase()}</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="text-white">
            <div className="text-2xl font-bold">{acceptedConnections.length} {"CONNECTIONS".toUpperCase()}</div>
            {networkData.bio && <p className="mt-2">{networkData.bio.toUpperCase()}</p>}
            {networkData.currentWork && <p className="mt-1 text-gray-300">{networkData.currentWork.toUpperCase()}</p>}
          </div>
        </CardContent>
      </Card>

      {/* Projects */}
      <Card className="bg-black/30 backdrop-blur-lg border border-white/20 shadow-2xl">
        <CardHeader>
          <CardTitle className="text-white">{"PROJECTS".toUpperCase()}</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
            <Input
              placeholder="PROJECT NAME"
              value={projectName}
              onChange={(e) => setProjectName(e.target.value)}
              className="bg-white/10 border-white/20 text-white placeholder:text-gray-400"
            />
            <Input
              placeholder="URL (OPTIONAL)"
              value={projectUrl}
              onChange={(e) => setProjectUrl(e.target.value)}
              className="bg-white/10 border-white/20 text-white placeholder:text-gray-400"
            />
            <Button onClick={handleAddProject} className="bg-green-600 hover:bg-green-700">
              {"ADD PROJECT".toUpperCase()}
            </Button>
          </div>
          <Textarea
            placeholder="DESCRIPTION"
            value={projectDesc}
            onChange={(e) => setProjectDesc(e.target.value)}
            className="bg-white/10 border-white/20 text-white placeholder:text-gray-400"
          />
          <div className="space-y-2">
            {networkData.projects?.map((proj, i) => (
              <div key={i} className="bg-white/5 p-3 rounded-lg">
                <div className="text-white font-medium">{proj.name.toUpperCase()}</div>
                <div className="text-sm text-gray-300">{proj.description.toUpperCase()}</div>
                {proj.url && <div className="text-sm text-blue-400">{proj.url.toUpperCase()}</div>}
              </div>
            ))}
            {(!networkData.projects || networkData.projects.length === 0) && (
              <p className="text-gray-400">{"NO PROJECTS YET.".toUpperCase()}</p>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Certificates */}
      <Card className="bg-black/30 backdrop-blur-lg border border-white/20 shadow-2xl">
        <CardHeader>
          <CardTitle className="text-white">{"CERTIFICATES".toUpperCase()}</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
            <Input
              placeholder="CERTIFICATE NAME"
              value={certName}
              onChange={(e) => setCertName(e.target.value)}
              className="bg-white/10 border-white/20 text-white placeholder:text-gray-400"
            />
            <Input
              placeholder="ISSUER"
              value={certIssuer}
              onChange={(e) => setCertIssuer(e.target.value)}
              className="bg-white/10 border-white/20 text-white placeholder:text-gray-400"
            />
            <Input
              type="date"
              value={certDate}
              onChange={(e) => setCertDate(e.target.value)}
              className="bg-white/10 border-white/20 text-white"
            />
          </div>
          <Button onClick={handleAddCertificate} className="bg-purple-600 hover:bg-purple-700">
            {"ADD CERTIFICATE".toUpperCase()}
          </Button>
          <div className="space-y-2">
            {networkData.certificates?.map((cert, i) => (
              <div key={i} className="bg-white/5 p-3 rounded-lg">
                <div className="text-white font-medium">{cert.name.toUpperCase()}</div>
                <div className="text-sm text-gray-400">{cert.issuer.toUpperCase()} - {cert.date.toUpperCase()}</div>
              </div>
            ))}
            {(!networkData.certificates || networkData.certificates.length === 0) && (
              <p className="text-gray-400">{"NO CERTIFICATES YET.".toUpperCase()}</p>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Connections */}
      <Card className="bg-black/30 backdrop-blur-lg border border-white/20 shadow-2xl">
        <CardHeader>
          <CardTitle className="text-white">{"CONNECTIONS".toUpperCase()}</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex gap-2">
            <Input
              placeholder="ADD CONNECTION NAME"
              value={newConnection}
              onChange={(e) => setNewConnection(e.target.value)}
              className="bg-white/10 border-white/20 text-white placeholder:text-gray-400"
            />
            <Button onClick={handleAddConnection} className="bg-blue-600 hover:bg-blue-700">
              {"ADD".toUpperCase()}
            </Button>
          </div>
          <div className="space-y-2">
            {networkData.connections?.map((conn) => (
              <div key={conn.id} className="flex items-center justify-between bg-white/5 p-3 rounded-lg">
                <div>
                  <div className="text-white font-medium">{conn.name.toUpperCase()}</div>
                  <div className="text-sm text-gray-400">{"STATUS: ".toUpperCase()}{conn.status.toUpperCase()}</div>
                </div>
                {conn.status === 'pending' && (
                  <Button
                    onClick={() => handleAcceptConnection(conn.id)}
                    className="bg-green-600 hover:bg-green-700"
                  >
                    {"ACCEPT".toUpperCase()}
                  </Button>
                )}
              </div>
            ))}
            {(!networkData.connections || networkData.connections.length === 0) && (
              <p className="text-gray-400">{"NO CONNECTIONS YET.".toUpperCase()}</p>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Posts */}
      <Card className="bg-black/30 backdrop-blur-lg border border-white/20 shadow-2xl">
        <CardHeader>
          <CardTitle className="text-white">{"POSTS".toUpperCase()}</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Textarea
              placeholder="SHARE AN UPDATE..."
              value={newPost}
              onChange={(e) => setNewPost(e.target.value)}
              className="bg-white/10 border-white/20 text-white placeholder:text-gray-400"
            />
            <Button onClick={handleAddPost} className="bg-blue-600 hover:bg-blue-700">
              {"POST".toUpperCase()}
            </Button>
          </div>
          <div className="space-y-3">
            {networkData.posts?.map((post) => (
              <div key={post.id} className="bg-white/5 p-4 rounded-lg">
                <div className="text-white">{post.content.toUpperCase()}</div>
                <div className="flex items-center justify-between mt-2">
                  <div className="text-sm text-gray-400">
                    {new Date(post.ts).toLocaleString().toUpperCase()}
                  </div>
                  <Button
                    onClick={() => handleLikePost(post.id)}
                    variant="outline"
                    size="sm"
                    className="border-white/20 text-white hover:bg-white/10"
                  >
                    👍 {post.likes}
                  </Button>
                </div>
              </div>
            ))}
            {(!networkData.posts || networkData.posts.length === 0) && (
              <p className="text-gray-400">{"NO POSTS YET.".toUpperCase()}</p>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Endorsements */}
      <Card className="bg-black/30 backdrop-blur-lg border border-white/20 shadow-2xl">
        <CardHeader>
          <CardTitle className="text-white">{"ENDORSEMENTS".toUpperCase()}</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
            <Input
              placeholder="FROM"
              value={newEndorsementFrom}
              onChange={(e) => setNewEndorsementFrom(e.target.value)}
              className="bg-white/10 border-white/20 text-white placeholder:text-gray-400"
            />
            <Input
              placeholder="SKILL"
              value={newEndorsementSkill}
              onChange={(e) => setNewEndorsementSkill(e.target.value)}
              className="bg-white/10 border-white/20 text-white placeholder:text-gray-400"
            />
            <Button onClick={handleAddEndorsement} className="bg-blue-600 hover:bg-blue-700">
              {"ADD".toUpperCase()}
            </Button>
          </div>
          <div className="space-y-2">
            {networkData.endorsements?.map((endor) => (
              <div key={endor.id} className="bg-white/5 p-3 rounded-lg">
                <div className="text-white font-medium">{endor.skill.toUpperCase()}</div>
                <div className="text-sm text-gray-400">{"ENDORSED BY ".toUpperCase()}{endor.from.toUpperCase()}</div>
              </div>
            ))}
            {(!networkData.endorsements || networkData.endorsements.length === 0) && (
              <p className="text-gray-400">{"NO ENDORSEMENTS YET.".toUpperCase()}</p>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
