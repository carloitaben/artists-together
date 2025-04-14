"use client"

import { useDialogContext } from "@ark-ui/react/dialog"
import { getFormProps } from "@conform-to/react"
import { useMutation } from "@tanstack/react-query"
import { usePathname, useRouter } from "next/navigation"
import Button from "~/components/Button"
import { toaster } from "~/components/Toasts"
import { logout } from "~/features/auth/actions"
import { useFormMutation } from "~/lib/mutations"
import { AuthFormSchema } from "~/lib/schemas"
import { webSocket } from "~/lib/websocket"

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
        type: "neutral",
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
