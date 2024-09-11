"use client"

import type { ReactNode, RefObject } from "react"
import {
  createContext,
  createElement,
  use,
  startTransition,
  useCallback,
  useEffect,
  useState,
  useSyncExternalStore,
  useTransition,
} from "react"
import { usePathname } from "next/navigation"
import type { ScreensConfig } from "tailwindcss/types/config"
import type { Screen } from "~/lib/tailwind"
import { screens } from "~/../tailwind.config"
import { routes } from "../routes"

export function createSafeContext<T>(displayName: string, defaultValue?: T) {
  const Context = createContext<T | null>(defaultValue || null)

  Context.displayName = displayName

  function useContext<Strict extends boolean>(options?: { strict: Strict }) {
    const value = use(Context)

    if (value === null && options?.strict) {
      throw Error(`Called "${displayName}" outside Provider`)
    }

    return value as Strict extends true ? T : T | null
  }

  function SafeProvider(props: { value: T; children?: ReactNode }) {
    return createElement(Context.Provider, props)
  }

  return [SafeProvider, useContext] as const
}

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

export function useScreen(screen: Screen) {
  return useMediaQuery(getScreenMediaQuery(screen))
}

const precached = new Set<string>()

function precacheImpl(url: string) {
  return new Promise<string>((resolve, reject) => {
    if (precached.has(url)) {
      return resolve(url)
    }

    const img = new Image()
    img.onload = () => resolve(url)
    img.onerror = reject
    img.src = url
  })
}

export function precache(urls: string[]) {
  return Promise.allSettled(urls.map(precacheImpl))
}

export function usePrecache(urls: string[]) {
  const [pending, startTransition] = useTransition()
  const [cached, setCached] = useState(() =>
    urls.every((url) => precached.has(url)),
  )

  function startCaching() {
    if (cached || pending) return

    startTransition(async () => {
      await precache(urls)
      setCached(true)
    })
  }

  return [cached, startCaching] as const
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

export function measure<T extends Element = Element>(
  target: T,
  callback: MeasureCallback,
  options?: ResizeObserverOptions,
) {
  if (!resizeObserver) {
    return () => {}
  }

  resizeObserverCallbacks.set(target, callback)
  resizeObserver.observe(target, options)

  return () => {
    resizeObserverCallbacks.delete(target)
    resizeObserver.unobserve(target)
  }
}

export function useOnMeasure<T extends Element = Element>(
  ref: RefObject<T>,
  callback: MeasureCallback,
  options?: ResizeObserverOptions,
) {
  useEffect(() => {
    if (ref.current) {
      return measure(ref.current, callback, options)
    }
  }, [callback, options, ref])
}

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

export function subscribeOnce() {
  return () => {}
}

export function useHydrated() {
  return useSyncExternalStore(
    subscribeOnce,
    () => true,
    () => false,
  )
}

export function useRoute() {
  const pathname = usePathname()
  const route = routes.find((route) =>
    route.end ? route.href === pathname : pathname.startsWith(route.href),
  )

  if (!route) {
    throw Error(`Could not match any route to pathname "${pathname}"`)
  }

  return route
}