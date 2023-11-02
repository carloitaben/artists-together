import type { MetaFunction } from "@remix-run/node"
import Container from "~/components/Container"
import WidgetTheme from "~/components/WidgetTheme"
import * as Shine from "~/components/Shine"

export const meta: MetaFunction = () => {
  return [
    { title: "New Remix App" },
    { name: "description", content: "Welcome to Remix!" },
  ]
}

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
    </Container>
  )
}
