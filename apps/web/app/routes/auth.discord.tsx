import type { LoaderFunctionArgs } from "@remix-run/node"
import { redirect } from "@remix-run/node"
import { auth } from "~/services/auth.server"
import { fromCookie } from "~/services/cookies.server"

export async function loader({ request }: LoaderFunctionArgs) {
  const error = new URL(request.url).searchParams.get("error")
  const from = (await fromCookie.parse(request.headers.get("Cookie"))) || "/"

  if (error) {
    switch (error) {
      case "access_denied":
        return redirect(from + "?modal=auth")
      default:
        return redirect(from + "?modal=auth&error=true")
    }
  }

  return auth.authenticate("discord", request, {
    successRedirect: from,
  })
}
