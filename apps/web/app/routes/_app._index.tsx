import type { MetaFunction } from "@remix-run/react"
import Container from "~/components/Container"
import WidgetTheme from "~/components/WidgetTheme"

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
    </Container>
  )
}
