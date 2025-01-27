import type { PropsWithChildren } from "react"
import { unstable_postpone } from "react"

declare module "react" {
  export function unstable_postpone(reason?: string): never
}

export function clientOnly() {
  if (typeof window === "undefined") {
    unstable_postpone("Client only")
  }
}

export default function ClientOnly({ children }: PropsWithChildren) {
  clientOnly()

  return children
}
