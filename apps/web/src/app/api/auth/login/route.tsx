import { NextRequest, NextResponse } from "next/server"
import { cookies } from "next/headers"

import { loginSchema } from "~/lib/schemas"
import { auth, generateOneTimePassword } from "~/services/auth"
import { sendEmail } from "~/services/email"
import { OtpEmail } from "~/emails/auth"
import { LuciaError } from "lucia"

export const runtime = "nodejs"
export const preferredRegion = "iad1"

export async function POST(request: NextRequest) {
  const data = loginSchema.parse(await request.json())
  const session = await auth.handleRequest({ request, cookies }).validate()

  if (session) {
    return NextResponse.json(
      { error: "You are already logged in" },
      { status: 400 }
    )
  }

  try {
    const key = await auth.getKey("email", data.email)
    const otp = await generateOneTimePassword(key.userId)

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

    console.error(error)
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    )
  }
}
