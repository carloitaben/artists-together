import Container from "~/components/Container"
import Grid from "~/components/Grid"
import Logo from "~/components/Logo"
import {
  HorizontalSpheresStackShape,
  ScribbleShape,
  SquareShape,
  VerticalOvalStackShape,
  VerticalRoundedRectanglesStackShape,
  VerticalSpheresStackShape,
} from "./components/Shapes"
import WidgetCalendar from "./components/WidgetCalendar"
import WidgetClock from "./components/WidgetClock"
import WidgetInstagram from "./components/WidgetInstagram"
import WidgetLive from "./components/WidgetLive"
import WidgetSlideshow from "./components/WidgetSlideshow"
import WidgetWeather from "./components/WidgetWeather"

export default function Home() {
  return (
    <>
      <Container asChild>
        <Grid asChild>
          <header>
            <div className="col-span-2 col-start-2 p-7 sm:col-start-4 sm:px-0 sm:py-16">
              <Logo />
            </div>
          </header>
        </Grid>
      </Container>
      <Container asChild>
        <main>
          <Grid className="scale:-mb-36">
            <WidgetInstagram />
            <VerticalSpheresStackShape />
            <WidgetLive />
          </Grid>
          <Grid className="scale:-mb-48">
            <div className="col-span-2 scale:mt-40">
              <WidgetCalendar />
            </div>
            <ScribbleShape />
            <WidgetClock />
            <WidgetSlideshow />
          </Grid>
          <Grid className="scale:-mb-32">
            <WidgetWeather />
          </Grid>
          <Grid className="items-end">
            <VerticalRoundedRectanglesStackShape />
            <HorizontalSpheresStackShape />
            <VerticalOvalStackShape />
            <SquareShape />
          </Grid>
        </main>
      </Container>
    </>
  )
}
