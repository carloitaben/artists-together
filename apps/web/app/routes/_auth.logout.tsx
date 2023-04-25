import type { DataFunctionArgs } from "@vercel/remix"
import { $path } from "remix-routes"
import { authenticator } from "~/services/auth.server"

export const config = { runtime: "edge" }

export async function action({ request }: DataFunctionArgs) {
  await authenticator.logout(request, { redirectTo: $path("/") })
}
