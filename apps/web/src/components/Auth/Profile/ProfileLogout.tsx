"use client"

import { useMutation } from "@tanstack/react-query"
import { useDialogContext } from "@ark-ui/react/dialog"
import { getFormProps } from "@conform-to/react"
import { usePathname, useRouter } from "next/navigation"
import { useFormMutation } from "~/lib/mutations"
import { logout } from "~/features/auth/actions"
import { webSocket } from "~/lib/websocket"
import { AuthFormSchema } from "~/lib/schemas"
import { toaster } from "~/components/Toasts"
import Button from "~/components/Button"

export default function ProfileLogout() {
  const pathname = usePathname()
  const router = useRouter()
  const dialog = useDialogContext()

  const mutation = useMutation({
    async mutationFn(formData: FormData) {
      return logout(formData)
    },
    onMutate() {
      dialog.setOpen(false)
    },
    onSuccess() {
      webSocket.reconnect()
      router.refresh()
      toaster.create({
        type: "success",
        title: "Logged out succesfully",
      })
    },
  })

  const [form, fields] = useFormMutation({
    mutation,
    schema: AuthFormSchema,
  })

  return (
    <form {...getFormProps(form)}>
      <Button type="submit" name={fields.pathname.name} value={pathname}>
        Log off
      </Button>
    </form>
  )
}
