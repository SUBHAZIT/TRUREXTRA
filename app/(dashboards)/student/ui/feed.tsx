"use client"

import { useState, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Input } from "@/components/ui/input"

type Attachment = {
  id: string
  name: string
  type: string
  data: string // base64 encoded
}

type Post = {
  id: string
  content: string
  createdAt: number
  likes: string[] // usernames
  attachments?: Attachment[]
}

type CommunityPost = {
  id: string
  content: string
  author: string
  createdAt: number
  comments: any[]
  reactions: Record<string, any>
}

const POSTS_KEY = "student.posts"
const PROFILE_KEY = "student.profile"
const COMMUNITY_POSTS_KEY = "community.posts"

function read<T>(k: string, f: T): T {
  if (typeof window === "undefined") return f
  try {
    const v = localStorage.getItem(k)
    return v ? (JSON.parse(v) as T) : f
  } catch {
    return f
  }
}

function write<T>(k: string, v: T) {
  if (typeof window === "undefined") return
  localStorage.setItem(k, JSON.stringify(v))
}

export default function Feed() {
  const [posts, setPosts] = useState<Post[]>(() => read<Post[]>(POSTS_KEY, []))
  const [profile] = useState(() => read<any>(PROFILE_KEY, { full_name: "student" }))
  const [text, setText] = useState("")
  const [attachments, setAttachments] = useState<Attachment[]>([])
  const fileInputRef = useRef<HTMLInputElement>(null)

  function addPost() {
    const trimmed = text.trim()
    if (!trimmed && attachments.length === 0) return

    const postId = `${Date.now()}`
    const currentUser = profile.full_name || "student"

    // Create post for personal feed
    const p: Post = {
      id: postId,
      content: trimmed,
      createdAt: Date.now(),
      likes: [],
      attachments: attachments.length > 0 ? attachments : undefined
    }

    // Create post for community feed
    const communityPost: CommunityPost = {
      id: postId,
      content: trimmed,
      author: currentUser,
      createdAt: Date.now(),
      comments: [],
      reactions: {}
    }

    // Add to personal feed
    const nextPersonal = [p, ...posts]
    setPosts(nextPersonal)
    write(POSTS_KEY, nextPersonal)

    // Add to community feed
    const existingCommunityPosts = read<CommunityPost[]>(COMMUNITY_POSTS_KEY, [])
    const nextCommunity = [communityPost, ...existingCommunityPosts]
    write(COMMUNITY_POSTS_KEY, nextCommunity)

    // Reset form
    setText("")
    setAttachments([])
  }

  function toggleLike(id: string) {
    const user = profile.full_name || "student"
    const next = posts.map((p) =>
      p.id === id
        ? { ...p, likes: p.likes.includes(user) ? p.likes.filter((u) => u !== user) : [...p.likes, user] }
        : p,
    )
    setPosts(next)
    write(POSTS_KEY, next)
  }

  function handleFileSelect(event: React.ChangeEvent<HTMLInputElement>) {
    const files = event.target.files
    if (!files) return

    const maxSize = 5 * 1024 * 1024 // 5MB
    const allowedTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp', 'application/pdf']

    Array.from(files).forEach(file => {
      if (file.size > maxSize) {
        alert(`File ${file.name} is too large. Maximum size is 5MB.`)
        return
      }

      if (!allowedTypes.includes(file.type)) {
        alert(`File type ${file.type} is not supported. Only images and PDFs are allowed.`)
        return
      }

      const reader = new FileReader()
      reader.onload = (e) => {
        const result = e.target?.result as string
        const attachment: Attachment = {
          id: `${Date.now()}-${Math.random()}`,
          name: file.name,
          type: file.type,
          data: result
        }
        setAttachments(prev => [...prev, attachment])
      }
      reader.readAsDataURL(file)
    })

    // Clear the input
    if (fileInputRef.current) {
      fileInputRef.current.value = ''
    }
  }

  function removeAttachment(id: string) {
    setAttachments(prev => prev.filter(att => att.id !== id))
  }

  return (
    <div className="space-y-4">
      <div className="border rounded-md p-3">
        <Textarea
          placeholder="Share your progress, insights, or questions..."
          value={text}
          onChange={(e) => setText(e.target.value)}
          className="min-h-[90px]"
        />

        {/* File Input */}
        <div className="mt-3">
          <Input
            ref={fileInputRef}
            type="file"
            accept="image/*,.pdf"
            multiple
            onChange={handleFileSelect}
            className="hidden"
            id="file-upload"
          />
          <label htmlFor="file-upload">
            <Button type="button" variant="outline" size="sm" asChild>
              <span className="cursor-pointer">📎 Attach Files (Images/PDFs)</span>
            </Button>
          </label>
        </div>

        {/* Selected Attachments Preview */}
        {attachments.length > 0 && (
          <div className="mt-3 space-y-2">
            <div className="text-sm text-muted-foreground">Attachments:</div>
            {attachments.map(att => (
              <div key={att.id} className="flex items-center gap-2 p-2 bg-muted rounded">
                <span className="text-sm">{att.name}</span>
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={() => removeAttachment(att.id)}
                >
                  ✕
                </Button>
              </div>
            ))}
          </div>
        )}

        <div className="flex justify-end mt-2">
          <Button onClick={addPost} disabled={!text.trim() && attachments.length === 0}>
            Post
          </Button>
        </div>
      </div>

      {posts.length === 0 ? (
        <p className="text-sm text-muted-foreground">No posts yet. Be the first to share!</p>
      ) : (
        <ul className="space-y-3">
          {posts.map((p) => (
            <li key={p.id} className="border rounded-md p-3">
              <div className="text-xs text-muted-foreground">{new Date(p.createdAt).toLocaleString()}</div>
              {p.content && <p className="text-sm mt-1 whitespace-pre-wrap">{p.content}</p>}

              {/* Attachments Display */}
              {p.attachments && p.attachments.length > 0 && (
                <div className="mt-3 space-y-2">
                  <div className="text-sm text-muted-foreground">Attachments:</div>
                  <div className="grid gap-2">
                    {p.attachments.map(att => (
                      <div key={att.id} className="border rounded p-2 bg-muted/50">
                        {att.type.startsWith('image/') ? (
                          <div>
                            <img
                              src={att.data}
                              alt={att.name}
                              className="max-w-full h-auto rounded max-h-64 object-contain"
                            />
                            <div className="text-xs text-muted-foreground mt-1">{att.name}</div>
                          </div>
                        ) : att.type === 'application/pdf' ? (
                          <div className="flex items-center gap-2">
                            <span className="text-sm">📄 {att.name}</span>
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => {
                                const link = document.createElement('a')
                                link.href = att.data
                                link.download = att.name
                                link.click()
                              }}
                            >
                              Download
                            </Button>
                          </div>
                        ) : null}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              <div className="mt-2">
                <Button size="sm" variant="outline" onClick={() => toggleLike(p.id)}>
                  Like · {p.likes.length}
                </Button>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}
