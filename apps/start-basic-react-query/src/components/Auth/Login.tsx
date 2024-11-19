import { useLocation } from "@tanstack/react-router"
import { useMutation } from "@tanstack/react-query"
import { useServerFn } from "@tanstack/start"
import { Dialog } from "@ark-ui/react/dialog"
import { useForm } from "@conform-to/react"
import { parseWithZod } from "@conform-to/zod"
import { AuthFormSchema } from "~/lib/schemas"
import { $login } from "~/services/auth/actions"
import Button from "~/components/Button"
import Icon from "~/components/Icon"
import DialogContainer from "./DialogContainer"
import DialogTitle from "./DialogTitle"

export default function Login() {
  const pathname = useLocation({
    select: (state) => state.pathname,
  })

  const serverFn = useServerFn($login)

  const mutation = useMutation({
    mutationFn: serverFn,
  })

  const [form, fields] = useForm({
    onValidate({ formData }) {
      return parseWithZod(formData, {
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
      <DialogContainer>
        <DialogTitle asChild>
          <Dialog.Title className="mb-4 px-3 text-center sm:mb-5 sm:[text-align:unset]">
            Welcome to <br className="sm:hidden" />
            Artists Together
          </Dialog.Title>
        </DialogTitle>
        <Dialog.Description className="px-3.5 text-xs sm:text-base">
          We will be using Discord to manage your Artists Together account.
        </Dialog.Description>
      </DialogContainer>
      <form
        id={form.id}
        onSubmit={form.onSubmit}
        // TODO: This is currently broken
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
          className="bg-[#5865F2] text-gunpla-white-50 selection:bg-gunpla-white-50 selection:text-[#5865F2]"
        >
          <Icon
            src="Discord"
            alt=""
            className="flex h-3 w-4 items-center justify-center sm:h-[1.125rem] sm:w-6"
          />
          Log-in with Discord
        </Button>
      </form>
    </Dialog.Content>
  )
}
