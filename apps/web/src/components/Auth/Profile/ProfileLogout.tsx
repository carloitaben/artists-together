"use client"

import { Dialog } from "@ark-ui/react"
import { logout } from "~/services/auth/actions"
import { toaster } from "~/components/Toasts"
import Button from "~/components/Button"

export default function ProfileLogout() {
  return (
    <Dialog.Context>
      {(dialog) => (
        <form
          action={async () => {
            const result = await logout()

            if (result?.error) {
              return toaster.create({
                type: "error",
                title: "Oops! Something went wrong…",
              })
            }

            toaster.create({
              type: "success",
              title: "Logged out succesfully",
            })

            dialog.setOpen(false)
          }}
        >
          <Button type="submit">Log off</Button>
        </form>
      )}
    </Dialog.Context>
  )
}
