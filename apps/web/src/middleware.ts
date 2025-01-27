import type { NextRequest } from "next/server"
import { NextResponse } from "next/server"
import { getCookieSession } from "./services/auth/server"

export async function middleware(request: NextRequest): Promise<NextResponse> {
  if (request.method === "GET") {
    const cookieSession = await getCookieSession()
    const cookieSessionValue = cookieSession.get()
    const response = NextResponse.next()

    if (cookieSessionValue.success) {
      cookieSession.set(cookieSessionValue.output)
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
