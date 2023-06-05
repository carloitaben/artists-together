import { LuciaTokenError } from "@lucia-auth/tokens"
import { cookies } from "next/headers"
import { NextResponse } from "next/server"

import { auth, otpToken } from "~/lib/auth"

export async function POST(request: Request) {
  const form = await request.formData()
  const otp = form.get("otp")?.toString()

  if (!otp) {
    throw Error("Missing otp")
  }

  const authRequest = auth.handleRequest({
    request,
    cookies,
  })

  const { user, session } = await authRequest.validateUser()

  console.log({
    user,
    session,
  })

  try {
    const u = await auth.getUser(user.userId)
    console.log({ u })
  } catch (error) {
    console.log("error getting user", error)
  }

  if (!session) {
    return NextResponse.json({ error: "Log in first!!!" }, { status: 400 })
  }

  try {
    await otpToken.validate(otp, session.userId)
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
