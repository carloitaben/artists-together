import type { LoaderFunctionArgs } from "@remix-run/node"
import { useLoaderData, type MetaFunction } from "@remix-run/react"
import { getLocations } from "~/services/geo.server"
import { oneOf } from "~/lib/utils"
import Container from "~/components/Container"
import WidgetTheme from "~/components/WidgetTheme"
import WidgetClock from "~/components/WidgetClock"
import WidgetCalendar from "~/components/WidgetCalendar"

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

export async function loader({ request }: LoaderFunctionArgs) {
  const locations = await getLocations()

  return {
    location: oneOf(locations),
  }
}

export default function Page() {
  const data = useLoaderData<typeof loader>()

  return (
    <Container grid>
      <WidgetTheme />
      <WidgetClock location={data.location} />
      <WidgetCalendar />
    </Container>
  )
}
