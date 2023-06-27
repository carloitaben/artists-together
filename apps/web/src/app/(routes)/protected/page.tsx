import { redirect } from "next/navigation"

import { getAuth } from "~/services/auth"

export default async function Page() {
  const { user } = await getAuth()

  if (!user) redirect("/")

  return <div>protected page</div>
}
