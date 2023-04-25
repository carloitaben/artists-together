import { getIronSession } from "iron-session/edge"
import { NextResponse } from "next/server"

import { sessionOptions } from "~/lib/session"

export const runtime = "edge"
export const preferredRegion = "home"

export async function POST(request: Request) {
  const response = new NextResponse()
  const session = await getIronSession(request, response, sessionOptions)

  // get from db
  const user = {
    avatarUrl: "",
    isLoggedIn: true,
    login: "carlanga",
  }

  session.user = user
  await session.save()

  return response
}
