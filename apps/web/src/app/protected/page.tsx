import { cookies } from "next/headers"
import { redirect } from "next/navigation"

import { auth } from "~/lib/auth"

export default async function Page() {
  const authRequest = auth.handleRequest({ cookies })
  const { user } = await authRequest.validateUser()

  if (!user) redirect("/")

  return <div>protected page</div>
}
