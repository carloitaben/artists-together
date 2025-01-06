import type { RefObject } from "react"
import {
  startTransition,
  useCallback,
  useEffect,
  useState,
  useSyncExternalStore,
  useTransition,
} from "react"
import type { ScreensConfig } from "tailwindcss/types/config"
import { screens } from "~/../tailwind.config"
import type { Screen } from "./tailwind"
import { noop } from "@artists-together/core/utils"

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

export type MeasureResult = Omit<DOMRectReadOnly, "toJSON"> & {
  measured: boolean
}

export type MeasureCallback = (rect: MeasureResult) => void

const resizeObserverCallbacks = new Map<Element, Set<MeasureCallback>>()

export const resizeObserver =
  typeof window === "undefined"
    ? undefined
    : new ResizeObserver((entries) => {
        entries.forEach((entry) => {
          const rect: MeasureResult = {
            ...entry.contentRect,
            measured: true,
          }

          resizeObserverCallbacks.get(entry.target)?.forEach((callback) => {
            callback(rect)
          })
        })
      })

export function onMeasure<T extends Element = Element>(
  elementOrRef: RefObject<T> | T | null,
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
  elementOrRef: RefObject<T> | T | null,
  options?: ResizeObserverOptions,
) {
  const [_, startTransition] = useTransition()
  const [entry, setEntry] = useState<MeasureResult>({
    bottom: 0,
    height: 0,
    left: 0,
    right: 0,
    top: 0,
    width: 0,
    x: 0,
    y: 0,
    measured: false,
  })

  const callback = useCallback<MeasureCallback>((entry) => {
    startTransition(() => setEntry(entry))
  }, [])

  useEffect(() => {
    return onMeasure(elementOrRef, callback, options)
  }, [elementOrRef, callback, options])

  return entry
}

export type WindowDimensions = {
  innerWidth: number
  outerWidth: number
  innerHeight: number
  outerHeight: number
  measured: boolean
}

/**
 * Measures the `window` object.
 * On server-side rendering, the measured values are all `0`.
 *
 * @example
 * Basic usage
 *
 * ```ts
 * const dimensions = useWindowDimensions()
 * //    ^? WindowDimensions | null
 * ```
 */
export function useWindowDimensions() {
  const [dimensions, setDimensions] = useState<WindowDimensions>({
    innerWidth: 0,
    outerWidth: 0,
    innerHeight: 0,
    outerHeight: 0,
    measured: false,
  })

  useEffect(() => {
    function callback() {
      startTransition(() => {
        setDimensions({
          innerWidth: window.innerWidth,
          outerWidth: window.outerWidth,
          innerHeight: window.innerHeight,
          outerHeight: window.outerHeight,
          measured: true,
        })
      })
    }

    callback()
    window.addEventListener("resize", callback)
    return () => window.removeEventListener("resize", callback)
  }, [])

  return dimensions
}
