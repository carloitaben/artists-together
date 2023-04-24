import type { LoaderArgs } from "@vercel/remix"
import { useLoaderData } from "@remix-run/react"
import { authenticator } from "~/services/auth.server"
import { db, eq, users } from "db"

export async function loader({ request, params }: LoaderArgs) {
  if (!params.handle) throw Error("nooo")

  const auth = await authenticator.isAuthenticated(request).catch(console.error)
  const [user] = await db.select().from(users).limit(1).where(eq(users.handle, params.handle))

  if (!user)
    throw new Response(`User ${params.handle} not found`, {
      status: 404,
    })

  return {
    handle: params.handle,
    self: auth?.handle === params.handle,
    user,
  }
}

export default function Route() {
  const { handle, user, self } = useLoaderData<typeof loader>()

  return (
    <div>
      <h1>profile slug {handle}</h1>
      <div>email: {user.email}</div>
      {self && <div>you can view this because this is your profile!!!</div>}
    </div>
  )
}
