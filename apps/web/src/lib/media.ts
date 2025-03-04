import { noop } from "@artists-together/core/utils"
import type { RefObject } from "react"
import {
  useCallback,
  useEffect,
  useState,
  useSyncExternalStore,
  useTransition,
} from "react"
import type { ScreensConfig } from "tailwindcss/types/config"
import { screens } from "~/tailwind.config"
import type { Screen } from "./tailwind"

function getScreenMediaQuery(screen: Screen) {
  const config = screens[screen] as string | ScreensConfig

  if (typeof config === "string") {
    return `(min-width: ${config})`
  }

  if ("min" in config && "max" in config) {
    return `(min-width: ${config.min} and max-width: ${config.max})`
  }

  if ("max" in config) {
    return `(max-width: ${config.max})`
  }

  if ("raw" in config && typeof config.raw === "string") {
    return config.raw
  }

  throw Error(`Unhandled screen: ${screen}`)
}

export function useMediaQuery(query: string) {
  const subscription = useCallback(
    (callback: VoidFunction) => {
      const mediaQueryList = matchMedia(query)

      mediaQueryList.addEventListener("change", callback, {
        passive: true,
      })

      return () => mediaQueryList.removeEventListener("change", callback)
    },
    [query],
  )

  return useSyncExternalStore<boolean | null>(
    subscription,
    () => window.matchMedia(query).matches,
    () => null,
  )
}

export function useScreen(screen: Screen) {
  return useMediaQuery(getScreenMediaQuery(screen))
}

export type MeasureCallback = (rect: DOMRect) => void

const resizeObserverCallbacks = new Map<Element, Set<MeasureCallback>>()

export const resizeObserver =
  typeof window === "undefined"
    ? undefined
    : new ResizeObserver((entries) => {
        entries.forEach((entry) => {
          resizeObserverCallbacks.get(entry.target)?.forEach((callback) => {
            callback(entry.contentRect)
          })
        })
      })

export function onMeasure<T extends Element = Element>(
  elementOrRef: RefObject<T | null> | T | null,
  callback: MeasureCallback,
  options?: ResizeObserverOptions,
) {
  const target =
    elementOrRef && "current" in elementOrRef
      ? elementOrRef.current
      : elementOrRef

  if (!target) return noop
  if (!resizeObserver) return noop

  const set = resizeObserverCallbacks.get(target) || new Set()
  resizeObserverCallbacks.set(target, set.add(callback))
  resizeObserver.observe(target, options)
  return () => {
    resizeObserverCallbacks.get(target)?.delete(callback)
    resizeObserver.unobserve(target)
  }
}

export function useMeasure<T extends Element = Element>(
  elementOrRef: RefObject<T | null> | T | null,
  options?: ResizeObserverOptions,
) {
  const [, startTransition] = useTransition()
  const [entry, setEntry] = useState<DOMRect>()

  const callback = useCallback<MeasureCallback>((entry) => {
    startTransition(() => setEntry(entry))
  }, [])

  useEffect(() => {
    return onMeasure(elementOrRef, callback, options)
  }, [elementOrRef, callback, options])

  return entry
}

export function useWindowFocus() {
  return useSyncExternalStore(
    (notify) => {
      document.documentElement.addEventListener("blur", notify)
      return () => document.documentElement.removeEventListener("blur", notify)
    },
    () => document.hasFocus(),
  )
}

const preloadMap = new Map<string, string | Promise<string>>()

function preloadSource(source: string) {
  const current = preloadMap.get(source)

  if (current instanceof Promise) {
    return current
  }

  const promise = new Promise<string>((resolve, reject) => {
    const image = new Image()
    image.onload = () => {
      resolve(source)
      preloadMap.set(source, source)
    }
    image.onerror = reject
    image.src = source
  })

  preloadMap.set(source, promise)
  return promise
}

export function preloadSources(sources: string[]) {
  return Promise.allSettled(sources.map(preloadSource))
}

export function usePreloadImages(sources: string[]) {
  const [pending, startTransition] = useTransition()
  const [cached, setCached] = useState(() =>
    sources.every(
      (source) =>
        preloadMap.has(source) && !(preloadMap.get(source) instanceof Promise),
    ),
  )

  function startCaching() {
    if (cached || pending) return

    startTransition(async () => {
      await preloadSources(sources)
      setCached(true)
    })
  }

  return [cached, startCaching] as const
}
