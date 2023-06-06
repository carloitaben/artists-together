import { LuciaTokenError } from "@lucia-auth/tokens"
import { LuciaError } from "lucia-auth"
import { cookies } from "next/headers"
import { NextResponse } from "next/server"
import { userSchema } from "db"

import { auth, getOrCreateValidOtp } from "~/services/auth"

const schema = userSchema.pick({ email: true })

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
    const otp = await getOrCreateValidOtp(key.userId)

    console.log(`Send to email ${data.email} otp code: ${otp.toString()}`)
    return NextResponse.json({ ok: true })
  } catch (error) {
    if (error instanceof LuciaError && error.message === "AUTH_INVALID_KEY_ID") {
      return NextResponse.json({ error: "User does not exist" }, { status: 400 })
    }

    if (error instanceof LuciaTokenError && error.message === "INVALID_USER_ID") {
      return NextResponse.json({ error: "User does not exist" }, { status: 400 })
    }

    console.error(error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
