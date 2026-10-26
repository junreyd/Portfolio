interface CodeToken {
  text: string
  start: number
  className?: string
}

// Only highlight the small, trusted illustration snippets; this is not a code editor.
export function highlightCodeLine(line: string): CodeToken[] {
  const pattern =
    /("[^"\n]*"|'[^'\n]*')|\b(const|let|async|await|for|of|if|return|function)\b|\b(true|false|null)\b|([A-Za-z_$][\w$]*)(?=\()/g
  const tokens: CodeToken[] = []
  let position = 0
  for (const match of line.matchAll(pattern)) {
    const start = match.index
    if (start > position) tokens.push({ text: line.slice(position, start), start: position })
    tokens.push({
      text: match[0],
      start,
      className: match[1]
        ? 'code-green'
        : match[2]
          ? 'code-purple'
          : match[3]
            ? 'code-gold'
            : 'code-blue',
    })
    position = start + match[0].length
  }
  if (position < line.length) tokens.push({ text: line.slice(position), start: position })
  return tokens
}
