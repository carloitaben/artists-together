import { useCallback, useSyncExternalStore } from "react"
import { screens } from "../../tailwind.config"

type Screen = keyof typeof screens

function getScreenMediaQuery(screen: Screen) {
  const config = screens[screen]

  if (typeof config === "string") {
    return `(min-width: ${config})`
  }

  if ("min" in config && "max" in config) {
    return `(min-width: ${config.min} and max-width: ${config.max})`
  }

  if ("max" in config) {
    return `(max-width: ${config.max})`
  }

  if ("raw" in config) {
    return config.raw
  }

  throw Error(`Unhandled screen: ${screen}`)
}

function subscribe(query: string, callback: () => void) {
  const mql = window.matchMedia(query)

  mql.addEventListener("change", callback, {
    passive: true,
  })

  return () => {
    mql.removeEventListener("change", callback)
  }
}

/**
 * ```ts
 * const matches = useMediaQuery("(min-width: 640px)")
 * //    ^? boolean | null
 * ```
 */
export function useMediaQuery(query: string) {
  const subscription = useCallback(
    (callback: () => void) => subscribe(query, callback),
    [query],
  )

  return useSyncExternalStore<boolean | null>(
    subscription,
    () => window.matchMedia(query).matches,
    () => null,
  )
}

/**
 * ```ts
 * const md = useScreen("md")
 * //    ^? boolean | null
 * ```
 */
export function useScreen(screen: Screen) {
  return useMediaQuery(getScreenMediaQuery(screen))
}
