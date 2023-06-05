import { LuciaError } from "lucia-auth"
import { cookies } from "next/headers"
import { NextResponse } from "next/server"

import { auth, otpToken } from "~/lib/auth"

export async function POST(request: Request) {
  const form = await request.formData()
  const username = form.get("username")?.toString()
  const email = form.get("email")?.toString()

  if (!username) {
    return NextResponse.json({ error: "Missing username" }, { status: 400 })
  }

  if (!email) {
    return NextResponse.json({ error: "Missing email" }, { status: 400 })
  }

  const authRequest = auth.handleRequest({
    request,
    cookies,
  })

  const validation = await authRequest.validateUser()

  if (validation.session) {
    return NextResponse.json({ error: "Already logged in" }, { status: 400 })
  }

  try {
    const user = await auth.createUser({
      primaryKey: {
        providerId: "email",
        providerUserId: email,
        password: null,
      },
      attributes: {
        email,
        username,
      },
    })

    const session = await auth.createSession(user.userId)
    authRequest.setSession(session)

    const otp = await otpToken.issue(user.userId)

    console.log({
      email,
      otp: otp.toString(),
    })

    return NextResponse.json({ ok: true })
  } catch (error) {
    console.error(error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
