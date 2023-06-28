import Link from "next/link"
import OtpTestForm from "~/components/OtpTestForm"

import { getUser } from "~/services/auth"

export default async function Home() {
  const user = await getUser()

  return (
    <main>
      {user && (
        <h1>
          user: <pre>{JSON.stringify(user, null, 2)}</pre>
        </h1>
      )}
      <Link href="/protected">Try to go to protected page</Link>
      <form
        method="post"
        action="/api/auth/logout"
        className="m-12 bg-gunpla-white-400 p-12"
      >
        <button type="submit">log out</button>
      </form>
    </main>
  )
}
