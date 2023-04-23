// app/services/auth.server.ts
import { Authenticator } from "remix-auth"
import { OTPStrategy } from "remix-auth-otp"
import { Resend } from "resend"

import type { User } from "db"
import { db, eq, users, otp } from "db"

import { sessionStorage } from "./session.server"

// Create an instance of the authenticator, pass a generic with what
// strategies will return and will store in the session
export const authenticator = new Authenticator<User>(sessionStorage, {
  throwOnError: true,
})

// Tell the Authenticator to use the form strategy
authenticator.use(
  new OTPStrategy(
    {
      secret: "STRONG_SECRET",

      // Store encrypted code in database.
      // It should return a Promise<void>.
      storeCode: async (code) => {
        console.log("storeCode", { code })

        await db.insert(otp).values({
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

        const resend = new Resend(process.env["RESEND_API_KEY"])

        await resend.sendEmail({
          // from: "localhost@example.com",
          from: "onboarding@resend.dev",
          to: email,
          subject: "Here's your OTP Code.",
          html: `
            <!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
            <html>
              <head>
                <meta http-equiv="Content-Type" content="text/html charset=UTF-8" />
              </head>
              <body>
                <h1>Code: ${code}</h1>
                ${magicLink && `<p>Alternatively, you can click the Magic Link: ${magicLink}</p>`}
              </body>
            </html>
          `,
        })
      },

      // Validate code.
      // It should return a Promise<{code: string, active: boolean, attempts: number}>.
      validateCode: async (code) => {
        const [_otp] = await db
          .select({ code: otp.code, active: otp.active, attempts: otp.attempts })
          .from(otp)
          .limit(1)
          .where(eq(otp.code, code))

        console.log("validateCode", _otp)

        if (!_otp) throw new Error("OTP code not found.")
        if (_otp.code == null) throw new Error("OTP code null.")
        if (_otp.active == null) throw new Error("OTP active null.")
        if (_otp.attempts == null) throw new Error("OTP attempts null.")

        return {
          code: _otp.code,
          active: _otp.active,
          attempts: _otp.attempts,
        }
      },

      // Invalidate code.
      // It should return a Promise<void>.
      invalidateCode: async (code, active, attempts) => {
        if (!active) {
          await db.delete(otp).where(eq(otp.code, code))
        } else {
          await db.update(otp).set({ active, attempts }).where(eq(otp.code, code))
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

      // Get user from database.
      const [user] = await db.select().from(users).limit(1).where(eq(users.email, email))

      if (!user) {
        const handle = form.get("handle")

        if (!handle) throw Error("could not find handle in form")

        await db.insert(users).values({
          handle: "",
          email,
        })

        const [_user] = await db.select().from(users).limit(1).where(eq(users.email, email))

        return _user
      }

      // Return user as Session.
      return user
    }
  )
)
