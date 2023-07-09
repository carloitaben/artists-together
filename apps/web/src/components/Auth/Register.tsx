import { TypeOf } from "zod"

import { signupSchema } from "~/lib/schemas"

import * as Modal from "~/components/Modal"
import * as Form from "~/components/Form"

type Props = {
  onSuccess: (data: TypeOf<typeof signupSchema>) => void
}

export default function Register({ onSuccess }: Props) {
  return (
    <Form.Root
      delay
      schema={signupSchema}
      initialValues={{ email: "", username: "" }}
      onSubmit={async (data, helpers) => {
        const response = await fetch("/api/auth/register", {
          method: "POST",
          headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
          },
          body: JSON.stringify(data),
        })

        if (response.status === 403) {
          return helpers.setFieldError("username", "Username already exists")
        }

        if (!response.ok) {
          const json = await response.json()
          throw Error("error" in json ? json.error : "Unknown error")
        }

        // @ts-expect-error i need to fix this :)
        onSuccess(data)
      }}
    >
      <Modal.Container>
        <Modal.Title inset>Register</Modal.Title>
        <Form.Field name="email" className="mb-4">
          <Form.Label>Email address</Form.Label>
          <Form.Input type="email" placeholder="johndoe@email.com" />
          <Form.Error />
        </Form.Field>
        <Form.Field name="username">
          <Form.Label
            caption={({ value }) => (
              <span className={value.length > 30 ? "text-acrylic-red-500" : ""}>
                {30 - value.length}/30
              </span>
            )}
          >
            Username
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
