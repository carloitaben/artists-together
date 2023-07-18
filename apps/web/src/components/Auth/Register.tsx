"use client"

import { register } from "~/actions/auth"
import { registerSchema } from "~/actions/schemas"
import { useForm, withAction, PropsWithAction } from "~/hooks/form"
import { useToast } from "~/components/Toast"
import * as Modal from "~/components/Modal"
import * as Form from "~/components/Form"

type Props = PropsWithAction<typeof register> & {
  onSuccess: (email: string) => void
}

function RegisterForm({ action, onSuccess }: Props) {
  const { emit } = useToast()
  const { root, field, setError } = useForm({
    action,
    schema: registerSchema,
    onError: () => {
      emit("Oops! Something went wrong")
    },
    onSubmit: (data, input) => {
      if ("error" in data) {
        switch (data.error) {
          case "ALREADY_LOGGED_IN":
            emit("You are already logged in!")
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
        <Modal.Title inset>Register</Modal.Title>
        <Form.Field {...field("email")} className="mb-4">
          <Form.Label>Email address</Form.Label>
          <Form.Input type="email" placeholder="johndoe@email.com" />
          <Form.Error />
        </Form.Field>
        <Form.Field {...field("username")} className="mb-4">
          <Form.Label className="flex items-center justify-between">
            <span>Username</span>
            <Form.Value>
              {(value = "") => (
                <span
                  className={value.length > 30 ? "text-acrylic-red-500" : ""}
                >
                  {30 - value.length}/30
                </span>
              )}
            </Form.Value>
          </Form.Label>
          <Form.Input
            placeholder="johndoe"
            icon={
              <Form.Tooltip>
                We recommend using the same username you have in other
                platforms.
              </Form.Tooltip>
            }
          />
          <Form.Error />
        </Form.Field>
        <Form.Loading />
      </Modal.Container>
      <Form.Submit className="mt-4 flex justify-end">Register</Form.Submit>
    </Form.Root>
  )
}

export default withAction(RegisterForm, register)
