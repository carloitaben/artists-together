"use server"

import { cookies } from "next/headers"
import { connect, eq, user } from "db"
import { LuciaError } from "lucia"

import { serverError, action } from "~/actions/client"
import {
  auth,
  generateOneTimePassword,
  validateOneTimePassword,
} from "~/services/auth"
import {
  registerSchema,
  loginSchema,
  verifySchema,
  logoutSchema,
} from "~/actions/schemas"

export const register = action(registerSchema, async (data) => {
  const request = auth.handleRequest({ request: null, cookies })
  const session = await request.validate()

  if (session) {
    return serverError("ALREADY_LOGGED_IN")
  }

  const db = connect()

  const [userWithUsername] = await db
    .select({ id: user.id })
    .from(user)
    .where(eq(user.username, data.username))
    .limit(1)

  if (userWithUsername) {
    return serverError("USERNAME_ALREADY_EXISTS")
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

    console.log(otp)

    return {
      success: true,
    }
  } catch (error) {
    if (
      error instanceof LuciaError &&
      error.message === "AUTH_DUPLICATE_KEY_ID"
    ) {
      return serverError("EMAIL_ALREADY_USED")
    }

    throw error
  }
})

export const login = action(loginSchema, async (data) => {
  const request = auth.handleRequest({ request: null, cookies })
  const session = await request.validate()

  if (session) {
    return serverError("ALREADY_LOGGED_IN")
  }

  try {
    const key = await auth.getKey("email", data.email)
    const otp = await generateOneTimePassword(key.userId)

    console.log(otp)
    // await sendEmail({
    //   to: data.email,
    //   subject: "Your login code",
    //   react: <OtpEmail otp={otp} />,
    // })

    return {
      success: true,
    }
  } catch (error) {
    if (
      error instanceof LuciaError &&
      error.message === "AUTH_INVALID_KEY_ID"
    ) {
      return serverError("USER_DOES_NOT_EXIST")
    }

    throw error
  }
})

export const verify = action(verifySchema, async (data) => {
  const request = auth.handleRequest({ request: null, cookies })
  const session = await request.validate()

  if (session) {
    return serverError("ALREADY_LOGGED_IN")
  }

  try {
    const key = await auth.getKey("email", data.email)
    const otp = await validateOneTimePassword(key.userId, data.otp)
    const session = await auth.createSession({
      userId: otp,
      attributes: {},
    })

    request.setSession(session)

    return {
      success: true,
    }
  } catch (error) {
    throw error
  }
})

export const logout = action(logoutSchema, async (data) => {
  const request = auth.handleRequest({ request: null, cookies })
  const session = await request.validate()

  if (!session) {
    return serverError("UNAUTHORIZED")
  }

  await auth.invalidateSession(session.sessionId)
  request.setSession(null)

  return {
    success: true,
  }
})
