import type { CodeLanguage } from '../types/playground'

export const EDITOR_LINES = 12
export const EDITOR_COLUMNS = 42
export const EDITOR_CHARACTERS = EDITOR_LINES * EDITOR_COLUMNS + EDITOR_LINES - 1
export const EXECUTION_TIMEOUT = 5000
export const RUNTIME_LOAD_TIMEOUT = 60000
export const OUTPUT_LIMIT = 2000

export const languages: { id: CodeLanguage; label: string; starter: string }[] = [
  {
    id: 'javascript',
    label: 'JavaScript',
    starter: `const tasks = [
  "plan", "build", "improve"
];
const result = tasks.map(task =>
  task.toUpperCase()
);

console.log(result.join(" → "));
console.log("Make work simpler.");`,
  },
  {
    id: 'typescript',
    label: 'TypeScript',
    starter: `const work: string[] = [
  "Connect", "Automate", "Improve"
];

const message: string = work.join(" → ");
console.log(message);`,
  },
  {
    id: 'python',
    label: 'Python',
    starter: `tasks = ["plan", "build", "improve"]
result = [task.upper() for task in tasks]

print(" → ".join(result))
print("Make work simpler.")`,
  },
  {
    id: 'sql',
    label: 'SQL',
    starter: `SELECT 'Make work simpler.' AS impact;

SELECT 'Connect' AS step
UNION ALL SELECT 'Automate'
UNION ALL SELECT 'Improve';`,
  },
]

export function validateCode(code: string): string {
  const lines = code.split('\n')
  if (lines.length > EDITOR_LINES) return `Keep your code within ${EDITOR_LINES} lines.`
  if (lines.some((line) => line.length > EDITOR_COLUMNS))
    return `Use at most ${EDITOR_COLUMNS} characters per line.`
  if (code.length > EDITOR_CHARACTERS) return `Use at most ${EDITOR_CHARACTERS} characters.`
  return ''
}
