import Link from "next/link"
import { cookies } from "next/headers"

import { auth } from "~/services/auth"

export const runtime = "edge"

export default async function Home() {
  const authRequest = auth.handleRequest({ cookies })
  const { user, session } = await authRequest.validateUser()

  return (
    <main>
      {user && (
        <h1>
          user: <pre>{JSON.stringify(user)}</pre>
        </h1>
      )}
      {session && (
        <h1>
          session: <pre>{JSON.stringify(session)}</pre>
        </h1>
      )}
      <Link href="/protected">Try to go to protected page</Link>
      <form method="post" action="/auth/login" className="p-12 m-12 bg-gunpla-white-400">
        <input type="email" name="email" placeholder="enter email..." />
        <button type="submit">log in</button>
      </form>
      <form method="post" action="/auth/magic" className="p-12 m-12 bg-gunpla-white-400">
        <input type="email" name="email" placeholder="enter email..." />
        <input type="text" name="otp" placeholder="enter otp..." />
        <button type="submit">submit otp</button>
      </form>
      <form method="post" action="/auth/signup" className="p-12 m-12 bg-gunpla-white-400">
        <input type="text" name="username" placeholder="@username" />
        <input type="email" name="email" placeholder="enter email..." />
        <button type="submit">sign up</button>
      </form>
      <form method="post" action="/auth/logout" className="p-12 m-12 bg-gunpla-white-400">
        <button type="submit">log out</button>
      </form>
    </main>
  )
}
