import { cookies } from "next/headers"
import { NextRequest, NextResponse } from "next/server"

import { verifySchema } from "~/lib/schemas"
import { auth, validateOneTimePassword } from "~/services/auth"

export const runtime = "edge"
export const preferredRegion = "iad1"

export async function POST(request: NextRequest) {
  const data = verifySchema.parse(await request.json())
  const session = await auth.handleRequest({ request, cookies }).validate()

  if (session) {
    return NextResponse.json(
      { error: "You are already logged in" },
      { status: 400 }
    )
  }

  try {
    const key = await auth.getKey("email", data.email)
    const otp = await validateOneTimePassword(key.userId, data.otp)

    const session = await auth.createSession({
      userId: otp,
      attributes: {},
    })

    const authRequest = auth.handleRequest({
      request,
      cookies,
    })

    authRequest.setSession(session)
    return NextResponse.json({ success: true }, { status: 200 })
  } catch (error) {
    console.error(error)
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    )
  }
}
