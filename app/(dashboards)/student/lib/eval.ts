"use client"

import type { Question } from "../data/questions"
import { readJSON, writeJSON, useLocalJSON } from "./local"

export type SubmissionHistory = {
  lastCode?: string
  history: { at: number; passed: boolean }[]
}

export function deepEqual(a: any, b: any): boolean {
  if (Object.is(a, b)) return true
  if (typeof a !== typeof b) return false
  if (Array.isArray(a) && Array.isArray(b)) {
    if (a.length !== b.length) return false
    for (let i = 0; i < a.length; i++) if (!deepEqual(a[i], b[i])) return false
    return true
  }
  if (a && b && typeof a === "object") {
    const ak = Object.keys(a)
    const bk = Object.keys(b)
    if (ak.length !== bk.length) return false
    for (const k of ak) if (!deepEqual(a[k], b[k])) return false
    return true
  }
  return false
}

export async function evaluateUserCode(
  q: Question,
  code: string,
  returnFnOnly = false,
): Promise<{ fn: ((...args: any[]) => any) | null; outcomes: { pass: boolean; got: any; expected: any }[] }> {
  let fn: any = null
  try {
    fn = new Function(`${code}; return ${q.functionName};`)()
  } catch (e) {
    throw new Error("Compilation error. Check your syntax.")
  }
  if (returnFnOnly) return { fn, outcomes: [] }

  const outcomes = q.tests.map((t) => {
    let got: any
    try {
      got = fn(...t.input)
    } catch (err) {
      got = String(err)
    }
    return { pass: deepEqual(got, t.output), got, expected: t.output }
  })
  return { fn, outcomes }
}

export function recordSubmission(slug: string, passed: boolean, code: string) {
  const key = "student.submissions"
  const store = readJSON<Record<string, SubmissionHistory>>(key, {})
  const prev = store[slug] || { history: [] }
  const next: SubmissionHistory = { lastCode: code, history: [...prev.history, { at: Date.now(), passed }] }
  writeJSON(key, { ...store, [slug]: next })
}

export { useLocalJSON, readJSON, writeJSON }
