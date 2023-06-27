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
    return NextResponse.json(null, { status: 200 })
  } catch (error) {
    return NextResponse.json(null, { status: 500 })
  }
}
