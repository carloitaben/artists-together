import { json, type LoaderArgs } from "@vercel/remix"
import { auth } from "~/services/auth.server"

export const config = { runtime: "edge" }

export async function loader(params: LoaderArgs) {
  console.log("running LOGOUT loader")
  return "something"
}

export async function action({ request }: LoaderArgs) {
  const headers = new Headers()
  const authRequest = auth.handleRequest(request, headers)
  const { session } = await authRequest.validateUser()
  if (!session) {
    return json(null, {
      status: 401,
      headers,
    })
  }
  await auth.invalidateSession(session.sessionId)
  authRequest.setSession(null)
  return json(null, { status: 200, headers })
}
