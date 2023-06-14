import lucia from "lucia-auth"
import { generateRandomString } from "lucia-auth"
import { web } from "lucia-auth/middleware"
import { planetscale } from "@lucia-auth/adapter-mysql"
import { passwordToken } from "@lucia-auth/tokens"
import { json } from "@vercel/remix"
import { createConnection } from "db"

const connection = createConnection()

export const auth = lucia({
  adapter: planetscale(connection),
  middleware: web(),
  env: process.env.NODE_ENV === "production" ? "PROD" : "DEV",
})

export type Auth = typeof auth

export const otpToken = passwordToken(auth, "otp", {
  expiresIn: 15 * 60, // 15 minutes
  generate: () => generateRandomString(6, "0123456789"),
})

export async function getOrCreateValidOtp(id: string) {
  const existingOtp = await otpToken.getUserTokens(id).then((tokens) => tokens.find((token) => !token.expired))
  if (existingOtp) return existingOtp
  return otpToken.issue(id)
}

export async function signup(request: Request) {
  const headers = new Headers()
  const authRequest = auth.handleRequest(request, headers)
  const validation = await authRequest.validateUser()
  if (validation.session) {
    return json(null, {
      status: 401,
      headers,
    })
  }

  const formData = await request.formData()
  const email = formData.get("email")?.toString()
  const username = formData.get("username")?.toString()

  if (!email || !username) {
    return json(null, { status: 400, headers })
  }

  try {
    const key = await auth.getKey("email", email)
    const otp = await getOrCreateValidOtp(key.userId)
    console.log(`Send to email ${email} otp code: ${otp.toString()}`)
    return json(null, { status: 200, headers })
  } catch (error) {
    console.error(error)
    return json(null, { status: 500, headers })
  }
}

export async function login(request: Request) {
  const headers = new Headers()
  const authRequest = auth.handleRequest(request, headers)
  const validation = await authRequest.validateUser()
  if (validation.session) {
    return json(null, {
      status: 401,
      headers,
    })
  }

  const formData = await request.formData()
  const email = formData.get("email")?.toString()

  if (!email) {
    return json(null, { status: 400, headers })
  }

  try {
    const key = await auth.getKey("email", email)
    const otp = await getOrCreateValidOtp(key.userId)
    console.log(`Send to email ${email} otp code: ${otp.toString()}`)
    return json(null, { status: 200, headers })
  } catch (error) {
    console.error(error)
    return json(null, { status: 500, headers })
  }
}

export async function logout(request: Request) {
  const headers = new Headers()
  const authRequest = auth.handleRequest(request, headers)
  const { session } = await authRequest.validateUser()
  if (!session) {
    return json(null, {
      status: 401,
      headers,
    })
  }
  await auth.invalidateSession(session.sessionId)
  authRequest.setSession(null)
  return json(null, { status: 200, headers })
}

export async function validate(request: Request) {
  const headers = new Headers()
  const authRequest = auth.handleRequest(request, headers)
  const validation = await authRequest.validateUser()
  if (validation.session) {
    return json(null, {
      status: 401,
      headers,
    })
  }

  const formData = await request.formData()
  const email = formData.get("email")?.toString()
  const otp = formData.get("otp")?.toString()

  if (!email || !otp) {
    return json(null, { status: 400, headers })
  }

  try {
    const key = await auth.getKey("email", email)
    await otpToken.validate(otp, key.userId)
    const session = await auth.createSession(key.userId)
    authRequest.setSession(session)
    return json(null, { status: 200, headers })
  } catch (error) {
    console.error(error)
    return json(null, { status: 500, headers })
  }
}
