import { cookies } from "next/headers"
import { NextResponse } from "next/server"
import { LuciaTokenError } from "@lucia-auth/tokens"

import { verifySchema } from "~/lib/schemas"
import { auth, otpToken } from "~/services/auth"

export const runtime = "edge"
export const preferredRegion = "iad1"

export async function POST(request: Request) {
  const data = verifySchema.parse(await request.json())

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
    return NextResponse.json({ success: true }, { status: 200 })
  } catch (error) {
    if (error instanceof LuciaTokenError && error.message === "EXPIRED_TOKEN") {
      return NextResponse.json({ error: "Expired code" }, { status: 401 })
    }

    if (error instanceof LuciaTokenError && error.message === "INVALID_TOKEN") {
      return NextResponse.json({ error: "Invalid code" }, { status: 400 })
    }

    console.error(error)
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    )
  }
}
