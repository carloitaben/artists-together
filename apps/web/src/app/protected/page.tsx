import { redirect } from "next/navigation"

import { getSession } from "~/lib/auth"

export const runtime = "edge"

export default async function Page() {
  const { user } = await getSession()

  if (!user) redirect("/")

  return <div>protected page</div>
}
