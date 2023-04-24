import { useLoaderData } from "@remix-run/react"
import type { Loader } from "~/root"

export default function useSession() {
  const { session } = useLoaderData<Loader>()
  return session
}
