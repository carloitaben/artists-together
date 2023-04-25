import { getIronSession } from "iron-session/edge"
import { NextResponse } from "next/server"

import { sessionOptions } from "~/lib/session"

export const runtime = "edge"

export async function POST(request: Request) {
  const response = new NextResponse()
  const session = await getIronSession(request, response, sessionOptions)

  session.destroy()

  return response
}
