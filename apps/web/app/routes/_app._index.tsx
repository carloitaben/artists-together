import type { MetaFunction } from "@remix-run/react"
import Container from "~/components/Container"
import WidgetTheme from "~/components/WidgetTheme"
import * as Form from "~/components/Form"
import Button from "~/components/Button"

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
      <Form.Root action="/">
        <Form.Field label="hello" name="asd" />
        <Form.Switch label="hello" name="switch" />
        <Form.Submit asChild>
          <Button>Submit</Button>
        </Form.Submit>
      </Form.Root>
    </Container>
  )
}
