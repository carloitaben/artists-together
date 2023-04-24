import type { DataFunctionArgs } from "@vercel/remix"
import { redirect } from "@vercel/remix"

import { authenticator } from "~/services/auth.server"

export async function loader({ request }: DataFunctionArgs) {
  const session = await authenticator.isAuthenticated(request, {
    failureRedirect: "/login",
  })

  return redirect(session.handle)
}
