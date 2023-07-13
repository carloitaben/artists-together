import { redirect } from "next/navigation"

import { logo } from "~/components/Icons"
import Container from "~/components/Container"
import Marquee from "~/components/Marquee"
import Icon from "~/components/Icon"

export default function Page() {
  if (process.env.NODE_ENV === "production") {
    redirect("/")
  }

  return (
    <>
      <header>
        <Container className="flex justify-center py-16">
          <h1 className="sr-only">Artists Together</h1>
          <Icon className="max-w-[37.5rem]" label="">
            {logo}
          </Icon>
        </Container>
      </header>
      <main className="font-serif font-light leading-tight fluid:text-[4rem]">
        <Container grid className="min-h-screen items-center">
          <h2 className="col-span-5 col-start-2">
            Artists Together is an online, worlwide
            <br />
            inclusive community for all kinds of artists
            <br />
            and skill levels.
          </h2>
        </Container>
        <Container grid className="min-h-screen items-center">
          <h3 className="col-span-4 col-start-4">
            We want to give artists from around the globe
            <br />
            a place to share, learn
            <br />
            and talk with other creative folks.
          </h3>
        </Container>
        <div className="relative grid min-h-screen items-center">
          <Marquee>
            Drawing, modelling, refurbishing, sculpting, composing, filming,
            writing, singing, building...
          </Marquee>
          <Container
            aria-hidden
            grid
            padding="none"
            className="pointer-events-none absolute inset-0"
          >
            <div className="col-span-1 h-full bg-gradient-to-r from-theme-900 to-transparent" />
            <div className="col-span-1 col-end-9 h-full bg-gradient-to-l from-theme-900 to-transparent" />
          </Container>
        </div>
        <Container grid className="min-h-screen items-center">
          <h4 className="col-span-4 col-start-2">
            We celebrate creativity, diversity,
            <br />
            entertainment and learning.
          </h4>
        </Container>
        <Container grid className="min-h-screen items-center">
          <h5 className="col-span-4 col-start-4">
            So, create, share and enjoy,
            <br />
            because we are glad to have you here.
          </h5>
        </Container>
      </main>
      <footer className="font-serif font-light leading-tight fluid:text-[4rem]">
        <Container className="grid h-screen items-center text-center">
          <h6>Artists, together.</h6>
        </Container>
      </footer>
    </>
  )
}
