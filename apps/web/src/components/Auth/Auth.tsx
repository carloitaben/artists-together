"use client"

import { Dialog } from "@ark-ui/react/dialog"
import { useSuspenseQuery } from "@tanstack/react-query"
import { cx } from "cva"
import { useSearchParams } from "next/navigation"
import { userQueryOptions } from "~/features/auth/shared"
import Login from "./Login"
import Profile from "./Profile"

export default function Auth() {
  const user = useSuspenseQuery(userQueryOptions)
  const search = useSearchParams()
  const open = search.get("modal") === "auth"

  return (
    <Dialog.Root
      open={open}
      onOpenChange={(details) => {
        if (!details.open) {
          const url = new URL(window.location.href)
          url.searchParams.delete("modal")
          window.history.replaceState(null, "", url)
        }
      }}
    >
      <Dialog.Backdrop className="backdrop z-50" />
      <Dialog.Positioner
        className={cx(
          "fixed inset-0 z-50 grid size-full place-items-center overflow-y-auto",
          "scroll-px-1 scroll-pb-4 scroll-pt-1 pb-4 pe-scrollbar ps-1 pt-1 sm:scroll-p-12 sm:py-12 sm:pe-scrollbar sm:ps-12",
        )}
      >
        {user.data ? <Profile /> : <Login />}
      </Dialog.Positioner>
    </Dialog.Root>
  )
}
