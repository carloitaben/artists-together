"use client"

import { useTransition } from "react"
import { useRouter } from "next/navigation"

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
          await logout()
          router.refresh()
          emit("Logged out succesfully")
        })
      }
    >
      Logout
    </button>
  )
}
