import type { MetaFunction } from "@remix-run/react"
import type { Segment } from "framer-motion"
import { useAnimate, useInView, useScroll } from "framer-motion"
import type { ComponentProps } from "react"
import { Children, useEffect } from "react"
import SplitType from "split-type"
import Container from "~/components/Container"
import Icon from "~/components/Icon"
import Marquee from "~/components/Marquee"

export const meta: MetaFunction = () => [
  {
    title: "About – Artists Together",
  },
]

export const handle = {
  actions: {
    paint: () => console.log("paint"),
  },
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
        <Container className="flex min-h-screen items-center justify-center py-16">
          <h2 className="sr-only">Artists Together</h2>
          <Icon
            name="logo"
            className="h-full w-full max-w-[37.5rem]"
            label=""
          />
        </Container>
      </header>
      <main className="select-auto font-serif font-light leading-tight fluid:text-[4rem]">
        <AnimatedContainer grid className="min-h-screen items-center">
          <h2 className="col-span-5 col-start-2">
            Artists Together is an online, worldwide
            <br />
            inclusive community for all kinds of artists
            <br />
            and skill levels.
          </h2>
        </AnimatedContainer>
        <AnimatedContainer grid className="min-h-screen items-center">
          <h3 className="col-span-4 col-start-4">
            We want to give artists from around the globe
            <br />
            a place to share, learn
            <br />
            and talk with other creative folks.
          </h3>
        </AnimatedContainer>
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
        <AnimatedContainer grid className="min-h-screen items-center">
          <h4 className="col-span-4 col-start-2">
            We celebrate creativity, diversity,
            <br />
            entertainment and learning.
          </h4>
        </AnimatedContainer>
        <AnimatedContainer grid className="min-h-screen items-center">
          <h5 className="col-span-4 col-start-4">
            So, create, share and enjoy,
            <br />
            because we are glad to have you here.
          </h5>
        </AnimatedContainer>
      </main>
      <footer className="font-serif font-light leading-tight fluid:text-[4rem]">
        <Container className="grid h-screen items-center text-center">
          <h6>Artists, together.</h6>
        </Container>
      </footer>
    </>
  )
}
