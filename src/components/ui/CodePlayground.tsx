import { useEffect, useRef, useState } from 'react'
import { Code2, PencilLine, Play, RotateCcw } from 'lucide-react'
import { codeStories } from '../../data/workflowVisual'
import {
  EDITOR_CHARACTERS,
  EDITOR_COLUMNS,
  EDITOR_LINES,
  languages,
  validateCode,
} from '../../data/playground'
import { useCodeTypewriter } from '../../hooks/useCodeTypewriter'
import { useCodeRunner } from '../../hooks/useCodeRunner'
import { highlightCodeLine } from '../../lib/highlightCode'
import type { CodeLanguage, RunResult, PlaygroundPresentation } from '../../types/playground'

const codes = codeStories.map((story) => story.code)
const highlightedStories = codes.map((code) => {
  let offset = 0
  return code.split('\n').map((line) => {
    const result = { tokens: highlightCodeLine(line), offset }
    offset += line.length + 1
    return result
  })
})

export function CodePlayground({
  running,
  reduced,
  onPresentation,
}: {
  running: boolean
  reduced: boolean
  onPresentation: (value: PlaygroundPresentation) => void
}) {
  const [editing, setEditing] = useState(false)
  const [language, setLanguage] = useState<CodeLanguage>('javascript')
  const [drafts, setDrafts] = useState(
    () =>
      Object.fromEntries(languages.map((item) => [item.id, item.starter])) as Record<
        CodeLanguage,
        string
      >,
  )
  const [inputError, setInputError] = useState('')
  const [automaticResult, setAutomaticResult] = useState<{
    story: number
    value: RunResult
  } | null>(null)
  const runSequence = useRef(0)
  const textareaRef = useRef<HTMLTextAreaElement>(null)
  const { result, run, reset } = useCodeRunner()
  const { story, characters, phase } = useCodeTypewriter(
    codes,
    running && !editing,
    reduced,
    automaticResult && automaticResult.value.status !== 'idle' ? automaticResult.story : null,
  )
  const code = drafts[language]
  const lines = highlightedStories[story]
  const activeLine = codes[story].slice(0, characters).split('\n').length - 1
  const busy = result.status === 'loading' || result.status === 'running'
  const automaticReady = !editing && (reduced || phase === 'executing' || phase === 'holding')

  useEffect(() => {
    if (!automaticReady) return
    runSequence.current += 1
    let current = true
    void run('javascript', codes[story]).then((value) => {
      if (current && value.status !== 'idle') setAutomaticResult({ story, value })
    })
    return () => {
      current = false
    }
  }, [automaticReady, run, story])

  const startEditing = () => {
    reset()
    setEditing(true)
    setInputError('')
    requestAnimationFrame(() => textareaRef.current?.focus())
  }
  const returnToAutoplay = () => {
    reset()
    setAutomaticResult(null)
    setEditing(false)
    setInputError('')
  }
  const updateCode = (next: string) => {
    const normalized = next.replace(/\r\n?/g, '\n')
    const error = validateCode(normalized)
    setInputError(error)
    if (error) return
    reset()
    setDrafts((current) => ({ ...current, [language]: normalized }))
  }
  const execute = () => {
    if (inputError) return
    setInputError('')
    runSequence.current += 1
    void run(language, code)
  }
  const changeLanguage = (next: CodeLanguage) => {
    reset()
    setLanguage(next)
    setInputError('')
  }

  const completed = automaticResult?.story === story ? automaticResult.value : null
  const showAutomaticOutput = phase === 'holding' || reduced
  const output = editing
    ? inputError ||
      (result.status === 'idle' ? 'Your turn. Run your code to see the result.' : result.output)
    : showAutomaticOutput && completed
      ? completed.output
      : phase === 'executing'
        ? ''
        : 'A better workday starts with an idea.'

  useEffect(() => {
    const successful = editing
      ? !inputError && result.status === 'success'
      : showAutomaticOutput && completed?.status === 'success'
    const failed = editing ? result.status === 'error' : completed?.status === 'error'
    const waiting = editing ? busy : phase === 'executing' || (reduced && !completed)
    const outputLines = output.split('\n')
    const firstLine =
      (editing && language === 'sql' && outputLines.length > 1 ? outputLines.slice(1) : outputLines)
        .find((line) => line.trim())
        ?.trim() || ''
    const text = successful
      ? firstLine.length <= 76
        ? firstLine
        : 'Your code. Real results.'
      : failed
        ? 'Every idea starts with a first draft.'
        : waiting
          ? ''
          : editing
            ? 'Your ideas. Your next solution.'
            : 'Built to make work simpler.'
    onPresentation({
      runId: runSequence.current,
      status: successful
        ? 'success'
        : failed
          ? 'error'
          : waiting
            ? 'running'
            : editing
              ? 'ready'
              : 'writing',
      text,
    })
  }, [
    busy,
    completed,
    editing,
    inputError,
    language,
    onPresentation,
    output,
    phase,
    reduced,
    result.status,
    showAutomaticOutput,
  ])

  return (
    <div className="editor-frame">
      <div className="code-window interactive-editor">
        <div className="window-bar">
          <div className="window-dots" aria-hidden="true">
            <i />
            <i />
            <i />
          </div>
          {editing ? (
            <div className="editor-controls">
              <label className="sr-only" htmlFor="code-language">
                Programming language
              </label>
              <select
                id="code-language"
                value={language}
                onChange={(event) => changeLanguage(event.target.value as CodeLanguage)}
              >
                {languages.map((item) => (
                  <option value={item.id} key={item.id}>
                    {item.label}
                  </option>
                ))}
              </select>
              <button
                className="editor-auto-button"
                onClick={returnToAutoplay}
                title="Return to autoplay"
                aria-label="Return to autoplay"
              >
                <RotateCcw size={13} />
              </button>
              <button
                className="editor-run-button"
                aria-busy={busy}
                disabled={busy || !code.trim() || Boolean(inputError)}
                onClick={execute}
              >
                <Play size={12} aria-hidden="true" />
                {result.status === 'loading'
                  ? 'Loading…'
                  : result.status === 'running'
                    ? 'Running…'
                    : 'Run'}
              </button>
            </div>
          ) : (
            <span className="editor-auto-label">
              <Code2 size={13} aria-hidden="true" />
              AUTOPLAY / {String(story + 1).padStart(2, '0')} OF 05
            </span>
          )}
        </div>
        <div className="editor-invitation-row">
          <button className="playground-invitation" onClick={startEditing}>
            <PencilLine size={14} aria-hidden="true" />
            Write your code with me
          </button>
        </div>
        <div className="code-content" aria-hidden={!editing}>
          {editing ? (
            <div className="editor-input-area">
              <div className="editor-line-numbers" aria-hidden="true">
                {Array.from({ length: EDITOR_LINES }, (_, index) => (
                  <span key={index}>{String(index + 1).padStart(2, '0')}</span>
                ))}
              </div>
              <textarea
                ref={textareaRef}
                value={code}
                onChange={(event) => updateCode(event.target.value)}
                onKeyDown={(event) => {
                  if ((event.ctrlKey || event.metaKey) && event.key === 'Enter') {
                    event.preventDefault()
                    if (!busy) execute()
                  }
                }}
                aria-label="Write your code with me"
                aria-describedby={`editor-limits${inputError || result.status === 'error' ? ' editor-error' : ''}`}
                aria-invalid={Boolean(inputError)}
                maxLength={EDITOR_CHARACTERS}
                spellCheck={false}
                autoCapitalize="off"
                autoCorrect="off"
                wrap="off"
              />
            </div>
          ) : (
            Array.from({ length: EDITOR_LINES }, (_, index) => {
              const line = lines[index]
              const visible = line ? Math.max(0, characters - line.offset) : 0
              return (
                <div className="code-line" key={index}>
                  <span className="line-number">{String(index + 1).padStart(2, '0')}</span>
                  <span className="code-line-text">
                    {line?.tokens.map((token) => (
                      <span key={token.start} className={token.className}>
                        {token.text.slice(0, Math.max(0, visible - token.start))}
                      </span>
                    ))}
                    {index === activeLine && !reduced && (
                      <span
                        className={`code-cursor ${phase === 'typing' ? 'cursor-typing' : ''}`}
                      />
                    )}
                  </span>
                </div>
              )
            })
          )}
        </div>
        <div className="editor-limits" id="editor-limits">
          {editing
            ? `${code.split('\n').length}/${EDITOR_LINES} lines · ${EDITOR_COLUMNS} characters per line · Ctrl/⌘ + Enter to run`
            : 'IDEAS → CODE → IMPACT'}
        </div>
      </div>
      {editing && (inputError || result.status === 'error') && (
        <p className="compiled-error" id="editor-error" role="alert">
          Compiled Error
        </p>
      )}
      {editing && (
        <span className="sr-only" role="status" aria-atomic="true">
          {inputError ? inputError : result.status === 'error' ? 'Compiled Error' : result.output}
        </span>
      )}
      <span className="visual-caption">CONNECTING TECHNOLOGY & EVERYDAY WORK</span>
    </div>
  )
}
