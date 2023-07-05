import { useEffect, useState } from "react"

import { tailwind, Screen } from "~/lib/tailwind"

export function useOnMatchMedia(
  query: string,
  callback: (matches: boolean) => void
) {
  useEffect(() => {
    const mediaQuery = window.matchMedia(query)

    function onChange(event: MediaQueryListEvent) {
      callback(event.matches)
    }

    callback(mediaQuery.matches)

    if ("addEventListener" in mediaQuery) {
      mediaQuery.addEventListener("change", onChange)
      return () => mediaQuery.removeEventListener("change", onChange)
    } else {
      // @ts-expect-error this is deprecated but surely exists
      mediaQuery.addListener(onChange)
      // @ts-expect-error this is deprecated but surely exists
      return () => mediaQuery.removeListener(onChange)
    }
  }, [query, callback])
}

export function useOnMatchScreen(
  screen: Screen,
  callback: (matches: boolean) => void
) {
  return useOnMatchMedia(
    `(min-width: ${tailwind.theme.screens[screen]})`,
    callback
  )
}

export function useMatchesMedia(query: string) {
  const [matches, setMatches] = useState<boolean>()
  useOnMatchMedia(query, setMatches)
  return matches
}

export function useMatchesScreen(screen: Screen) {
  return useMatchesMedia(`(min-width: ${tailwind.theme.screens[screen]})`)
}
