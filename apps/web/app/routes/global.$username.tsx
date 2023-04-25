import type { LoaderArgs } from "@vercel/remix"
import { Form, useLoaderData } from "@remix-run/react"
import { connect, eq, users } from "db"

import { authenticator } from "~/services/auth.server"

export const config = { runtime: "edge" }

export async function loader({ request, params }: LoaderArgs) {
  if (!params.username) throw Error("nooo")

  const db = connect()
  const session = await authenticator.isAuthenticated(request)
  const [user] = await db.select().from(users).limit(1).where(eq(users.username, params.username))

  if (!user)
    throw new Response(`User ${params.username} not found`, {
      status: 404,
    })

  return {
    username: params.username,
    self: session?.username === params.username,
    user,
  }
}

export default function Route() {
  const { username, user, self } = useLoaderData<typeof loader>()

  return (
    <div>
      <h1>profile slug {username}</h1>
      <div>email: {user.email}</div>
      {self && (
        <Form action="/logout" method="post">
          <button>Log Out</button>
        </Form>
      )}
    </div>
  )
}
