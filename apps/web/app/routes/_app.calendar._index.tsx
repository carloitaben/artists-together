import type { LoaderFunctionArgs } from "@remix-run/node"
import { redirect } from "@remix-run/node"
import {
  getCookie,
  calendarTabCookie,
  calendarTabCookieDefaultValue,
} from "~/server/cookies.server"

export async function loader({ request }: LoaderFunctionArgs) {
  const tab = await getCookie(request, calendarTabCookie)

  if (tab) {
    return redirect(tab)
  } else {
    return redirect("days", {
      headers: {
        "Set-Cookie": await calendarTabCookie.serialize(
          calendarTabCookieDefaultValue,
        ),
      },
    })
  }
}
