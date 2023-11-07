import * as AspectRatio from "@radix-ui/react-aspect-ratio"
import dayjs from "dayjs"
import { json } from "@remix-run/node"
import { calendarTabCookie } from "~/server/cookies.server"
import { useLoaderData } from "@remix-run/react"
import Container from "~/components/Container"
import CalendarMonth from "~/components/CalendarMonth"

export const handle = {
  actions: {},
  page: {
    name: "Calendar",
  },
}

export async function loader() {
  const today = dayjs().toISOString()

  return json(
    { today },
    {
      headers: {
        "Set-Cookie": await calendarTabCookie.serialize("months"),
      },
    },
  )
}

export default function Page() {
  const data = useLoaderData<typeof loader>()
  const date = dayjs(data.today)

  return (
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
  )
}
