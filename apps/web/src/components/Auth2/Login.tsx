"use client"

import { login } from "~/actions/auth"
import { loginSchema } from "~/actions/schemas"
import { useToast } from "~/components/Toast"
import { useForm, withAction, PropsWithAction } from "~/components/Form2"
import * as Modal from "~/components/Modal"
import * as Field from "~/components/Form2/Field"

type Props = PropsWithAction<typeof login> & {
  onSuccess: (email: string) => void
}

function LoginForm({ action, onSuccess }: Props) {
  const { emit } = useToast()
  const { Form, field, setError } = useForm({
    action,
    schema: loginSchema,
    onError: () => {
      emit({ title: "Oops! Something went wrong" })
    },
    onSubmit: (data, input) => {
      if ("error" in data) {
        switch (data.error) {
          case "ALREADY_LOGGED_IN":
            emit({ title: "Oops! You cannot do that" })
            break
          case "USER_DOES_NOT_EXIST":
            setError("email", {
              type: "custom",
              message: "No account with that email exists",
            })
            break
          default:
            emit({ title: "Oops! Something went wrong" })
        }
      } else {
        onSuccess(input.email)
      }
    },
  })

  return (
    <Form>
      <Modal.Container>
        <Modal.Title inset>Log-in</Modal.Title>
        <Field.Root name={field("email")}>
          <Field.Label>Email address</Field.Label>
          <Field.Input type="email" placeholder="johndoe@email.com" />
          <Field.Error />
        </Field.Root>
      </Modal.Container>
      <button>submit</button>
    </Form>
  )
}

export default withAction(LoginForm, login)
