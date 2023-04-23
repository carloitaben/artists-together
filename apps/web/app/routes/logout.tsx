import type { DataFunctionArgs } from "@vercel/remix"
import { authenticator } from "~/services/auth.server"

export async function action({ request }: DataFunctionArgs) {
  return await authenticator.logout(request, { redirectTo: "/" })
}
