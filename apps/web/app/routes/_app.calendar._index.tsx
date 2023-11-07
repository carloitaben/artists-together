import type { LoaderFunctionArgs } from "@remix-run/node"
import { redirect } from "@remix-run/node"
import dayjs from "dayjs"
import { $path } from "remix-routes"
import { getCookie, calendarTabCookie } from "~/server/cookies.server"

export async function loader({ request }: LoaderFunctionArgs) {
  const tab = await getCookie(request, calendarTabCookie)
  const today = dayjs()

  switch (tab) {
    case "months":
      return redirect(
        $path("/calendar/:year", {
          year: today.year(),
        }),
      )
    case "days":
    default:
      return redirect(
        $path("/calendar/:year/:month", {
          year: today.year(),
          month: today.month(),
        }),
        tab
          ? undefined
          : {
              headers: {
                "Set-Cookie": await calendarTabCookie.serialize("days"),
              },
            },
      )
  }
}
