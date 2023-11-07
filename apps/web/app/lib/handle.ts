import { useLocation, useMatches } from "@remix-run/react"

export type PageData = {}

export function usePageHandle<T>() {
  const location = useLocation()
  const matches = useMatches()

  const match = matches.find(
    (match) => match.pathname === location.pathname && match.handle,
  )

  if (!match) {
    throw Error(`Missing page in route handle: ${location.pathname}`)
  }

  return match.handle as T
}
