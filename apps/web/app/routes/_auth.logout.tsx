import type { DataFunctionArgs } from "@vercel/remix"
import { logout } from "~/services/auth.server"

export const config = { runtime: "edge" }

export async function action({ request }: DataFunctionArgs) {
  await logout(request)
}
