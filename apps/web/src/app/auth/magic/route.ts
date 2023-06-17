import { LuciaTokenError } from "@lucia-auth/tokens"
import { userSchema } from "db"
import { cookies } from "next/headers"
import { NextResponse } from "next/server"
import { z } from "zod"

import { auth, otpToken } from "~/services/auth"

const schema = userSchema.pick({ email: true }).extend({
  otp: z.string().length(6),
})

export async function POST(request: Request) {
  const data = schema.parse(Object.fromEntries((await request.formData()).entries()))

  const authRequest = auth.handleRequest({
    request,
    cookies,
  })

  const { session } = await authRequest.validateUser()

  if (session) {
    return NextResponse.json({ error: "Already logged in" }, { status: 400 })
  }

  try {
    const key = await auth.getKey("email", data.email)
    await otpToken.validate(data.otp, key.userId)
    const session = await auth.createSession(key.userId)
    authRequest.setSession(session)
    return NextResponse.json({ ok: true })
  } catch (e) {
    if (e instanceof LuciaTokenError && e.message === "EXPIRED_TOKEN") {
      // expired password
      // generate new password and send new email
      console.log("expired token oopsie")
    }
    if (e instanceof LuciaTokenError && e.message === "INVALID_TOKEN") {
      // invalid username/password
      console.log("invalid user/token combo oopsie")
    }
  }
}
