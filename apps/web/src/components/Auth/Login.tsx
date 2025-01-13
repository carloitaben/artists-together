import { useLocation } from "@tanstack/react-router"
import { useMutation } from "@tanstack/react-query"
import { useServerFn } from "@tanstack/start"
import { Dialog } from "@ark-ui/react/dialog"
import { useForm } from "@conform-to/react"
import { parseWithValibot } from "conform-to-valibot"
import { AuthFormSchema } from "~/lib/schemas"
import { $login } from "~/services/auth/actions"
import Button from "~/components/Button"
import Icon from "~/components/Icon"
import DialogContainer from "./DialogContainer"
import DialogTitle from "./DialogTitle"

export default function Login() {
  const serverFn = useServerFn($login)
  const pathname = useLocation({
    select: (state) => state.pathname,
  })

  const mutation = useMutation({
    mutationFn: serverFn,
  })

  const [form, fields] = useForm({
    onValidate({ formData }) {
      return parseWithValibot(formData, {
        schema: AuthFormSchema,
      })
    },
    async onSubmit(event, context) {
      event.preventDefault()
      await mutation.mutateAsync({
        data: context.formData,
      })
    },
  })

  return (
    <Dialog.Content className="space-y-4 focus:outline-none">
      <DialogContainer className="px-8 pb-9 pt-7 md:px-[3.75rem] md:pb-12 md:pt-10">
        <DialogTitle padding={false} asChild>
          <Dialog.Title className="mb-4 text-center md:mb-5 md:[text-align:unset]">
            Welcome to <br className="md:hidden" />
            Artists Together
          </Dialog.Title>
        </DialogTitle>
        <Dialog.Description className="text-xs md:text-sm">
          We will be using Discord to manage your Artists Together account.
        </Dialog.Description>
      </DialogContainer>
      <form
        id={form.id}
        onSubmit={form.onSubmit}
        // action={$login.url}
        method="post"
        encType="multipart/form-data"
        className="flex justify-end"
      >
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
