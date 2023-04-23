import type { DataFunctionArgs } from "@vercel/remix"

import { json } from "@vercel/remix"
import { Form, useLoaderData } from "@remix-run/react"
import { authenticator } from "~/services/auth.server"

export async function loader({ request }: DataFunctionArgs) {
  const user = await authenticator.isAuthenticated(request, {
    failureRedirect: "/login",
  })

  return json({ user })
}

export default function Account() {
  let { user } = useLoaderData<typeof loader>()

  return (
    <div style={{ fontFamily: "system-ui, sans-serif", lineHeight: "1.4" }}>
      <h1>{user ? `Welcome ${user.email}` : "Authenticate"}</h1>

      <Form action="/logout" method="post">
        <button>Log Out</button>
      </Form>
    </div>
  )
}
