import type { MetaFunction } from "@remix-run/react"
import type { Segment } from "framer-motion"
import { useAnimate, useInView, useScroll } from "framer-motion"
import type { ComponentProps } from "react"
import { Children, useEffect } from "react"
import SplitType from "split-type"
import * as AspectRatio from "@radix-ui/react-aspect-ratio"
import Container from "~/components/Container"
import Icon from "~/components/Icon"
import Marquee from "~/components/Marquee"

export const meta: MetaFunction = () => [
  {
    title: "About – Artists Together",
  },
]

export const handle = {
  actions: {},
  page: {
    name: "About",
  },
}

function AnimatedContainer({
  children,
  ...props
}: ComponentProps<typeof Container>) {
  Children.only(children)

  const [ref, animate] = useAnimate<HTMLDivElement>()

  const inView = useInView(ref, {
    margin: "-1px",
  })

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start center", "end end"],
  })

  useEffect(() => {
    if (
      !inView ||
      !ref.current.firstElementChild ||
      !(ref.current.firstElementChild instanceof HTMLElement)
    )
      return

    const split = new SplitType(ref.current.firstElementChild, {
      split: "words",
    })

    if (!split.words) {
      throw Error("Missing split words")
    }

    const animation = animate(
      split.words.map<Segment>((word) => [word, { opacity: [0.5, 1] }]),
      { duration: 1 },
    )

    animation.pause()

    const removeListener = scrollYProgress.on("change", (progress) => {
      animation.time = progress
    })

    function update() {
      split.split({ split: "words" })
    }

    window.addEventListener("resize", update)

    return () => {
      split.revert()
      window.removeEventListener("resize", update)
      removeListener()
    }
  }, [animate, children, inView, ref, scrollYProgress])

  return (
    <Container {...props} ref={ref}>
      {children}
    </Container>
  )
}

export default function Page() {
  return (
    <>
      <header>
        <Container grid className="min-h-screen place-items-center py-16">
          <div className="max-w-[37.5rem] w-full col-span-2 sm:col-span-4 col-start-2 sm:col-start-3">
            <AspectRatio.Root ratio={600 / 286}>
              <h2 className="sr-only">Artists Together</h2>
              <Icon name="logo" className="h-full w-full" label="" />
            </AspectRatio.Root>
          </div>
        </Container>
      </header>
      <main className="select-auto font-serif font-light fluid:leading-tight fluid:text-2xl sm:fluid:text-[4rem]">
        <Container grid className="min-h-screen items-center">
          <h2 className="col-span-4 sm:col-span-7 sm:col-start-2">
            Artists Together is an online, worldwide
            <br />
            inclusive community for all kinds of artists
            <br />
            and skill levels.
          </h2>
        </Container>
        <Container grid className="min-h-screen items-center">
          <h3 className="col-span-4 sm:col-span-5 sm:col-start-4">
            We want to give artists from around
            <br />
            the globe a place to share, learn
            <br />
            and talk with other creative folks.
          </h3>
        </Container>
        <div className="relative grid min-h-screen items-center">
          <Marquee>
            drawing, modelling, refurbishing, sculpting, composing, filming,
            writing, singing, building,
          </Marquee>
          <Container
            aria-hidden
            grid
            padding={false}
            className="pointer-events-none absolute inset-0"
          >
            <div className="col-span-1 h-full bg-gradient-to-r from-theme-900 to-transparent" />
            <div className="col-span-1 col-end-9 h-full bg-gradient-to-l from-theme-900 to-transparent" />
          </Container>
        </div>
        <Container grid className="min-h-screen items-center">
          <h4 className="col-span-4 sm:col-span-7 sm:col-start-2">
            We celebrate creativity, diversity,
            <br />
            entertainment and learning.
          </h4>
        </Container>
        <Container grid className="min-h-screen items-center">
          <h5 className="col-span-4 sm:col-span-5 sm:col-start-4">
            So, create, share and enjoy,
            <br />
            because we are glad to have you here.
          </h5>
        </Container>
      </main>
      <footer className="font-serif font-light fluid:leading-tight fluid:text-[2rem] sm:fluid:text-[4rem]">
        <Container className="grid h-screen items-center text-center">
          <h6>Artists, together.</h6>
        </Container>
      </footer>
    </>
  )
}
