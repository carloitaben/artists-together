"use client"

import { useTransition } from "react"
import { useRouter } from "next/navigation"

import { login, verify } from "~/actions/auth"
import { verifySchema } from "~/actions/schemas"
import { useForm, withAction, PropsWithAction } from "~/hooks/form"
import { assertUnreachable } from "~/lib/utils"
import { useToast } from "~/components/Toast"
import * as Modal from "~/components/Modal"
import * as Form from "~/components/Form"

type Props = PropsWithAction<
  typeof verify,
  {
    email: string
    onSuccess: () => void
  }
>

function ResendComponent({
  action,
  email,
}: PropsWithAction<typeof login, { email: string }>) {
  const [isPending, startTransition] = useTransition()
  const { emit } = useToast()

  return (
    <button
      disabled={isPending}
      onClick={() =>
        startTransition(async () => {
          const { data, serverError, validationError } = await action({ email })

          if (serverError || validationError) {
            return emit("Oops! Something went wrong")
          }

          if (data && "error" in data) {
            switch (data.error) {
              case "ALREADY_LOGGED_IN":
                emit("You are already logged in!")
                break
              case "USER_DOES_NOT_EXIST":
                emit("Oops! No account with that email exists")
                break
              default:
                emit("Oops! Something went wrong")
            }
          } else {
            emit("Done! Check your spam folder")
          }
        })
      }
    >
      Not received? Resend it
    </button>
  )
}

const Resend = withAction(ResendComponent, login)

function VerifyForm({ action, email, onSuccess }: Props) {
  const router = useRouter()
  const { emit } = useToast()
  const { root, field, setError } = useForm({
    defaultValues: { email },
    action,
    schema: verifySchema,
    onError: () => {
      setError("otp", {
        type: "custom",
        message: "Invalid code",
      })
    },
    onSubmit: (data) => {
      if ("error" in data) {
        switch (data.error) {
          case "ALREADY_LOGGED_IN":
            emit("You are already logged in!")
            break
          default:
            assertUnreachable(data.error)
        }
      } else {
        onSuccess()
        emit("Logged in succesfully")
        return router.refresh()
      }
    },
  })

  return (
    <Form.Root {...root()}>
      <Modal.Container className="text-center">
        <Modal.Title className="mb-6 text-center text-2xl">
          A verification code
          <br />
          has been sent to your email account
        </Modal.Title>
        <Form.Field {...field("otp")}>
          <Form.Label>Otp plz</Form.Label>
          <Form.Input />
          <Form.Error />
        </Form.Field>
        <Resend email={email} />
        <Form.Loading />
      </Modal.Container>
      <Form.Submit className="mt-4 flex justify-center">Confirm</Form.Submit>
    </Form.Root>
  )
}

export default withAction(VerifyForm, verify)
