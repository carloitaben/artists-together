"use client"

import { useDialogContext } from "@ark-ui/react/dialog"
import { useForm } from "@conform-to/react"
import { parseWithValibot } from "conform-to-valibot"
import { usePathname, useRouter } from "next/navigation"
import { startTransition, useActionState, useEffect } from "react"
import { logout } from "~/lib/actions"
import { useHydrated } from "~/lib/react"
import { useFormToastError } from "~/lib/forms"
import { AuthFormSchema } from "~/lib/schemas"
import { toaster } from "~/components/Toasts"
import Button from "~/components/Button"

export default function ProfileLogout() {
  const [lastResult, action, isPending] = useActionState(logout, null)
  const hydrated = useHydrated()
  const pathname = usePathname()
  const router = useRouter()
  const dialog = useDialogContext()

  useFormToastError(lastResult)

  useEffect(() => {
    if (lastResult?.status === "success") {
      router.refresh()
      toaster.create({
        type: "success",
        title: "Logged out succesfully",
      })
    }
  }, [lastResult?.status, router])

  const [form, fields] = useForm({
    onValidate(context) {
      return parseWithValibot(context.formData, {
        schema: AuthFormSchema,
      })
    },
    async onSubmit(event, context) {
      event.preventDefault()
      dialog.setOpen(false)
      startTransition(() => {
        action(context.formData)
      })
    },
  })

  return (
    <form
      id={form.id}
      onSubmit={form.onSubmit}
      action={action}
      noValidate={hydrated}
    >
      <Button
        type="submit"
        name={fields.pathname.name}
        value={pathname}
        disabled={isPending}
      >
        Log off
      </Button>
    </form>
  )
}
