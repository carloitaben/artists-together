import { LuciaTokenError } from "@lucia-auth/tokens"
import { cookies } from "next/headers"
import { NextResponse } from "next/server"

import { auth, otpToken } from "~/lib/auth"

export async function POST(request: Request) {
  const form = await request.formData()
  const email = form.get("email")?.toString()
  const otp = form.get("otp")?.toString()

  if (!email) {
    return NextResponse.json({ error: "Missing email" }, { status: 400 })
  }

  if (!otp) {
    return NextResponse.json({ error: "Missing OTP" }, { status: 400 })
  }

  const authRequest = auth.handleRequest({
    request,
    cookies,
  })

  const { session } = await authRequest.validateUser()

  if (session) {
    return NextResponse.json({ error: "Already logged in" }, { status: 400 })
  }

  try {
    const key = await auth.getKey("email", email)
    await otpToken.validate(otp, key.userId)
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
