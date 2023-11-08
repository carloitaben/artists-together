import { useLocation } from "@remix-run/react"
import { validator } from "~/routes/api.auth.logout"
import * as Form from "~/components/Form"
import Button from "~/components/Button"

export default function AuthSignOutForm() {
  const location = useLocation()
  return (
    <Form.Root
      validator={validator}
      action="/api/auth/logout"
      className="flex justify-end"
      navigate={false}
    >
      <Form.Submit className="disabled:opacity-25" asChild>
        <Button name="pathname" value={location.pathname}>
          Log out
        </Button>
      </Form.Submit>
    </Form.Root>
  )
}
