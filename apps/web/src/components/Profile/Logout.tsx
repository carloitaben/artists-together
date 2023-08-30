"use client"

import { useTransition } from "react"
import { useRouter } from "next/navigation"

import { unreachable } from "~/lib/utils"
import { logout } from "~/actions/auth"
import { useToast } from "~/components/Toast"

export default function Logout() {
  const [isPending, startTransition] = useTransition()
  const router = useRouter()
  const emit = useToast()

  return (
    <button
      disabled={isPending}
      onClick={() =>
        startTransition(async () => {
          const result = await logout()

          if (!result || !("error" in result)) {
            router.refresh()
            return emit("Logged out succesfully")
          }

          switch (result.error.name) {
            case "VALIDATION_ERROR":
              return emit("Oops! Something went wrong…")
            case "SERVER_ERROR":
              switch (result.error.cause) {
                case "UNAUTHORIZED":
                  return emit("Oops! You cannot do that")
                default:
                  return unreachable(result.error)
              }
          }
        })
      }
    >
      Logout
    </button>
  )
}
