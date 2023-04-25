import type { DataFunctionArgs } from "@vercel/remix"
import { redirect, json } from "@vercel/remix"
import { Form, useLoaderData } from "@remix-run/react"

import { authenticator } from "~/services/auth.server"
import { getSession, commitSession } from "~/services/session.server"
import { $path } from "remix-routes"

export const config = { runtime: "edge" }

export async function loader({ request }: DataFunctionArgs) {
  const user = await authenticator.isAuthenticated(request)

  if (user) return redirect($path("/:username", { username: user.username }))

  const session = await getSession(request.headers.get("Cookie"))
  const hasSentEmail = session.has("auth:otp")

  const email = session.get("auth:email")
  const error = session.get(authenticator.sessionErrorKey)

  return json(
    { user, hasSentEmail, email, error },
    {
      headers: {
        "Set-Cookie": await commitSession(session),
      },
    }
  )
}

export async function action({ request }: DataFunctionArgs) {
  await authenticator.authenticate("OTP", request, {
    // User is not authenticated yet.
    // We want to redirect to the verify code form. (/verify-code or any other route)
    successRedirect: $path("/login"),
    // We want to display any possible error message.
    // Otherwise the ErrorBoundary / CatchBoundary will be triggered.
    failureRedirect: $path("/login"),
  })
}

export default function Login() {
  const { user, hasSentEmail, error } = useLoaderData<typeof loader>()

  return (
    <div style={{ fontFamily: "system-ui, sans-serif", lineHeight: "1.4" }}>
      {/* Renders any possible error messages. */}
      {error && <strong>Error: {error.message}</strong>}

      {/* Renders the form that sends the email. */}
      {!user && !hasSentEmail && (
        <Form method="post">
          <label htmlFor="email">Email</label>
          <input name="email" placeholder="Email" required />
          <button type="submit">Send Code</button>
        </Form>
      )}

      {/* Renders the form that verifies the code. */}
      {hasSentEmail && (
        <div style={{ display: "flex", flexDirection: "row" }}>
          <Form method="post">
            <label htmlFor="code">Code</label>
            <input type="text" name="code" placeholder="Insert code .." required />

            <button type="submit">Continue</button>
          </Form>

          {/* Renders the form that requests a new code. */}
          {/* Email input is not required, the email is already in Session. */}
          <Form method="post">
            <button type="submit">Request new Code</button>
          </Form>
        </div>
      )}
    </div>
  )
}
