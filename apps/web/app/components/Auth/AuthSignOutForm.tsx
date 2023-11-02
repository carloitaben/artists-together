import * as Form from "~/components/Form"
import Button from "~/components/Button"
import { validator } from "~/routes/auth.logout"

export default function AuthSignOutForm() {
  return (
    <Form.Root
      validator={validator}
      action="/auth/logout"
      className="flex justify-end"
      navigate={false}
    >
      <Form.Submit className="disabled:opacity-25" asChild>
        <Button>Log out</Button>
      </Form.Submit>
    </Form.Root>
  )
}
