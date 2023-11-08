import type { MetaFunction } from "@remix-run/react"
import type { loader as locationLoader } from "~/routes/api.location"
import { useQuery } from "~/hooks/query"
import * as AspectRatio from "@radix-ui/react-aspect-ratio"
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
      <Container grid asChild className="py-7 sm:py-16">
        <header>
          <div className="col-span-2 col-start-2 px-7 sm:px-0 sm:col-start-4">
            <AspectRatio.Root ratio={600 / 286}>
              <h1 className="sr-only">Artists Together</h1>
              <Icon alt="" name="logo" className="w-full h-full" />
            </AspectRatio.Root>
          </div>
        </header>
      </Container>
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
