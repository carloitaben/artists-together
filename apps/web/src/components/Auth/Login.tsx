import { TypeOf } from "zod"

import { loginSchema } from "~/lib/schemas"

import * as Modal from "~/components/Modal"
import * as Form from "~/components/Form"

type Props = {
  onSuccess: (data: TypeOf<typeof loginSchema>) => void
}

export default function Login({ onSuccess }: Props) {
  return (
    <Form.Root
      schema={loginSchema}
      initialValues={{ email: "" }}
      onSubmit={async (data) => {
        const response = await fetch("/api/auth/login", {
          method: "POST",
          headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
          },
          body: JSON.stringify(data),
        })

        if (response.ok) {
          // @ts-expect-error i need to fix this :)
          onSuccess(data)
        } else {
          throw Error("Unknown error")
        }
      }}
    >
      <Modal.Container>
        <Modal.Title inset>Log-in</Modal.Title>
        <Form.Field name="email">
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
