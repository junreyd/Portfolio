import { useState } from 'react'
export function useTheme() {
  const [theme, setTheme] = useState<'dark' | 'light'>(() =>
    document.documentElement.dataset.theme === 'light' ? 'light' : 'dark',
  )
  const toggleTheme = () => {
    const next = theme === 'dark' ? 'light' : 'dark'
    document.documentElement.dataset.theme = next
    document
      .querySelector('meta[name="theme-color"]')
      ?.setAttribute('content', next === 'dark' ? '#0b1018' : '#f6f8fb')
    try {
      localStorage.setItem('jd-theme', next)
    } catch {
      /* Theme still works without storage. */
    }
    setTheme(next)
  }
  return { theme, toggleTheme }
}
