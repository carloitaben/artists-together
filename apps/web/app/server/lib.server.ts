import { redirect } from "@vercel/remix"

export function guardDisabledRoute() {
  if (import.meta.env.PROD) {
    throw redirect("/404")
  }
}
