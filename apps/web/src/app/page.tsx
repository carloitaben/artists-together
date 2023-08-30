import Icon from "~/components/Icon"
import Container from "~/components/Container"
import WidgetInstagram from "~/components/WidgetInstagram"
import WidgetSpinner from "~/components/WidgetSpinner"
import WidgetLive from "~/components/WidgetLive"
import WidgetClock from "~/components/WidgetClock"
import WidgetWeather from "~/components/WidgetWeather"
import WidgetTheme from "~/components/WidgetTheme"
import WidgetSchedule from "~/components/WidgetSchedule"

export default function Page() {
  return (
    <>
      <header>
        <Container className="flex justify-center py-16">
          <h1 className="sr-only">Artists Together</h1>
          <Icon label="" icon="logo" className="max-w-[28rem]" />
        </Container>
      </header>
      <main>
        <Container grid>
          <WidgetInstagram />
          <WidgetSpinner />
          <WidgetLive />
          <WidgetClock />
          <WidgetSchedule />
          <WidgetWeather />
          <WidgetTheme />
        </Container>
      </main>
    </>
  )
}
