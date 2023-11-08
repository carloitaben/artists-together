import dayjs from "dayjs"
import relativeTimePlugin from "dayjs/plugin/relativeTime"
import * as AspectRatio from "@radix-ui/react-aspect-ratio"
import { useLoaderData, type MetaFunction } from "@remix-run/react"
import { guardDisabledRoute } from "~/server/lib.server"
import banner from "~/assets/images/art-banner.png"
import Container from "~/components/Container"
import Image from "~/components/Image"
import Pill from "~/components/Pill"
import Icon from "~/components/Icon"
import { between } from "~/lib/utils"

dayjs.extend(relativeTimePlugin)

export const meta: MetaFunction = () => [
  {
    title: "Artist Raid Train – Artists Together",
  },
]

export const handle = {
  actions: {
    help: () => console.log("help"),
  },
  page: {
    name: "Artist Raid Train",
  },
}

export async function loader() {
  guardDisabledRoute()

  const start = dayjs()
    .add(between(1, 3), "months")
    .add(between(1, 10), "days")
    .add(between(0, 10), "hours")
    .add(between(0, 59), "minutes")

  const end = dayjs(start).add(between(1, 3), "days")

  return {
    dates: {
      start: start.toISOString(),
      end: end.toISOString(),
    },
  }
}

export default function Page() {
  const data = useLoaderData<typeof loader>()

  const dates = {
    start: dayjs(data.dates.start),
    end: dayjs(data.dates.end),
  }

  const sameMonth = dates.start.month() === dates.end.month()

  return (
    <>
      <Container asChild className="mb-1 sm:fluid:mb-4">
        <header>
          <AspectRatio.Root
            ratio={1840 / 642}
            className="rounded-2xl overflow-hidden"
          >
            <Image
              src={banner}
              alt=""
              fit="cover"
              className="absolute inset-0"
            />
            <div className="relative font-serif fluid:text-9xl font-light fluid:px-10 fluid:py-5">
              <h2>
                Artist Raid Train
                <br />
                {sameMonth ? (
                  <>
                    {dates.start.format("MMMM")} {dates.start.format("D")}
                    {"-"}
                    {dates.end.format("D")}
                  </>
                ) : (
                  <>
                    {dates.start.format("MMMM D")}
                    {"-"}
                    {dates.end.format("MMM D")}
                  </>
                )}
              </h2>
            </div>
            <div className="absolute bottom-0 right-0 flex items-center gap-2 p-4">
              <Pill>
                <Icon name="face" alt="" className="flex-none w-4 h-4" />
                Lorem ipsum
              </Pill>
              <Pill>
                <Icon name="face" alt="" className="flex-none w-4 h-4" />
                Dolor sit amet
              </Pill>
            </div>
          </AspectRatio.Root>
        </header>
      </Container>
      <Container grid asChild>
        <main>
          <div className="col-span-5">
            <AspectRatio.Root
              ratio={16 / 9}
              className="rounded-2xl overflow-hidden bg-theme-50"
            >
              <div className="w-full h-full">Trailer</div>
            </AspectRatio.Root>
          </div>
          <div className="col-span-3">
            <div className="fluid:rounded-[8rem] overflow-hidden bg-theme-50 text-theme-900 h-full relative flex items-center justify-center text-center">
              <div className="absolute inset-0 pointer-events-none">
                name cloud
              </div>
              <div className="fluid:space-y-2">
                <h3 className="font-serif font-light fluid:text-[4rem] leading-none">
                  Sign-up now!
                </h3>
                <h4 className="fluid:text-2xl">
                  Closes {dates.start.fromNow()}
                </h4>
              </div>
            </div>
          </div>
          <div className="col-span-4 rounded-2xl bg-theme-50 text-theme-900 fluid:py-4 fluid:px-8">
            <h4 className="font-serif font-light fluid:text-[4rem] leading-none">
              Saturday 3<sup>rd</sup>
            </h4>
          </div>
          <div className="col-span-4 rounded-2xl bg-theme-50 text-theme-900 fluid:py-4 fluid:px-8">
            <h4 className="font-serif font-light fluid:text-[4rem] leading-none">
              Saturday 3<sup>rd</sup>
            </h4>
          </div>
        </main>
      </Container>
    </>
  )
}
