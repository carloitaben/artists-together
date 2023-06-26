import type { ActionArgs } from "@vercel/remix"
import { json } from "@vercel/remix"

import { auth, getOrCreateValidOtp } from "~/services/auth.server"
import { sendEmail } from "~/services/email.server"
import { OtpEmail } from "~/emails/auth.server"

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

  if (!email) {
    return json(null, { status: 400, headers })
  }

  try {
    const key = await auth.getKey("email", email)
    const otp = await getOrCreateValidOtp(key.userId)

    await sendEmail({
      to: email,
      subject: "Your login code",
      react: <OtpEmail otp={otp.toString()} />,
    })

    return json(null, { status: 200, headers })
  } catch (error) {
    console.error(error)
    return json(null, { status: 500, headers })
  }
}
