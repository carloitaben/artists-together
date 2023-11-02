import type { MetaFunction } from "@remix-run/react"
import Container from "~/components/Container"
import WidgetTheme from "~/components/WidgetTheme"
import * as Form from "~/components/Form"
import Button from "~/components/Button"
import { validator } from "./api.test"

export const meta: MetaFunction = () => [
  {
    title: "Home – Artists Together",
  },
]

export const handle = {
  actions: {},
  page: {
    name: "Home",
  },
}

export default function Page() {
  return (
    <Container grid>
      <WidgetTheme />
      <Form.Root validator={validator} action="/api/test">
        <Form.Field name="email">
          <Form.Label>
            <Form.Tooltip>
              We use your approximate location (region) to let other members
              know your timezone.
            </Form.Tooltip>
            Email
          </Form.Label>
          <Form.Input type="email" placeholder="Enter your email" />
          <Form.Error />
        </Form.Field>
        <Form.Field name="switch">
          <Form.Label>Toggle something</Form.Label>
          <Form.Switch />
        </Form.Field>
        <Form.Submit asChild>
          <Button>Submit</Button>
        </Form.Submit>
      </Form.Root>
    </Container>
  )
}
