import { useSyncExternalStore } from 'react'

const query = '(prefers-reduced-motion: reduce)'

function subscribe(onChange: () => void) {
  const media = window.matchMedia(query)
  media.addEventListener('change', onChange)
  return () => media.removeEventListener('change', onChange)
}

const getSnapshot = () => window.matchMedia(query).matches

// Keep CSS, GSAP, canvas, timers, and Motion in sync when the device setting changes live.
export function useReducedMotion() {
  return useSyncExternalStore(subscribe, getSnapshot, () => true)
}
