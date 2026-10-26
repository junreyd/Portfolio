import { useCallback, useEffect, useRef, useState } from 'react'
import RunnerWorker from '../workers/codeRunner.worker?worker'
import type { CodeLanguage, RunResult, WorkerResponse } from '../types/playground'
import { EXECUTION_TIMEOUT, RUNTIME_LOAD_TIMEOUT, validateCode } from '../data/playground'

export function useCodeRunner() {
  const [result, setResult] = useState<RunResult>({ status: 'idle', output: '' })
  const workerRef = useRef<Worker | null>(null)
  const timerRef = useRef<number | undefined>(undefined)
  const finishRef = useRef<((result: RunResult) => void) | null>(null)

  const cancel = useCallback(() => {
    window.clearTimeout(timerRef.current)
    workerRef.current?.terminate()
    workerRef.current = null
    finishRef.current?.({ status: 'idle', output: '' })
    finishRef.current = null
  }, [])
  useEffect(() => cancel, [cancel])

  const run = useCallback(
    (language: CodeLanguage, code: string): Promise<RunResult> => {
      cancel()
      const validation = validateCode(code)
      if (validation || !code.trim()) {
        const failed: RunResult = {
          status: 'error',
          output: validation || 'Write a little code first.',
        }
        setResult(failed)
        return Promise.resolve(failed)
      }
      return new Promise((resolve) => {
        let worker: Worker
        try {
          worker = new RunnerWorker()
        } catch {
          const failed: RunResult = {
            status: 'error',
            output: 'The code runner could not start in this browser.',
          }
          setResult(failed)
          resolve(failed)
          return
        }
        workerRef.current = worker
        finishRef.current = resolve
        const finish = (next: RunResult) => {
          if (workerRef.current !== worker) return
          finishRef.current = null
          cancel()
          setResult(next)
          resolve(next)
        }
        const scheduleTimeout = (milliseconds: number, output: string) => {
          window.clearTimeout(timerRef.current)
          timerRef.current = window.setTimeout(
            () => finish({ status: 'error', output }),
            milliseconds,
          )
        }
        setResult({
          status: 'loading',
          output: language === 'python' ? 'Loading Python…' : 'Preparing your code…',
        })
        scheduleTimeout(
          RUNTIME_LOAD_TIMEOUT,
          'The runtime took too long to load. Please try again.',
        )
        worker.onmessage = (event: MessageEvent<WorkerResponse>) => {
          if (event.data.type === 'ready') {
            setResult({ status: 'running', output: 'Running your code…' })
            scheduleTimeout(
              EXECUTION_TIMEOUT,
              'Execution stopped after 5 seconds. Check for an infinite loop.',
            )
          } else
            finish({
              status: event.data.type === 'result' ? 'success' : 'error',
              output: String(event.data.output ?? ''),
            })
        }
        worker.onerror = (event) => {
          event.preventDefault()
          finish({
            status: 'error',
            output: 'The runtime could not load or run this code. Please try again.',
          })
        }
        worker.postMessage({
          language,
          code,
          runtimeBase: new URL(import.meta.env.BASE_URL, window.location.href).href,
        })
      })
    },
    [cancel],
  )
  const reset = useCallback(() => {
    cancel()
    setResult({ status: 'idle', output: '' })
  }, [cancel])
  return { result, run, reset }
}
