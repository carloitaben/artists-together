import { useEffect } from "react"

const cache = new Map<string, DOMRect>()

export function measure(key: string, selector: (key: string) => Element) {
  const cached = cache.get(key)
  if (cached) return cached

  const rect = selector(key).getBoundingClientRect()
  cache.set(key, rect)
  return rect
}

function clear() {
  return cache.clear
}

export function useMeasure() {
  useEffect(() => {
    window.addEventListener("resize", clear)
    return () => window.removeEventListener("resize", clear)
  }, [])

  return measure
}
