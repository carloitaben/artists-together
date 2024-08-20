import type { Metadata } from "next"
import { lazy, Suspense } from "react"
import { hints } from "~/lib/headers/server"
import AspectRatio from "~/components/AspectRatio"
import Container from "~/components/Container"
import Grid from "~/components/Grid"
import Marquee from "~/components/Marquee"
import Icon from "~/components/Icon"
import Lottie from "~/components/Lottie"

const Stars = lazy(() => import("./components/Stars"))

export const metadata: Metadata = {
  title: "About",
}

export default function Page() {
  const { saveData } = hints()

  return (
    <>
      {saveData ? null : (
        <Suspense>
          <Stars />
        </Suspense>
      )}
      <header>
        <Container asChild>
          <Grid className="min-h-screen place-items-center py-16">
            <div className="col-span-2 col-start-2 w-full max-w-[37.5rem] sm:col-span-4 sm:col-start-3">
              <AspectRatio.Root ratio={2 / 1}>
                <AspectRatio.Content>
                  <h2 className="sr-only">Artists Together</h2>
                  {saveData ? (
                    <Icon src="Logo" alt="" className="size-full" />
                  ) : (
                    <Lottie
                      src={() => import("~/assets/lottie/logo-w.json")}
                      autoplay
                    />
                  )}
                </AspectRatio.Content>
              </AspectRatio.Root>
            </div>
          </Grid>
        </Container>
      </header>
      <main className="select-auto font-fraunces font-light scale:text-2xl scale:leading-tight sm:scale:text-[4rem]">
        <Container asChild>
          <Grid className="min-h-screen items-center">
            <h2 className="col-span-4 sm:col-span-7 sm:col-start-2">
              Artists Together is an online, worldwide
              <br />
              inclusive community for all kinds of artists
              <br />
              and skill levels.
            </h2>
          </Grid>
        </Container>
        <Container asChild>
          <Grid className="min-h-screen items-center">
            <h3 className="col-span-4 sm:col-span-5 sm:col-start-4">
              We want to give artists from around
              <br />
              the globe a place to share, learn
              <br />
              and talk with other creative folks.
            </h3>
          </Grid>
        </Container>
        <div className="relative grid min-h-screen items-center">
          <Marquee>
            drawing, modelling, refurbishing, sculpting, composing, filming,
            writing, singing, building,
          </Marquee>
          <Grid aria-hidden className="pointer-events-none absolute inset-0">
            <div className="col-span-1 h-full bg-gradient-to-r from-theme-900 to-transparent" />
            <div className="col-span-1 col-end-9 h-full bg-gradient-to-l from-theme-900 to-transparent" />
          </Grid>
        </div>
        <Container asChild>
          <Grid className="min-h-screen items-center">
            <h4 className="col-span-4 sm:col-span-7 sm:col-start-2">
              We celebrate creativity, diversity,
              <br />
              entertainment and learning.
            </h4>
          </Grid>
        </Container>
        <Container asChild>
          <Grid className="min-h-screen items-center">
            <h5 className="col-span-4 sm:col-span-5 sm:col-start-4">
              So, create, share and enjoy,
              <br />
              because we are glad to have you here.
            </h5>
          </Grid>
        </Container>
        <Container className="grid h-screen items-center text-center scale:text-[2rem] sm:scale:text-[4rem]">
          <h6>Artists, together.</h6>
        </Container>
      </main>
    </>
  )
}
