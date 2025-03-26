"use client"

import { Dialog } from "@ark-ui/react/dialog"
import { useSuspenseQuery } from "@tanstack/react-query"
import { cx } from "cva"
import { userQueryOptions } from "~/features/auth/shared"
import AuthRoot from "./AuthRoot"
import Login from "./Login"
import Profile from "./Profile"

export default function Auth() {
  const user = useSuspenseQuery(userQueryOptions)

  return (
    <AuthRoot>
      <Dialog.Backdrop className="backdrop z-50" />
      <Dialog.Positioner
        className={cx(
          "fixed inset-0 z-50 grid size-full place-items-center overflow-y-auto",
          "scroll-px-1 scroll-pb-4 scroll-pt-1 px-1 pb-4 pt-1 sm:scroll-p-12 sm:p-12",
        )}
      >
        {user.data ? <Profile /> : <Login />}
      </Dialog.Positioner>
    </AuthRoot>
  )
}
