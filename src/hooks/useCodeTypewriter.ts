import { useEffect, useState } from 'react'

type Phase = 'starting' | 'typing' | 'executing' | 'holding' | 'deleting'
interface Progress {
  story: number
  characters: number
  phase: Phase
}

export function useCodeTypewriter(
  codes: readonly string[],
  running: boolean,
  staticMode: boolean,
  completedStory: number | null,
) {
  const [progress, setProgress] = useState<Progress>(() => ({
    story: 0,
    // The first ten lines are already present; finish the example from line eleven.
    characters: codes[0].split('\n').slice(0, 10).join('\n').length + 1,
    phase: 'typing',
  }))

  useEffect(() => {
    if (
      !running ||
      staticMode ||
      (progress.phase === 'executing' && completedStory !== progress.story)
    )
      return

    const code = codes[progress.story]
    const nextCharacter = code[progress.characters]
    const delay =
      progress.phase === 'starting'
        ? 650
        : progress.phase === 'holding'
          ? 6000
          : progress.phase === 'executing'
            ? 120
            : progress.phase === 'deleting'
              ? 16
              : nextCharacter === '\n'
                ? 160
                : /[;{},]/.test(nextCharacter ?? '')
                  ? 65
                  : 24 + (progress.characters % 4) * 5

    const timer = window.setTimeout(() => {
      setProgress((current) => {
        if (current.phase === 'starting') return { ...current, phase: 'typing' }
        if (current.phase === 'executing') return { ...current, phase: 'holding' }
        if (current.phase === 'holding') return { ...current, phase: 'deleting' }
        if (current.phase === 'deleting') {
          const characters = Math.max(0, current.characters - 4)
          return characters === 0
            ? { story: (current.story + 1) % codes.length, characters: 0, phase: 'starting' }
            : { ...current, characters }
        }
        const characters = Math.min(code.length, current.characters + 1)
        return {
          ...current,
          characters,
          phase: characters === code.length ? 'executing' : 'typing',
        }
      })
    }, delay)

    return () => window.clearTimeout(timer)
  }, [codes, progress, running, staticMode, completedStory])

  return {
    story: progress.story,
    characters: staticMode ? codes[progress.story].length : progress.characters,
    phase: staticMode ? 'holding' : progress.phase,
  }
}
