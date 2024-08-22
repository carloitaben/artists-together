import { hints } from "~/lib/headers/server"
import AspectRatio from "~/components/AspectRatio"
import Container from "~/components/Container"
import Lottie from "~/components/Lottie"
import Grid from "~/components/Grid"
import WidgetInstagram from "./components/WidgetInstagram"
import {
  HorizontalSpheresStackShape,
  ScribbleShape,
  SquareShape,
  VerticalOvalStackShape,
  VerticalRoundedRectanglesStackShape,
  VerticalSpheresStackShape,
} from "./components/Shapes"
import WidgetLive from "./components/WidgetLive"
import WidgetClock from "./components/WidgetClock"
import WidgetSlideshow from "./components/WidgetSlideshow"
import WidgetWeather from "./components/WidgetWeather"
import WidgetCalendar from "./components/WidgetCalendar"

export default function Page() {
  const { saveData } = hints()

  return (
    <>
      <Container asChild>
        <Grid asChild>
          <header>
            <div className="col-span-2 col-start-2 p-7 sm:col-start-4 sm:px-0 sm:py-16">
              <AspectRatio.Root ratio={2 / 1}>
                <AspectRatio.Content>
                  <h1 className="sr-only">Artists Together</h1>
                  {saveData ? (
                    <div>static at logo</div>
                  ) : (
                    <Lottie
                      src={() => import("~/assets/lottie/logo-w.json")}
                      autoplay
                    />
                  )}
                </AspectRatio.Content>
              </AspectRatio.Root>
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
