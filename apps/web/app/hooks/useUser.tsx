import { useLoaderData } from "@remix-run/react"

import type { Loader } from "~/root"

export default function useUser() {
  const { user } = useLoaderData<Loader>()
  return user
}
