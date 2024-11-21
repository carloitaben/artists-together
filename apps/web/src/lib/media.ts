import type { RefObject } from "react"
import {
  startTransition,
  useCallback,
  useEffect,
  useState,
  useSyncExternalStore,
} from "react"
import type { ScreensConfig } from "tailwindcss/types/config"
import { screens } from "~/../tailwind.config"
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
 * Subscribes to a CSS media query and returns a boolean
 * indicating whether the media query matches.
 *
 * On server-side rendering, this hook returns `null`.
 *
 * @example
 * Basic usage
 *
 * ```ts
 * const matches = useMediaQuery("(min-width: 640px)")
 * //    ^? boolean | null
 * ```
 *
 * Conditionally rendering elements with this hook
 * may cause cumulative layout shift and content flashes,
 * as media query APIs are only available client-side.
 * Prefer using the `display` CSS property when possible.
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
 * Subscribes to a screen from the Tailwind config file and returns a boolean
 * indicating whether the screen media query matches.
 *
 * On server-side rendering, this hook returns `null`.
 *
 * @example
 * Basic usage
 *
 * ```ts
 * const md = useScreen("md")
 * //    ^? boolean | null
 * ```
 *
 * Conditionally rendering elements with this hook
 * may cause cumulative layout shift and content flashes,
 * as media query APIs are only available client-side.
 * Prefer using the `display` CSS property when possible.
 */
export function useScreen(screen: Screen) {
  return useMediaQuery(getScreenMediaQuery(screen))
}

export type MeasureResult = Omit<DOMRectReadOnly, "toJSON"> & {
  measured: boolean
}

export type MeasureCallback = (rect: MeasureResult) => void

const resizeObserverCallbacks = new Map<Element, MeasureCallback>()

const resizeObserver =
  typeof window === "undefined"
    ? undefined
    : new ResizeObserver((entries) => {
        entries.forEach((entry) => {
          resizeObserverCallbacks.get(entry.target)?.(
            Object.assign(entry.contentRect, { measured: true }),
          )
        })
      })

/**
 * Measures an element using a `ResizeObserver` and executes a given callback on resize.
 * On server-side rendering, this hook does not execute.
 *
 * @example
 * Basic usage
 *
 * ```tsx
 * const ref = useRef<ComponentRef<"div">>(null)
 *
 * useOnMeasure(ref, (rect) => {
 *   //               ^? MeasureResult | null
 * })
 *
 * return <div ref={ref} />
 * ```
 *
 * @example
 * Measuring browser-only globals
 *
 * For measuring browser-only globals like `document.documentElement`,
 * you can conditionally set the ref value to prevent server-side rendering errors.
 *
 * ```ts
 * const ref = useRef(
 *  typeof document === "undefined" ? null : document.documentElement
 * )
 *
 * useOnMeasure(ref, (rect) => {
 *   //               ^? MeasureResult | null
 * })
 * ```
 */
export function useOnMeasure<T extends Element = Element>(
  ref: RefObject<T>,
  callback: MeasureCallback,
  options?: ResizeObserverOptions,
) {
  useEffect(() => {
    const target = ref.current

    if (!target) return
    if (!resizeObserver) return

    resizeObserverCallbacks.set(target, callback)
    resizeObserver.observe(target, options)

    return () => {
      resizeObserverCallbacks.delete(target)
      resizeObserver.unobserve(target)
    }
  }, [callback, options, ref])
}

/**
 * Measures an element using a `ResizeObserver` and returns the latest `MeasureResult`.
 * On server-side rendering, the measured values are all `0`.
 *
 * @example
 * Basic usage
 *
 * ```tsx
 * const ref = useRef<ComponentRef<"div">>(null)
 * const refRect = useMeasure(ref)
 * //    ^? MeasureResult
 *
 * return <div ref={ref} />
 * ```
 *
 * @example
 * Measuring browser-only globals
 *
 * For measuring browser-only globals like `document.documentElement`,
 * you can conditionally set the ref value to prevent server-side rendering errors.
 *
 * ```ts
 * const ref = useRef(
 *   typeof document === "undefined" ? null : document.documentElement
 * )
 *
 * const refRect = useMeasure(ref)
 * //    ^? MeasureResult | null
 * ```
 */
export function useMeasure<T extends Element = Element>(
  ref: RefObject<T>,
  options?: ResizeObserverOptions,
) {
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

  useOnMeasure(ref, callback, options)

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
