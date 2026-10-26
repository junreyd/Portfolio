export type CodeLanguage = 'javascript' | 'typescript' | 'python' | 'sql'
export type RunStatus = 'idle' | 'loading' | 'running' | 'success' | 'error'
export interface RunResult {
  status: RunStatus
  output: string
}
export interface PlaygroundPresentation {
  status: 'writing' | 'running' | 'success' | 'error' | 'ready'
  text: string
  runId: number
}
export interface WorkerRequest {
  language: CodeLanguage
  code: string
  runtimeBase: string
}
export interface WorkerResponse {
  type: 'ready' | 'result' | 'error'
  output?: string
}
