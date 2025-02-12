"use client"

import { Dialog } from "@ark-ui/react/dialog"
import { getFormProps, useForm } from "@conform-to/react"
import { parseWithValibot } from "conform-to-valibot"
import { usePathname } from "next/navigation"
import { useActionState } from "react"
import { login } from "~/lib/actions"
import { useFormToastError } from "~/lib/forms"
import { AuthFormSchema } from "~/lib/schemas"
import Button from "~/components/Button"
import Icon from "~/components/Icon"
import DialogContainer from "./DialogContainer"
import DialogTitle from "./DialogTitle"

export default function Login() {
  const [lastResult, action, isPending] = useActionState(login, null)
  const pathname = usePathname()

  useFormToastError(lastResult)

  const [form, fields] = useForm({
    lastResult,
    onValidate(context) {
      return parseWithValibot(context.formData, {
        schema: AuthFormSchema,
      })
    },
  })

  return (
    <Dialog.Content className="space-y-4 focus:outline-none">
      <DialogContainer className="px-8 pb-9 pt-7 md:px-[3.75rem] md:pb-12 md:pt-10">
        <DialogTitle sm="fraunces" asChild>
          <Dialog.Title className="mb-4 text-center md:mb-5 md:[text-align:unset]">
            Welcome to <br className="md:hidden" />
            Artists Together
          </Dialog.Title>
        </DialogTitle>
        <Dialog.Description className="text-xs md:text-sm">
          We will be using Discord to manage your Artists&nbsp;Together account.
        </Dialog.Description>
      </DialogContainer>
      <form
        {...getFormProps(form)}
        action={action}
        className="flex justify-end"
      >
        <Button
          type="submit"
          name={fields.pathname.name}
          value={pathname}
          disabled={isPending}
          color={false}
          padding={false}
          className="bg-[#5865F2] px-4 text-gunpla-white-50 selection:bg-gunpla-white-50 selection:text-[#5865F2]"
        >
          <Icon
            src="Discord"
            alt=""
            className="flex size-5 items-center justify-center md:size-6"
          />
          Log-in with Discord
        </Button>
      </form>
    </Dialog.Content>
  )
}
