"use client"

import { register } from "~/actions/auth"
import { registerSchema } from "~/actions/schemas"
import { useToast } from "~/components/Toast"
import { useForm, withAction, PropsWithAction } from "~/components/Form2"
import * as Modal from "~/components/Modal"
import * as Field from "~/components/Form2/Field"
import { assertUnreachable } from "~/lib/utils"

type Props = PropsWithAction<typeof register> & {
  onSuccess: (email: string) => void
}

function RegisterForm({ action, onSuccess }: Props) {
  const { emit } = useToast()
  const { Form, field, setError } = useForm({
    action,
    schema: registerSchema,
    onError: () => {
      emit({ title: "Oops! Something went wrong" })
    },
    onSubmit: (data, input) => {
      if ("error" in data) {
        switch (data.error) {
          case "ALREADY_LOGGED_IN":
            emit({ title: "Oops! You cannot do that" })
            break
          case "EMAIL_ALREADY_USED":
            setError("email", {
              type: "custom",
              message: "An account with that email already exists",
            })
            break
          case "USERNAME_ALREADY_EXISTS":
            setError("username", {
              type: "custom",
              message: "An account with that username already exists",
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
        <Modal.Title inset>Register</Modal.Title>
        <Field.Root name={field("email")} className="mb-4">
          <Field.Label>Email address</Field.Label>
          <Field.Input type="email" placeholder="johndoe@email.com" />
          <Field.Error />
        </Field.Root>
        <Field.Root name={field("username")} className="mb-4">
          <Field.Label className="flex items-center justify-between">
            <span>Username</span>
            <Field.Value>
              {(value = "") => (
                <span
                  className={value.length > 30 ? "text-acrylic-red-500" : ""}
                >
                  {30 - value.length}/30
                </span>
              )}
            </Field.Value>
          </Field.Label>
          <Field.Input placeholder="johndoe" />
          <Field.Error />
        </Field.Root>
      </Modal.Container>
      <button>submit</button>
    </Form>
  )
}

export default withAction(RegisterForm, register)
