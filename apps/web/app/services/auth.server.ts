import { Authenticator } from "remix-auth"
import { OTPStrategy } from "remix-auth-otp"
import type { User } from "db"
import { connect, eq, users, otps } from "db"

import { sessionStorage } from "./session.server"

export const authenticator = new Authenticator<User>(sessionStorage, {
  throwOnError: true,
})

authenticator.use(
  new OTPStrategy(
    {
      secret: process.env.SESSION_SECRET || "STRONG_SECRET",

      // Store encrypted code in database.
      // It should return a Promise<void>.
      storeCode: async (code) => {
        console.log("storeCode", { code })

        const db = connect()

        await db.insert(otps).values({
          active: true,
          attempts: 0,
          code,
        })
      },

      // Send code to the user.
      // It should return a Promise<void>.
      sendCode: async ({ email, code, magicLink, user, form, request }) => {
        console.log("sendCode", {
          email,
          code,
          magicLink,
          user,
          form,
          request,
        })

        console.log({
          code,
          magicLink,
        })
      },

      // Validate code.
      // It should return a Promise<{code: string, active: boolean, attempts: number}>.
      validateCode: async (code) => {
        const db = connect()

        const [otp] = await db
          .select({ code: otps.code, active: otps.active, attempts: otps.attempts })
          .from(otps)
          .limit(1)
          .where(eq(otps.code, code))

        console.log("validateCode", otp)

        if (!otp) throw new Error("OTP code not found.")
        if (otp.code == null) throw new Error("OTP code null.")
        if (otp.active == null) throw new Error("OTP active null.")
        if (otp.attempts == null) throw new Error("OTP attempts null.")

        return {
          code: otp.code,
          active: otp.active,
          attempts: otp.attempts,
        }
      },

      // Invalidate code.
      // It should return a Promise<void>.
      invalidateCode: async (code, active, attempts) => {
        const db = connect()

        if (!active) {
          await db.delete(otps).where(eq(otps.code, code))
        } else {
          await db.update(otps).set({ active, attempts }).where(eq(otps.code, code))
        }
      },
    },
    async ({ email, code, magicLink, form, request }) => {
      console.log("handler", {
        email,
        code,
        magicLink,
        form,
        request,
      })

      if (!form) throw Error("oops no form")

      // You can determine whether the user is authenticating
      // via OTP submission or Magic Link and run your own logic. (Optional)
      if (form) {
        console.log("OTP code form submission.")
      }

      if (magicLink) {
        console.log("Magic Link clicked.")
      }

      const db = connect()

      // Get user from database.
      const [user] = await db.select().from(users).limit(1).where(eq(users.email, email))

      if (!user) {
        const handle = form.get("handle")

        if (!handle) throw Error("could not find handle in form")

        await db.insert(users).values({
          handle: handle.toString(),
          email,
        })

        const [_user] = await db.select().from(users).limit(1).where(eq(users.email, email))

        return _user
      }

      return user
    }
  )
)
