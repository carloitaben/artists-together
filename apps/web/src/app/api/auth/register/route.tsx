import { NextRequest, NextResponse } from "next/server"
import { cookies } from "next/headers"
import { connect, eq, user } from "db"
import { LuciaError } from "lucia"

import { signupSchema } from "~/lib/schemas"
import { auth, generateOneTimePassword } from "~/services/auth"
import { sendEmail } from "~/services/email"
import { OtpEmail } from "~/emails/auth"

export const runtime = "nodejs"
export const preferredRegion = "iad1"

export async function POST(request: NextRequest) {
  const data = signupSchema.parse(await request.json())
  const session = await auth.handleRequest({ request, cookies }).validate()

  if (session) {
    return NextResponse.json(
      { error: "You are already logged in" },
      { status: 400 }
    )
  }

  const db = connect()

  const [userWithUsername] = await db
    .select({ id: user.id })
    .from(user)
    .where(eq(user.username, data.username))
    .limit(1)

  if (userWithUsername) {
    return NextResponse.json(
      { error: "Username already exists" },
      { status: 403 }
    )
  }

  try {
    const user = await auth.createUser({
      key: {
        providerId: "email",
        providerUserId: data.email,
        password: null,
      },
      attributes: {
        bio: null,
        email: data.email,
        username: data.username,
      },
    })

    const otp = await generateOneTimePassword(user.userId)

    await sendEmail({
      to: data.email,
      subject: "Your login code",
      react: <OtpEmail otp={otp.toString()} />,
    })

    return NextResponse.json(null, { status: 200 })
  } catch (error) {
    if (
      error instanceof LuciaError &&
      error.message === "AUTH_DUPLICATE_KEY_ID"
    ) {
      return NextResponse.json(
        { error: "An account with that email already exists" },
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
