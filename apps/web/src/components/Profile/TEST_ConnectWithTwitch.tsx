"use client"

import { isRedirectError } from "next/dist/client/components/redirect"
import { usePathname } from "next/navigation"
import { useTransition } from "react"
import { twitchSSO } from "~/actions/auth"
import { useToast } from "~/components/Toast"

export default function ConnectWithTwitch() {
  const [isPending, startTransition] = useTransition()
  const pathname = usePathname()
  const emit = useToast()

  return (
    <button
      disabled={isPending}
      onClick={() =>
        startTransition(async () => {
          await twitchSSO({ pathname }).catch((error) => {
            if (isRedirectError(error)) throw error
            console.error(error)
            emit("Oops! Something went wrong…")
          })
        })
      }
    >
      Connect with twitch
    </button>
  )
}
