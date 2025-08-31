import type { Question, TestResult } from "../data/question-bank"

// Type declaration for Pyodide
declare global {
  interface Window {
    loadPyodide: (config?: any) => Promise<any>
  }
}

// Pyodide instance for Python execution
let pyodideInstance: any = null
let pyodideLoading = false

async function getPyodide() {
  if (pyodideInstance) return pyodideInstance
  if (pyodideLoading) {
    // Wait for loading to complete
    while (pyodideLoading) {
      await new Promise(resolve => setTimeout(resolve, 100))
    }
    return pyodideInstance
  }

  pyodideLoading = true

  try {
    // Load Pyodide from CDN
    const script = document.createElement('script')
    script.src = 'https://cdn.jsdelivr.net/pyodide/v0.26.2/full/pyodide.js'
    document.head.appendChild(script)

    await new Promise((resolve, reject) => {
      script.onload = resolve
      script.onerror = reject
    })

    // @ts-ignore - Pyodide global
    pyodideInstance = await window.loadPyodide({
      indexURL: 'https://cdn.jsdelivr.net/pyodide/v0.26.2/full/'
    })

    pyodideLoading = false
    return pyodideInstance
  } catch (error) {
    pyodideLoading = false
    throw error
  }
}

function deepEqual(a: any, b: any): boolean {
  if (a === b) return true
  if (typeof a !== typeof b) return false
  if (a && b && typeof a === "object") {
    if (Array.isArray(a)) {
      if (!Array.isArray(b) || a.length !== b.length) return false
      for (let i = 0; i < a.length; i++) if (!deepEqual(a[i], b[i])) return false
      return true
    }
    const ka = Object.keys(a)
    const kb = Object.keys(b)
    if (ka.length !== kb.length) return false
    for (const k of ka) if (!deepEqual(a[k], (b as any)[k])) return false
    return true
  }
  return false
}

function clone<T>(x: T): T {
  try {
    return JSON.parse(JSON.stringify(x))
  } catch {
    return x
  }
}

export async function runUserCode(q: Question, code: string, lang: string = "javascript"): Promise<TestResult[]> {
  if (lang === "javascript") {
    // Create an isolated function that returns user's function reference
    const wrapped = `
      "use strict";
      ${code}
      if (typeof ${q.functionName} !== "function") {
        throw new Error("Please define function: ${q.functionName}");
      }
      return ${q.functionName};
    `
    let userFunc: (...args: any[]) => any
    try {
      // eslint-disable-next-line no-new-func
      userFunc = new Function(wrapped)() as any
    } catch (e: any) {
      throw new Error(e?.message || "Code error")
    }

    const results: TestResult[] = []
    for (let i = 0; i < q.tests.length; i++) {
      const t = q.tests[i]
      const input = clone(t.input)
      const start = performance.now()
      let got: any
      let pass = false
      try {
        got = await userFunc(...(Array.isArray(input) ? input : [input]))
        pass = deepEqual(got, t.output)
      } catch (e: any) {
        got = e?.message || "Error"
        pass = false
      }
      const timeMs = performance.now() - start
      results.push({ index: i, pass, input, expected: t.output, got, timeMs })
    }
    return results
  } else if (lang === "python") {
    try {
      const pyodide = await getPyodide()

      // Create a Python wrapper that defines the function and runs tests
      const pythonWrapper = `
import json
import sys
from io import StringIO

# Capture stdout to prevent print statements from interfering
old_stdout = sys.stdout
sys.stdout = StringIO()

${code}

# Restore stdout
sys.stdout = old_stdout

# Test the function
results = []
for i, test_case in enumerate(${JSON.stringify(q.tests)}):
    try:
        # Convert input to Python format
        if isinstance(test_case['input'], list):
            args = test_case['input']
        else:
            args = [test_case['input']]

        # Call the function
        start_time = __import__('time').time()
        result = ${q.functionName}(*args)
        end_time = __import__('time').time()

        # Compare with expected output
        expected = test_case['output']
        passed = result == expected

        results.append({
            'index': i,
            'pass': passed,
            'input': test_case['input'],
            'expected': expected,
            'got': result,
            'timeMs': (end_time - start_time) * 1000
        })
    except Exception as e:
        results.append({
            'index': i,
            'pass': False,
            'input': test_case['input'],
            'expected': test_case['output'],
            'got': str(e),
            'timeMs': 0
        })

import json
print(json.dumps(results))
`

      // Run the Python code
      const result = pyodide.runPython(pythonWrapper)
      const testResults = JSON.parse(result)

      return testResults.map((r: any) => ({
        index: r.index,
        pass: r.pass,
        input: r.input,
        expected: r.expected,
        got: r.got,
        timeMs: r.timeMs
      }))

    } catch (e: any) {
      throw new Error(`Python execution error: ${e?.message || 'Unknown error'}`)
    }
  } else if (lang === "java") {
    // Mock Java code execution support
    throw new Error("Java code execution is not yet implemented.")
  } else if (lang === "cpp") {
    // Mock C++ code execution support
    throw new Error("C++ code execution is not yet implemented.")
  } else {
    throw new Error(`Code execution is not supported for language: ${lang}`)
  }
}
