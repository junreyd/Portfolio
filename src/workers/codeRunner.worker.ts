/// <reference lib="webworker" />
import type { WorkerRequest, WorkerResponse } from '../types/playground'
import { OUTPUT_LIMIT } from '../data/playground'

const scope = self as DedicatedWorkerGlobalScope
const send = (message: WorkerResponse) => scope.postMessage(message)
const format = (value: unknown): string => {
  if (typeof value === 'string') return value
  if (value === undefined) return 'undefined'
  try {
    return JSON.stringify(value) ?? String(value)
  } catch {
    return String(value)
  }
}

scope.onmessage = async (event: MessageEvent<WorkerRequest>) => {
  const { language, code, runtimeBase } = event.data
  const lines: string[] = []
  let total = 0
  const capture = (...values: unknown[]) => {
    const text = values.map(format).join(' ')
    total += text.length
    if (total > OUTPUT_LIMIT)
      throw new Error(`Output exceeds ${OUTPUT_LIMIT} characters. Try a smaller result.`)
    lines.push(text)
  }

  try {
    if (language === 'javascript' || language === 'typescript') {
      let source = code
      if (language === 'typescript') {
        const { transform } = await import('sucrase')
        source = transform(code, { transforms: ['typescript'], disableESTransforms: true }).code
      }
      send({ type: 'ready' })
      const AsyncFunction = Object.getPrototypeOf(async () => {}).constructor
      const execute = new AsyncFunction('console', `"use strict";\n${source}`)
      const result = await execute({
        log: capture,
        info: capture,
        warn: capture,
        error: capture,
        table: capture,
      })
      if (result !== undefined) capture(result)
    } else if (language === 'sql') {
      const { default: initSqlJs } = await import('sql.js')
      const { default: wasmUrl } = await import('sql.js/dist/sql-wasm.wasm?url')
      const SQL = await initSqlJs({ locateFile: () => new URL(wasmUrl, scope.location.href).href })
      const db = new SQL.Database()
      send({ type: 'ready' })
      try {
        const results = db.exec(code)
        for (const result of results) {
          capture(result.columns.join(' | '))
          for (const row of result.values)
            capture(row.map((value) => (value === null ? 'NULL' : String(value))).join(' | '))
        }
      } finally {
        db.close()
      }
    } else {
      const indexURL = `${runtimeBase}runtimes/python/`
      const { loadPyodide } = await import(/* @vite-ignore */ `${indexURL}pyodide.mjs`)
      const python = await loadPyodide({ indexURL, stdout: capture, stderr: capture })
      send({ type: 'ready' })
      const result = await python.runPythonAsync(code)
      if (result !== undefined && result !== null) {
        capture(String(result))
        result?.destroy?.()
      }
    }
    send({
      type: 'result',
      output:
        lines.join('\n') ||
        'Completed successfully. No output — try console.log, print, or SELECT.',
    })
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error)
    send({ type: 'error', output: message.slice(0, OUTPUT_LIMIT) })
  }
}
