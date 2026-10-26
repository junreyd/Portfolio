import { test } from 'node:test'
import assert from 'node:assert/strict'
import vm from 'node:vm'
import { codeStories } from '../src/data/workflowVisual.ts'
import {
  EDITOR_LINES,
  EDITOR_COLUMNS,
  EDITOR_CHARACTERS,
  languages,
  validateCode,
} from '../src/data/playground.ts'

test('all five automatic examples execute and produce their intended business output', () => {
  assert.equal(codeStories.length, 5)
  for (const story of codeStories) {
    assert.equal(validateCode(story.code), '', story.result)
    const output: string[] = []
    vm.runInNewContext(
      story.code,
      { console: { log: (value: unknown) => output.push(String(value)) } },
      { timeout: 1000 },
    )
    assert.equal(output.join('\n'), story.result)
  }
})
test('every language starter fits the actual fixed editor', () => {
  assert.deepEqual(
    languages.map((item) => item.id),
    ['javascript', 'typescript', 'python', 'sql'],
  )
  for (const language of languages) assert.equal(validateCode(language.starter), '', language.id)
})
test('line, column, and total character boundaries reject oversized edits', () => {
  const exact = Array(EDITOR_LINES).fill('x'.repeat(EDITOR_COLUMNS)).join('\n')
  assert.equal(exact.length, EDITOR_CHARACTERS)
  assert.equal(validateCode(exact), '')
  assert.match(validateCode(exact + '\n'), /lines/)
  assert.match(validateCode('x'.repeat(EDITOR_COLUMNS + 1)), /characters per line/)
})
