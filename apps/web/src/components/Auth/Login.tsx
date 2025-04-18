"use client"

import { Dialog } from "@ark-ui/react/dialog"
import { getFormProps } from "@conform-to/react"
import { useMutation } from "@tanstack/react-query"
import { usePathname } from "next/navigation"
import Button from "~/components/Button"
import Icon from "~/components/Icon"
import { login } from "~/features/auth/actions"
import { useFormMutation } from "~/lib/mutations"
import { AuthFormSchema } from "~/lib/schemas"
import DialogContainer from "./DialogContainer"
import DialogTitle from "./DialogTitle"

export default function Login() {
  const pathname = usePathname()
  const mutation = useMutation({
    async mutationFn(formData: FormData) {
      return login(formData)
    },
  })

  const [form, fields] = useFormMutation({
    mutation,
    schema: AuthFormSchema,
  })

  return (
    <Dialog.Content className="space-y-4 focus:outline-none">
      <DialogContainer className="px-8 pb-9 pt-7 md:max-w-[576px] md:px-[3.75rem] md:pb-12 md:pt-10">
        <DialogTitle sm="fraunces" asChild>
          <Dialog.Title className="mb-4 text-center md:mb-5 md:[text-align:unset]">
            Welcome to <br className="md:hidden" />
            Artists Together!
          </Dialog.Title>
        </DialogTitle>
        <Dialog.Description className="text-xs md:text-sm">
          As a temporary monitoring measure, to log in to Artists Together
          you&nbsp;must be a member of the Discord server for over a week.
        </Dialog.Description>
      </DialogContainer>
      <form {...getFormProps(form)} className="flex justify-end">
        <Button
          type="submit"
          name={fields.pathname.name}
          value={pathname}
          disabled={mutation.isPending}
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
