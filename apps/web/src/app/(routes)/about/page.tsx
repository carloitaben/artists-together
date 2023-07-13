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
      <main className="font-serif text-[3.333vw]">
        <Container grid>
          <h2>
            Artists Together is an online, worlwide
            <br />
            inclusive community for all kinds of artists
            <br />
            and skill levels.
          </h2>
        </Container>
        <Container grid>
          <h3>
            We want to give artists from around the globe
            <br />
            a place to share, learn
            <br />
            and talk with other creative folks.
          </h3>
        </Container>
        <Marquee>
          Drawing, modelling, refurbishing, sculpting, composing, filming,
          writing, singing, building...
        </Marquee>
        <Container grid>
          <h4>
            We celebrate creativity, diversity,
            <br />
            entertainment and learning.
          </h4>
        </Container>
        <Container grid>
          <h5>
            So, create, share and enjoy,
            <br />
            because we are glad to have you here.
          </h5>
        </Container>
      </main>
      <footer>
        <Container className="flex h-screen items-center justify-center">
          <h6>Artists, Together</h6>
        </Container>
      </footer>
    </>
  )
}
