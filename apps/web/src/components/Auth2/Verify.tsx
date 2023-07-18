"use client"

import { useRouter } from "next/navigation"

import { verify } from "~/actions/auth"
import { verifySchema } from "~/actions/schemas"
import { useForm, withAction, PropsWithAction } from "~/hooks/form"
import { assertUnreachable } from "~/lib/utils"
import { useToast } from "~/components/Toast"
import * as Modal from "~/components/Modal"
import * as Form from "~/components/Form2"

type Props = PropsWithAction<typeof verify> & {
  email: string
  onSuccess: () => void
}

function VerifyForm({ action, email, onSuccess }: Props) {
  const router = useRouter()
  const { emit } = useToast()
  const { root, field } = useForm({
    defaultValues: { email },
    action,
    schema: verifySchema,
    onError: () => {
      emit({ title: "Oops! Something went wrong" })
    },
    onSubmit: (data) => {
      if ("error" in data) {
        switch (data.error) {
          case "ALREADY_LOGGED_IN":
            emit({ title: "Oops! You cannot do that" })
            break
          default:
            assertUnreachable(data.error)
        }
      } else {
        onSuccess()
        emit({ title: "Logged in succesfully" })
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
        {/* <Resend email={email} /> */}
      </Modal.Container>
      <Form.Submit className="mt-4 flex justify-center">Confirm</Form.Submit>
    </Form.Root>
  )
}

export default withAction(VerifyForm, verify)
