import Link from "next/link"

import { getAuth } from "~/services/auth"

export const runtime = "edge"

export default async function Home() {
  const auth = await getAuth()

  return (
    <main>
      {auth.user && (
        <h1>
          user: <pre>{JSON.stringify(auth.user)}</pre>
        </h1>
      )}
      {auth.session && (
        <h1>
          session: <pre>{JSON.stringify(auth.session)}</pre>
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
