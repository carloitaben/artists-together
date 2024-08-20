import type { Metadata } from "next"
import Image from "next/image"
import image from "~/assets/images/404.png"
import Container from "~/components/Container"

export const metadata: Metadata = {
  title: "404",
}

export default function Page() {
  return (
    <Container className="h-dvh py-16 sm:py-4">
      <section className="relative grid h-full place-items-center">
        <h1 className="sr-only"> Oh no! This page doesn&apos;t exist.</h1>
        <Image
          src={image}
          alt="404"
          className="absolute inset-0 mx-auto size-full max-w-[1136px] object-contain"
        />
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 bg-arpeggio-black-300 mix-blend-darken"
        />
      </section>
    </Container>
  )
}
