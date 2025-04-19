import type { Metadata } from "next"
import { lazy, Suspense } from "react"
import Container from "~/components/Container"
import Grid from "~/components/Grid"
import Logo from "~/components/Logo"
import Marquee from "~/components/Marquee"
import TextAnimation from "./components/TextAnimation"

const Stars = lazy(() => import("./components/Stars"))

export const metadata: Metadata = {
  title: "About",
}

export default async function Page() {
  return (
    <>
      <Suspense>
        <Stars />
      </Suspense>
      <header className="text-outsider-violet-50">
        <Container asChild>
          <Grid className="min-h-screen place-items-center py-16">
            <div className="col-span-4 w-full max-w-[37.5rem] px-12 sm:col-span-4 sm:col-start-3 sm:px-0">
              <Logo />
            </div>
          </Grid>
        </Container>
      </header>
      <main className="select-auto font-fraunces font-light text-outsider-violet-50 scale:text-2xl scale:leading-[1.875rem] sm:scale:text-[4rem] sm:scale:leading-[4.9375rem]">
        <Container asChild>
          <TextAnimation asChild>
            <Grid className="min-h-screen items-center">
              <h2 className="col-span-4 sm:col-span-7 sm:col-start-2">
                Artists Together is a worldwide, inclusive,{" "}
                <br className="hidden sm:block" />
                and diverse community for all kinds of artists{" "}
                <br className="hidden sm:block" />
                and skill levels.
              </h2>
            </Grid>
          </TextAnimation>
        </Container>
        <Container asChild>
          <TextAnimation asChild>
            <Grid className="min-h-screen items-center">
              <h3 className="col-span-4 sm:col-span-5 sm:col-start-4">
                We want to give artists from around{" "}
                <br className="hidden sm:block" />
                the globe a place to share, learn{" "}
                <br className="hidden sm:block" />
                and talk with other creative folks.
              </h3>
            </Grid>
          </TextAnimation>
        </Container>
        <div className="relative grid min-h-screen items-center">
          <Marquee>
            drawing, modelling, refurbishing, sculpting, composing, filming,
            writing, singing, building, dancing, developing, designing, acting,
            crafting, illustrating, performing, animating, photographing,
          </Marquee>
          <Grid aria-hidden className="pointer-events-none absolute inset-0">
            <div className="col-span-1 h-full bg-gradient-to-r from-arpeggio-black-900 to-transparent" />
            <div className="col-span-1 col-end-5 h-full bg-gradient-to-l from-arpeggio-black-900 to-transparent sm:col-end-9" />
          </Grid>
        </div>
        <Container asChild>
          <TextAnimation asChild>
            <Grid className="min-h-screen items-center">
              <h4 className="col-span-4 sm:col-span-7 sm:col-start-2">
                We celebrate creativity, diversity,{" "}
                <br className="hidden sm:block" />
                entertainment, and learning.
              </h4>
            </Grid>
          </TextAnimation>
        </Container>
        <Container asChild>
          <TextAnimation asChild>
            <Grid className="min-h-screen items-center">
              <h5 className="col-span-4 sm:col-span-5 sm:col-start-4">
                So, create, share and enjoy, <br className="hidden sm:block" />
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
      <div
        aria-hidden
        className="pointer-events-none fixed inset-0 size-full bg-gradient-to-b from-arpeggio-black-900/0 from-[24%] to-theme-800 mix-blend-lighten"
      />
    </>
  )
}
