import { cookies } from "next/headers"
import { NextResponse } from "next/server"
import { LuciaTokenError } from "@lucia-auth/tokens"
import { LuciaError } from "lucia-auth"
import { userSchema } from "db"

import { auth, getOtp } from "~/services/auth"
import { sendEmail } from "~/services/email"
import { OtpEmail } from "~/emails/auth"

const schema = userSchema.pick({ email: true })

export const runtime = "nodejs"
export const preferredRegion = "iad1"

export async function POST(request: Request) {
  const data = schema.parse(
    Object.fromEntries((await request.formData()).entries())
  )

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
    const otp = await getOtp(key.userId)

    await sendEmail({
      to: data.email,
      subject: "Your login code",
      react: <OtpEmail otp={otp.toString()} />,
    })

    return NextResponse.json({ success: true }, { status: 200 })
  } catch (error) {
    if (
      error instanceof LuciaError &&
      error.message === "AUTH_INVALID_KEY_ID"
    ) {
      return NextResponse.json(
        { error: "User does not exist" },
        { status: 400 }
      )
    }

    if (
      error instanceof LuciaTokenError &&
      error.message === "INVALID_USER_ID"
    ) {
      return NextResponse.json(
        { error: "User does not exist" },
        { status: 400 }
      )
    }

    console.error(error)
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    )
  }
}
