import type { DataFunctionArgs } from "@vercel/remix"
import { redirect } from "@vercel/remix"

import { authenticator } from "~/services/auth.server"

export const config = { runtime: "edge" }

export async function loader({ request }: DataFunctionArgs) {
  const user = await authenticator.authenticate("OTP", request, {
    failureRedirect: "/login",
  })

  if (user) return redirect(`/${user.handle}`)
}
