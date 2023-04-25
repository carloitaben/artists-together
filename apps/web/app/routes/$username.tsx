import type { ActionArgs, LoaderArgs } from "@vercel/remix"
import { Form, useLoaderData } from "@remix-run/react"
import { $params } from "remix-routes"
import { connect, eq, users } from "db"

import { authenticator } from "~/services/auth.server"

export const config = { runtime: "edge", regions: ["iad1"] }

export async function loader({ request, params }: LoaderArgs) {
  const { username } = $params("/:username", params)

  const db = connect()
  const session = await authenticator.isAuthenticated(request)
  const [user] = await db.select().from(users).limit(1).where(eq(users.username, username))

  if (!user)
    throw new Response(`User ${username} not found`, {
      status: 404,
    })

  return {
    username: username,
    self: session?.username === username,
    user,
  }
}

export async function action({ request, params }: ActionArgs) {
  const { username } = $params("/:username", params)

  const session = await authenticator.isAuthenticated(request, {
    failureRedirect: "/login",
  })

  if (session.username !== username) throw Error("no podés")

  const form = await request.formData()
  const bio = form.get("bio")?.toString()

  const db = connect()
  await db.update(users).set({
    bio,
  })

  return null
}

export default function Route() {
  const { username, user, self } = useLoaderData<typeof loader>()

  return (
    <div>
      <h1>profile slug {username}</h1>
      <div>email: {user.email}</div>
      {!self && user.bio && <p>bio: {user.bio}</p>}
      {self && (
        <>
          <Form method="post">
            <textarea name="bio" defaultValue={user.bio || ""} placeholder="write your bio here" />
            <button>Edit bio</button>
          </Form>
          <Form action="/logout" method="post">
            <button>Log Out</button>
          </Form>
        </>
      )}
    </div>
  )
}
