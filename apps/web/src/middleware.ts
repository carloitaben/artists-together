import { getCookie, setCookie } from "@standard-cookie/next"
import type { NextRequest } from "next/server"
import { NextResponse } from "next/server"
import { cookieSessionOptions } from "./services/auth/server"

export async function middleware(request: NextRequest): Promise<NextResponse> {
  if (request.method === "GET") {
    const cookieSession = await getCookie(cookieSessionOptions)
    const response = NextResponse.next()

    if (cookieSession) {
      await setCookie(cookieSessionOptions, cookieSession)
    }

    return response
  }

  const originHeader = request.headers.get("Origin")
  const hostHeader =
    request.headers.get("Host") || request.headers.get("X-Forwarded-Host")

  if (originHeader === null || hostHeader === null) {
    return new NextResponse(null, {
      status: 403,
    })
  }

  let origin: URL

  try {
    origin = new URL(originHeader)
  } catch {
    return new NextResponse(null, {
      status: 403,
    })
  }

  if (origin.host !== hostHeader) {
    return new NextResponse(null, {
      status: 403,
    })
  }

  return NextResponse.next()
}
