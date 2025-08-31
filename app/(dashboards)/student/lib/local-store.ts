"use client"

type LocalState = {
  codeById?: Record<string, string>
  submissions?: { questionId: string; code: string; passed: boolean; ts: number }[]
  profile?: { full_name?: string; bio?: string; skills?: string; photo_url?: string }
  network?: {
    connections?: { id: string; name: string; status: 'pending' | 'accepted'; ts: number }[]
    posts?: { id: string; content: string; ts: number; likes: number }[]
    endorsements?: { id: string; from: string; skill: string; ts: number }[]
    bio?: string
    currentWork?: string
    pastExperience?: string[]
    skills?: string[]
    projects?: { name: string; description: string; url?: string }[]
    certificates?: { name: string; issuer: string; date: string }[]
  }
  compete?: {
    hackathons?: { id: string; name: string; date: string; status: 'upcoming' | 'ongoing' | 'ended' }[]
    teams?: { id: string; name: string; hackathonId: string; members: string[]; ts: number }[]
    submissions?: { id: string; teamId: string; repoUrl: string; demoUrl: string; description: string; ts: number }[]
  }
}

const KEY = "student-dashboard-state:v1"

function read(): LocalState {
  try {
    const raw = localStorage.getItem(KEY)
    return raw ? (JSON.parse(raw) as LocalState) : {}
  } catch {
    return {}
  }
}
function write(s: LocalState) {
  try {
    localStorage.setItem(KEY, JSON.stringify(s))
  } catch {}
}

export function loadProgress() {
  return read()
}
export function saveProgress(partial: Partial<LocalState>) {
  const current = read()
  write({ ...current, ...partial })
}

export function saveSubmission(sub: { questionId: string; code: string; passed: boolean }) {
  const s = read()
  const arr = s.submissions || []
  arr.push({ ...sub, ts: Date.now() })
  write({ ...s, submissions: arr })
}

export function getSolvedCount(ids?: string[]) {
  const s = read()
  const solvedSet = new Set((s.submissions || []).filter((x) => x.passed).map((x) => x.questionId))
  if (!ids) return solvedSet.size
  let c = 0
  for (const id of ids) if (solvedSet.has(id)) c++
  return c
}

export function getLocalStats() {
  const s = read()
  const subs = s.submissions || []
  const solved = subs.filter((x) => x.passed).length
  // weekly solved
  const weekAgo = Date.now() - 7 * 24 * 60 * 60 * 1000
  const weekly_solved = subs.filter((x) => x.passed && x.ts >= weekAgo).length
  // simple streak: count consecutive days with any submission
  const days = new Set(
    subs
      .filter((x) => x.passed)
      .map((x) => {
        const d = new Date(x.ts)
        return `${d.getUTCFullYear()}-${d.getUTCMonth()}-${d.getUTCDate()}`
      }),
  )
  let day_streak = 0
  for (let i = 0; i < 365; i++) {
    const d = new Date(Date.now() - i * 86400000)
    const key = `${d.getUTCFullYear()}-${d.getUTCMonth()}-${d.getUTCDate()}`
    if (days.has(key)) day_streak++
    else break
  }
  return {
    solved,
    weekly_progress: weekly_solved,
    day_streak,
    submissions: subs.length,
    contest_rating: 1847
  }
}

export function loadLocalProfile() {
  const s = read()
  return s.profile || {}
}
export function saveLocalProfile(p: { full_name?: string; bio?: string; skills?: string; photo_url?: string }) {
  const s = read()
  write({ ...s, profile: { ...(s.profile || {}), ...p } })
}

export const getProfile = loadLocalProfile
export const setProfile = saveLocalProfile

// Network functions
export function getNetworkData() {
  const s = read()
  return s.network || { connections: [], posts: [], endorsements: [] }
}

export function addConnection(name: string) {
  const s = read()
  const network = s.network || { connections: [], posts: [], endorsements: [] }
  const id = `conn_${Date.now()}`
  network.connections!.push({ id, name, status: 'pending', ts: Date.now() })
  write({ ...s, network })
}

export function acceptConnection(id: string) {
  const s = read()
  const network = s.network || { connections: [], posts: [], endorsements: [] }
  const conn = network.connections!.find(c => c.id === id)
  if (conn) conn.status = 'accepted'
  write({ ...s, network })
}

export function addPost(content: string) {
  const s = read()
  const network = s.network || { connections: [], posts: [], endorsements: [] }
  const id = `post_${Date.now()}`
  network.posts!.push({ id, content, ts: Date.now(), likes: 0 })
  write({ ...s, network })
}

export function likePost(id: string) {
  const s = read()
  const network = s.network || { connections: [], posts: [], endorsements: [] }
  const post = network.posts!.find(p => p.id === id)
  if (post) post.likes++
  write({ ...s, network })
}

export function addEndorsement(from: string, skill: string) {
  const s = read()
  const network = s.network || { connections: [], posts: [], endorsements: [] }
  const id = `endor_${Date.now()}`
  network.endorsements!.push({ id, from, skill, ts: Date.now() })
  write({ ...s, network })
}

export function updateNetworkProfile(updates: {
  bio?: string
  currentWork?: string
  pastExperience?: string[]
  skills?: string[]
  projects?: { name: string; description: string; url?: string }[]
  certificates?: { name: string; issuer: string; date: string }[]
}) {
  const s = read()
  const network = s.network || { connections: [], posts: [], endorsements: [] }
  const updatedNetwork = { ...network, ...updates }
  write({ ...s, network: updatedNetwork })
}

// Compete functions
export function getCompeteData() {
  const s = read()
  return s.compete || { hackathons: [], teams: [], submissions: [] }
}

export function addHackathon(name: string, date: string) {
  const s = read()
  const compete = s.compete || { hackathons: [], teams: [], submissions: [] }
  const id = `hack_${Date.now()}`
  compete.hackathons!.push({ id, name, date, status: 'upcoming' })
  write({ ...s, compete })
}

export function createTeam(name: string, hackathonId: string) {
  const s = read()
  const compete = s.compete || { hackathons: [], teams: [], submissions: [] }
  const id = `team_${Date.now()}`
  compete.teams!.push({ id, name, hackathonId, members: ['You'], ts: Date.now() })
  write({ ...s, compete })
}

export function submitProject(teamId: string, repoUrl: string, demoUrl: string, description: string) {
  const s = read()
  const compete = s.compete || { hackathons: [], teams: [], submissions: [] }
  const id = `sub_${Date.now()}`
  compete.submissions!.push({ id, teamId, repoUrl, demoUrl, description, ts: Date.now() })
  write({ ...s, compete })
}
