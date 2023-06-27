import { cookies } from "next/headers"
import { NextResponse } from "next/server"
import { LuciaTokenError } from "@lucia-auth/tokens"
import { userSchema } from "db"
import { z } from "zod"

import { auth, otpToken } from "~/services/auth"

const schema = userSchema.pick({ email: true }).extend({
  otp: z.string().length(6),
})

export async function POST(request: Request) {
  const data = schema.parse(await request.json())

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
    return NextResponse.json(null, { status: 200 })
  } catch (error) {
    if (error instanceof LuciaTokenError && error.message === "EXPIRED_TOKEN") {
      return NextResponse.json({ error: "Expired token" }, { status: 401 })
    }

    if (error instanceof LuciaTokenError && error.message === "INVALID_TOKEN") {
      return NextResponse.json(
        { error: "Invalid username or code" },
        { status: 400 }
      )
    }

    return NextResponse.json(null, { status: 500 })
  }
}
