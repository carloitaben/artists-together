import type { DataFunctionArgs } from "@vercel/remix"
import { authenticator } from "~/services/auth.server"

export const config = { runtime: "edge" }

export async function loader({ request }: DataFunctionArgs) {
  await authenticator.authenticate("OTP", request, {
    successRedirect: "/account",
    failureRedirect: "/login",
  })
}
