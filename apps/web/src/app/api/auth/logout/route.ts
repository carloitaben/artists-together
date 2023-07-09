import { cookies } from "next/headers"
import { NextResponse } from "next/server"

import { auth } from "~/services/auth"

export const runtime = "edge"

export async function POST(request: Request) {
  const authRequest = auth.handleRequest({
    request,
    cookies,
  })

  const { session } = await authRequest.validateUser()

  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  try {
    await auth.invalidateSession(session.sessionId)
    authRequest.setSession(null)
    return NextResponse.json({ success: true }, { status: 200 })
  } catch (error) {
    console.error(error)
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    )
  }
}
