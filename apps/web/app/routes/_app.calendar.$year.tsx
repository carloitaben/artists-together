import * as AspectRatio from "@radix-ui/react-aspect-ratio"
import type { LoaderFunctionArgs, MetaFunction } from "@remix-run/node"
import { json, redirect } from "@remix-run/node"
import { calendarTabCookie } from "~/server/cookies.server"
import { useLoaderData } from "@remix-run/react"
import Container from "~/components/Container"
import CalendarMonth from "~/components/CalendarMonth"
import { $path } from "remix-routes"
import type { Dayjs } from "dayjs"
import { z } from "zod"
import dayjs from "dayjs"
import CalendarHeader from "~/components/CalendarHeader"
import { unreachable } from "~/lib/utils"

export const meta: MetaFunction = () => [
  {
    title: "Calendar – Artists Together",
  },
]

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

const paramsSchema = z.object({
  year: z.coerce.number().min(1970),
})

export async function loader({ params }: LoaderFunctionArgs) {
  const result = paramsSchema.safeParse(params)

  if (!result.success) {
    throw redirect("/404")
  }

  const date = dayjs().set("year", result.data.year)

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
      <CalendarHeader
        date={date}
        active="months"
        prev={to("prev")}
        next={to("next")}
        days={$path("/calendar/:year/:month", {
          year: date.year(),
          month: date.format("MMMM").toLowerCase(),
        })}
        months={$path("/calendar/:year", {
          year: dayjs().year(),
        })}
      />
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
