import { lazy, Suspense } from "react"
import Container from "~/components/Container"
import Grid from "~/components/Grid"
import Logo from "~/components/Logo"
import Marquee from "~/components/Marquee"
import { getHints } from "~/features/hints/server"
import TextAnimation from "./components/TextAnimation"

const Stars = lazy(() => import("./components/Stars"))

export default async function Page() {
  const hints = await getHints()

  return (
    <>
      {hints.saveData ? null : (
        <Suspense>
          <Stars />
        </Suspense>
      )}
      <div
        aria-hidden
        className="pointer-events-none fixed inset-0 size-full bg-gradient-to-b from-arpeggio-black-900 from-[24%] to-theme-800"
        style={{
          background:
            "linear-gradient(180deg, rgba(11, 14, 30, 0) 24%, #2B0049 100%);",
        }}
      />
      <header>
        <Container asChild>
          <Grid className="min-h-screen place-items-center py-16">
            <div className="col-span-2 col-start-2 w-full max-w-[37.5rem] sm:col-span-4 sm:col-start-3">
              <Logo />
            </div>
          </Grid>
        </Container>
      </header>
      <main className="select-auto font-fraunces font-light scale:text-2xl scale:leading-[1.875rem] sm:scale:text-[4rem] sm:scale:leading-[4.9375rem]">
        <Container asChild>
          <TextAnimation asChild>
            <Grid className="min-h-screen items-center">
              <h2 className="col-span-4 sm:col-span-7 sm:col-start-2">
                Artists Together is an online, worldwide
                <br />
                inclusive community for all kinds of artists
                <br />
                and skill levels.
              </h2>
            </Grid>
          </TextAnimation>
        </Container>
        <Container asChild>
          <TextAnimation asChild>
            <Grid className="min-h-screen items-center">
              <h3 className="col-span-4 sm:col-span-5 sm:col-start-4">
                We want to give artists from around
                <br />
                the globe a place to share, learn
                <br />
                and talk with other creative folks.
              </h3>
            </Grid>
          </TextAnimation>
        </Container>
        <div className="relative grid min-h-screen items-center">
          <Marquee>
            drawing, modelling, refurbishing, sculpting, composing, filming,
            writing, singing, building,
          </Marquee>
          <Grid aria-hidden className="pointer-events-none absolute inset-0">
            <div className="col-span-1 h-full bg-gradient-to-r from-arpeggio-black-900 to-transparent" />
            <div className="col-span-1 col-end-9 h-full bg-gradient-to-l from-arpeggio-black-900 to-transparent" />
          </Grid>
        </div>
        <Container asChild>
          <TextAnimation asChild>
            <Grid className="min-h-screen items-center">
              <h4 className="col-span-4 sm:col-span-7 sm:col-start-2">
                We celebrate creativity, diversity,
                <br />
                entertainment and learning.
              </h4>
            </Grid>
          </TextAnimation>
        </Container>
        <Container asChild>
          <TextAnimation asChild>
            <Grid className="min-h-screen items-center">
              <h5 className="col-span-4 sm:col-span-5 sm:col-start-4">
                So, create, share and enjoy,
                <br />
                because we are glad to have you here.
              </h5>
            </Grid>
          </TextAnimation>
        </Container>
        <Container
          className="grid h-screen items-center text-center scale:text-[2rem] sm:scale:text-[4rem]"
          asChild
        >
          <TextAnimation>
            <h6>Artists, together.</h6>
          </TextAnimation>
        </Container>
      </main>
    </>
  )
}
