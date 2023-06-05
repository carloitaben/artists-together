import { cookies } from "next/headers"
import { NextResponse } from "next/server"

import { auth } from "~/lib/auth"

export async function POST(request: Request) {
  const authRequest = auth.handleRequest({
    request,
    cookies,
  })

  const { session } = await authRequest.validateUser()

  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  await auth.invalidateSession(session.sessionId)
  authRequest.setSession(null)

  // Redirect somewhere idk
  return NextResponse.json({ ok: true })
}
