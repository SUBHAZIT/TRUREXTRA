"use client"

import { useEffect, useState } from "react"

export function readJSON<T>(key: string, fallback: T): T {
  if (typeof window === "undefined") return fallback
  try {
    const raw = localStorage.getItem(key)
    if (!raw) return fallback
    return JSON.parse(raw) as T
  } catch {
    return fallback
  }
}

export function writeJSON<T>(key: string, value: T) {
  if (typeof window === "undefined") return
  localStorage.setItem(key, JSON.stringify(value))
}

export function useLocalJSON<T>(key: string, fallback: T) {
  const [state, setState] = useState<T>(() => readJSON<T>(key, fallback))
  useEffect(() => {
    writeJSON(key, state)
  }, [key, state])
  return [state, setState] as const
}
