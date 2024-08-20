"use client"

import { Dialog } from "@ark-ui/react"
import { logout } from "~/services/auth/actions"
import { emit } from "~/components/Toast"
import Button from "~/components/Button"

export default function ProfileLogout() {
  return (
    <Dialog.Context>
      {(dialog) => (
        <form
          action={async () => {
            const result = await logout()

            if (result?.error) {
              return emit({
                type: "error",
                title: "Oops! Something went wrong…",
              })
            }

            dialog.setOpen(false)

            emit({
              type: "success",
              title: "Logged out succesfully",
            })
          }}
        >
          <Button type="submit">Log off</Button>
        </form>
      )}
    </Dialog.Context>
  )
}
