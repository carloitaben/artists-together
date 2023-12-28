import { json } from "@vercel/remix"
import type { ActionFunctionArgs } from "@vercel/remix"
import { auth } from "~/server/auth.server"

export async function action({ request }: ActionFunctionArgs) {
  const authRequest = auth.handleRequest(request)
  const session = await authRequest.validate()

  if (!session) {
    return json(null, {
      status: 400,
    })
  }

  if (!session.user.twitch_id) {
    return json(null, {
      status: 200,
    })
  }

  await auth.updateUserAttributes(session.user.userId, {
    twitch_id: null,
    twitch_metadata: null,
    twitch_username: null,
  })

  return json(null, {
    status: 200,
  })
}
