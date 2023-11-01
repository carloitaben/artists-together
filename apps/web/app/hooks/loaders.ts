import { useRouteLoaderData } from "@remix-run/react"
import type { loader } from "~/root"

export function useRootLoaderData() {
  const data = useRouteLoaderData<typeof loader>("root")

  if (!data) {
    throw Error("Could not load root loader data")
  }

  return data
}

export function useUser() {
  return useRootLoaderData()?.user || null
}
