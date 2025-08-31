"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

type Comment = {
  id: string
  content: string
  author: string
  createdAt: number
}

type Reaction = {
  emoji: string
  users: string[]
}

type Post = {
  id: string
  content: string
  author: string
  createdAt: number
  comments: Comment[]
  reactions: Record<string, Reaction>
}

const COMMUNITY_POSTS_KEY = "community.posts"
const PROFILE_KEY = "student.profile"

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

export default function CommunityFeed() {
  // Clear any existing demo posts on component mount
  useEffect(() => {
    localStorage.removeItem(COMMUNITY_POSTS_KEY)
  }, [])

  const [posts, setPosts] = useState<Post[]>(() => read<Post[]>(COMMUNITY_POSTS_KEY, []))
  const [profile] = useState(() => read<any>(PROFILE_KEY, { full_name: "student" }))
  const [commentTexts, setCommentTexts] = useState<Record<string, string>>({})

  const currentUser = profile.full_name || "student"

  function addComment(postId: string) {
    const text = commentTexts[postId]?.trim()
    if (!text) return

    const newComment: Comment = {
      id: `${Date.now()}`,
      content: text,
      author: currentUser,
      createdAt: Date.now()
    }

    const next = posts.map((p) =>
      p.id === postId
        ? { ...p, comments: [...p.comments, newComment] }
        : p
    )
    setPosts(next)
    write(COMMUNITY_POSTS_KEY, next)
    setCommentTexts({ ...commentTexts, [postId]: "" })
  }

  function toggleReaction(postId: string, emoji: string) {
    const user = currentUser
    const next = posts.map((p) => {
      if (p.id !== postId) return p

      const reactions = { ...p.reactions }
      if (!reactions[emoji]) {
        reactions[emoji] = { emoji, users: [] }
      }

      const reaction = reactions[emoji]
      if (reaction.users.includes(user)) {
        reaction.users = reaction.users.filter(u => u !== user)
        if (reaction.users.length === 0) {
          delete reactions[emoji]
        }
      } else {
        reaction.users.push(user)
      }

      return { ...p, reactions }
    })
    setPosts(next)
    write(COMMUNITY_POSTS_KEY, next)
  }

  const emojis = ["👍", "❤️", "😂", "😮", "😢", "😡"]

  return (
    <div className="space-y-6">
      <div className="text-white text-xl font-bold">Community Posts</div>

      {posts.length === 0 ? (
        <p className="text-sm text-muted-foreground">No posts yet. Be the first to share!</p>
      ) : (
        <ul className="space-y-4">
          {posts.map((p) => (
            <li key={p.id} className="border rounded-md p-4 bg-black/20">
              <div className="text-xs text-gray-400 mb-2">
                {p.author} · {new Date(p.createdAt).toLocaleString()}
              </div>
              <p className="text-white mb-3">{p.content}</p>

              {/* Reactions */}
              <div className="flex flex-wrap gap-2 mb-3">
                {emojis.map((emoji) => {
                  const reaction = p.reactions[emoji]
                  const hasReacted = reaction?.users.includes(currentUser)
                  return (
                    <Button
                      key={emoji}
                      size="sm"
                      variant={hasReacted ? "default" : "outline"}
                      onClick={() => toggleReaction(p.id, emoji)}
                      className={hasReacted ? "bg-blue-600" : "border-white/20 text-white hover:bg-white/10"}
                    >
                      {emoji} {reaction?.users.length || 0}
                    </Button>
                  )
                })}
              </div>

              {/* Comments */}
              <div className="space-y-2">
                {p.comments.map((c) => (
                  <div key={c.id} className="bg-white/5 p-2 rounded">
                    <div className="text-xs text-gray-400">
                      {c.author} · {new Date(c.createdAt).toLocaleString()}
                    </div>
                    <p className="text-white text-sm">{c.content}</p>
                  </div>
                ))}
              </div>

              {/* Add Comment */}
              <div className="mt-3 flex gap-2">
                <Input
                  placeholder="Add a comment..."
                  value={commentTexts[p.id] || ""}
                  onChange={(e) => setCommentTexts({ ...commentTexts, [p.id]: e.target.value })}
                  className="flex-1 bg-white/10 border-white/20 text-white placeholder:text-gray-400"
                />
                <Button
                  onClick={() => addComment(p.id)}
                  disabled={!commentTexts[p.id]?.trim()}
                  size="sm"
                >
                  Comment
                </Button>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}
