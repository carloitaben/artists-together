import * as AspectRatio from "@radix-ui/react-aspect-ratio"
import type { LoaderFunctionArgs } from "@remix-run/node"
import { json } from "@remix-run/node"
import { calendarTabCookie } from "~/server/cookies.server"
import { Link, useLoaderData } from "@remix-run/react"
import Container from "~/components/Container"
import CalendarMonth from "~/components/CalendarMonth"
import { $params, $path } from "remix-routes"
import type { Dayjs } from "dayjs"
import dayjs from "dayjs"
import { unreachable } from "~/lib/utils"
import { useHints } from "~/hooks/loaders"

export const handle = {
  actions: {
    prev: () => {
      console.log("previous year")
    },
    next: () => {
      console.log("next year")
    },
  },
  page: {
    name: "Calendar",
  },
}

export async function loader({ params }: LoaderFunctionArgs) {
  const { year } = $params("/calendar/:year", params)

  const date = dayjs().set("year", parseInt(year))

  return json(
    {
      date: date.toISOString(),
    },
    {
      headers: {
        "Set-Cookie": await calendarTabCookie.serialize("months"),
      },
    },
  )
}

export default function Page() {
  const hints = useHints()
  const data = useLoaderData<typeof loader>()
  const date = dayjs(data.date)

  function to(mode: "prev" | "next") {
    let targetDate: Dayjs | undefined

    switch (mode) {
      case "prev":
        targetDate = date.subtract(1, "year")
        break
      case "next":
        targetDate = date.add(1, "year")
        break
      default:
        unreachable(mode)
    }

    return $path("/calendar/:year", {
      year: targetDate.year(),
    })
  }

  return (
    <>
      <div>
        <Link to={to("prev")} prefetch={hints.saveData ? "none" : "intent"}>
          prev
        </Link>
        <Link to={to("next")} prefetch={hints.saveData ? "none" : "intent"}>
          next
        </Link>
      </div>
      <Container grid asChild>
        <main>
          {Array(12)
            .fill(0)
            .map((_, index) => (
              <div key={index} className="col-span-2">
                <AspectRatio.Root
                  ratio={1}
                  className="overflow-hidden fluid:rounded-5xl shadow-card"
                >
                  <CalendarMonth date={date.month(index)} />
                </AspectRatio.Root>
              </div>
            ))}
        </main>
      </Container>
    </>
  )
}
