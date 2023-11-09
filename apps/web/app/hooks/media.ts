import type { RefObject } from "react"
import { useEffect, useCallback, useSyncExternalStore, useRef } from "react"
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

function subscribe(query: string, callback: VoidFunction) {
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
    (callback: VoidFunction) => subscribe(query, callback),
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

type ResizeCallback = (entry: ResizeObserverEntry) => void

const subscriptions = new Map<Element, Set<ResizeCallback>>()

let observer: ResizeObserver | undefined

function getObserver() {
  if (!observer) {
    observer = new ResizeObserver((entries) => {
      entries.forEach((entry) => {
        subscriptions.get(entry.target)?.forEach((callback) => {
          callback(entry)
        })
      })
    })
  }

  return observer
}

export function useMeasure<T extends Element = Element>(
  ref: RefObject<T>,
  callback?: ResizeCallback,
): RefObject<ResizeObserverEntry | undefined>

export function useMeasure<T extends Element = Element>(
  get: () => T,
  callback?: ResizeCallback,
): RefObject<ResizeObserverEntry | undefined>

export function useMeasure<T extends Element = Element>(
  selector: RefObject<T> | (() => T),
  callback?: ResizeCallback,
) {
  const last = useRef<ResizeObserverEntry>()

  const bla = useCallback(
    (entry: ResizeObserverEntry) => {
      last.current = entry
      callback?.(entry)
    },
    [callback],
  )

  useEffect(() => {
    const element =
      typeof selector === "function" ? selector() : selector.current

    if (!element) return

    const observer = getObserver()
    const callbacks = subscriptions.get(element)

    if (callbacks?.size) {
      subscriptions.set(element, callbacks.add(bla))
    } else {
      subscriptions.set(element, new Set([bla]))
      observer.observe(element)
    }

    return () => {
      if (!element) return
      const callbacks = subscriptions.get(element)
      callbacks?.delete(bla)
      if (!callbacks?.size) observer.unobserve(element)
    }
  }, [bla, callback, selector])

  return last
}
