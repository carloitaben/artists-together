import type { ActionArgs } from "@vercel/remix"
import { json } from "@vercel/remix"

import { auth, otpToken } from "~/services/auth.server"

export const config = { runtime: "edge", regions: ["iad1"] }

export async function action({ request }: ActionArgs) {
  const headers = new Headers()
  const authRequest = auth.handleRequest(request, headers)
  const validation = await authRequest.validateUser()
  if (validation.session) {
    return json(null, {
      status: 401,
      headers,
    })
  }

  const formData = await request.formData()
  const email = formData.get("email")?.toString()
  const otp = formData.get("otp")?.toString()

  if (!email || !otp) {
    return json(null, { status: 400, headers })
  }

  try {
    const key = await auth.getKey("email", email)
    await otpToken.validate(otp, key.userId)
    const session = await auth.createSession(key.userId)
    authRequest.setSession(session)
    return json(null, { status: 200, headers })
  } catch (error) {
    console.error(error)
    return json(null, { status: 500, headers })
  }
}
