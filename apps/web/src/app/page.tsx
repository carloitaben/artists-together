import { cookies } from "next/headers"
import { getRequestCookie } from "~/lib/getRequestCookie"
import Buttons from "./Buttons"

export default async function Home() {
  const user = await getRequestCookie(cookies())

  if (user) {
    return (
      <main>
        <div>Hola usuario {user.login}</div>
        <Buttons />
      </main>
    )
  }

  return (
    <main>
      <div>Hola anon</div>
      <Buttons />
    </main>
  )
}
