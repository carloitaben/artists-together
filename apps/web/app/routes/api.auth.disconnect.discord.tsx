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

  if (!session.user.discord_id) {
    return json(null, {
      status: 200,
    })
  }

  await auth.updateUserAttributes(session.user.userId, {
    discord_id: null,
    discord_metadata: null,
    discord_username: null,
  })

  return json(null, {
    status: 200,
  })
}
