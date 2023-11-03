import type { MetaFunction } from "@remix-run/react"
import type { loader as locationLoader } from "~/routes/api.location"
import { useQuery } from "~/hooks/query"
import Container from "~/components/Container"
import WidgetTheme from "~/components/WidgetTheme"
import WidgetClock from "~/components/WidgetClock"
import WidgetCalendar from "~/components/WidgetCalendar"
import WidgetInstagram from "~/components/WidgetInstagram"
import WidgetLive from "~/components/WidgetLive"
import Icon from "~/components/Icon"
import WidgetWeather from "~/components/WidgetWeather"

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
  const { data = null } = useQuery<typeof locationLoader>({
    route: "/api/location",
  })

  return (
    <>
      <header>
        <Container className="flex justify-center py-16">
          <h1 className="sr-only">Artists Together</h1>
          <Icon label="" name="logo" className="w-full max-w-[28rem]" />
        </Container>
      </header>
      <Container grid asChild>
        <main>
          <WidgetInstagram />
          <WidgetLive />
          <WidgetClock location={data} />
          <WidgetCalendar />
          <WidgetWeather location={data} />
          <WidgetTheme />
        </main>
      </Container>
    </>
  )
}
