import { redirect } from "@remix-run/node"

export function guardDisabledRoute() {
  if (import.meta.env.PROD) {
    throw redirect("/404")
  }
}
