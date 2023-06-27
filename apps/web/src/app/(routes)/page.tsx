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
        action="/api/auth/login"
        className="m-12 bg-gunpla-white-400 p-12"
      >
        <input type="email" name="email" placeholder="enter email..." />
        <button type="submit">log in</button>
      </form>
      <OtpTestForm />
      <form
        method="post"
        action="/api/auth/signup"
        className="m-12 bg-gunpla-white-400 p-12"
      >
        <input type="text" name="username" placeholder="@username" />
        <input type="email" name="email" placeholder="enter email..." />
        <button type="submit">sign up</button>
      </form>
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
