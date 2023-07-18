"use client"

import { login } from "~/actions/auth"
import { loginSchema } from "~/actions/schemas"
import { useForm, withAction, PropsWithAction } from "~/hooks/form"
import { useToast } from "~/components/Toast"
import * as Modal from "~/components/Modal"
import * as Form from "~/components/Form"

type Props = PropsWithAction<typeof login> & {
  onSuccess: (email: string) => void
}

function LoginForm({ action, onSuccess }: Props) {
  const { emit } = useToast()
  const { root, field, setError } = useForm({
    action,
    schema: loginSchema,
    onError: () => {
      emit("Oops! Something went wrong")
    },
    onSubmit: (data, input) => {
      if ("error" in data) {
        switch (data.error) {
          case "ALREADY_LOGGED_IN":
            emit("You are already logged in!")
            break
          case "USER_DOES_NOT_EXIST":
            setError("email", {
              type: "custom",
              message: "No account with that email exists",
            })
            break
          default:
            emit("Oops! Something went wrong")
        }
      } else {
        onSuccess(input.email)
      }
    },
  })

  return (
    <Form.Root {...root()}>
      <Modal.Container>
        <Modal.Title inset>Log-in</Modal.Title>
        <Form.Field {...field("email")}>
          <Form.Label>Email address</Form.Label>
          <Form.Input
            type="email"
            placeholder="johndoe@email.com"
            icon={
              <Form.Tooltip>
                Lorem ipsum dolor sit, amet consectetur adipisicing elit.
              </Form.Tooltip>
            }
          />
          <Form.Error />
        </Form.Field>
        <Form.Loading />
      </Modal.Container>
      <Form.Submit className="mt-4 flex justify-end">Log-in</Form.Submit>
    </Form.Root>
  )
}

export default withAction(LoginForm, login)
