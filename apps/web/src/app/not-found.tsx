import type { Metadata } from "next"
import Image from "next/image"
import image from "~/assets/images/404.png"
import Container from "~/components/Container"

export const metadata: Metadata = {
  title: "404",
  description: "Oh no! This page doesn't exist.",
}

export default function NotFound() {
  return (
    <Container className="h-dvh py-16 sm:py-4">
      <section className="relative grid h-full place-items-center">
        <h1 className="sr-only">Oh no! This page doesn&apos;t exist.</h1>
        <Image
          src={image}
          draggable={false}
          alt=""
          className="mx-auto size-full max-w-[1136px] object-contain"
        />
      </section>
    </Container>
  )
}
