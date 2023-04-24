import type { DataFunctionArgs } from "@vercel/remix"
import { authenticator } from "~/services/auth.server"

export async function action({ request }: DataFunctionArgs) {
  await authenticator.logout(request, { redirectTo: "/" })
}
