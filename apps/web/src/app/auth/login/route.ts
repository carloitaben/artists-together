import { LuciaTokenError } from "@lucia-auth/tokens"
import { LuciaError } from "lucia-auth"
import { cookies } from "next/headers"
import { NextResponse } from "next/server"

import { auth, getOrCreateValidOtp, otpToken } from "~/lib/auth"

export async function POST(request: Request) {
  const form = await request.formData()
  const email = form.get("email")?.toString()

  if (!email) {
    throw Error("Missing email")
  }

  console.log("login", { email })

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

    console.log({
      email,
      key: key.userId,
    })

    const otp = await getOrCreateValidOtp(key.userId)

    console.log({
      email,
      otp: otp.toString(),
    })

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
