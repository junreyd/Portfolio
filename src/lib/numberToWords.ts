const units = [
  'zero',
  'one',
  'two',
  'three',
  'four',
  'five',
  'six',
  'seven',
  'eight',
  'nine',
  'ten',
  'eleven',
  'twelve',
  'thirteen',
  'fourteen',
  'fifteen',
  'sixteen',
  'seventeen',
  'eighteen',
  'nineteen',
]
const tens = ['', '', 'twenty', 'thirty', 'forty', 'fifty', 'sixty', 'seventy', 'eighty', 'ninety']
const scales: [number, string][] = [
  [1_000_000_000, 'billion'],
  [1_000_000, 'million'],
  [1_000, 'thousand'],
  [100, 'hundred'],
]

export function numberToWords(value: number): string {
  if (value < 20) return units[value]
  if (value < 100) return tens[Math.floor(value / 10)] + (value % 10 ? `-${units[value % 10]}` : '')
  for (const [size, name] of scales) {
    if (value >= size)
      return `${numberToWords(Math.floor(value / size))} ${name}${value % size ? ` ${numberToWords(value % size)}` : ''}`
  }
  return String(value)
}
