"use client"

import { useEffect, useState } from "react"

export function useLocalStorage<T>(key: string, initialValue: T) {
  const [value, setValue] = useState<T>(initialValue)

  useEffect(() => {
    try {
      const raw = typeof window !== "undefined" ? window.localStorage.getItem(key) : null
      if (raw) setValue(JSON.parse(raw))
    } catch {
      // ignore corrupt local storage
    }
  }, [key])

  useEffect(() => {
    try {
      if (typeof window !== "undefined") {
        window.localStorage.setItem(key, JSON.stringify(value))
      }
    } catch {
      // ignore write errors (quota/private mode)
    }
  }, [key, value])

  const removeValue = () => {
    if (typeof window !== "undefined") {
      window.localStorage.removeItem(key)
      setValue(initialValue)
    }
  }

  const clearStorage = () => {
    if (typeof window !== "undefined") {
      window.localStorage.clear()
      setValue(initialValue)
    }
  }

  return [value, setValue, removeValue, clearStorage] as const
}
