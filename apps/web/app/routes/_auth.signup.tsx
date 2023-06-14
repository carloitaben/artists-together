import type { DataFunctionArgs } from "@vercel/remix"
import { redirect, json } from "@vercel/remix"
import { Form, useFetcher, useLoaderData } from "@remix-run/react"

import { login, logout, signup, validate } from "~/services/auth.server"
import { $path } from "remix-routes"

export const config = { runtime: "edge" }

export async function loader({ request }: DataFunctionArgs) {
  // const user = await authenticator.isAuthenticated(request)
  // if (user) return redirect($path("/:username", { username: user.username }))
  // const session = await getSession(request.headers.get("Cookie"))
  // const hasSentEmail = session.has("auth:otp")
  // const email = session.get("auth:email")
  // const error = session.get(authenticator.sessionErrorKey)
  // return json(
  //   { user, hasSentEmail, email, error },
  //   {
  //     headers: {
  //       "Set-Cookie": await commitSession(session),
  //     },
  //   }
  // )
}

export async function action({ request }: DataFunctionArgs) {
  await signup(request)
}

export default function Login() {
  const fetcher = useFetcher()

  console.log(fetcher)

  return (
    <div>
      <fetcher.Form method="post">
        <input name="username">username</input>
        <input name="email">email</input>
        <button type="submit">Submit</button>
      </fetcher.Form>
    </div>
  )
}
