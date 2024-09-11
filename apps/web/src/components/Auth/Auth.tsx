import { authenticator } from "@artists-together/core/auth"
import { Dialog } from "@ark-ui/react"
import type { ReactNode } from "react"
import { cookies } from "next/headers"
import { authenticate } from "~/services/auth/server"
import Scrim from "~/components/Scrim"
import Root from "./Root"
import Profile from "./Profile"
import Login from "./Login"

type Props = {
  children: ReactNode
}

export default async function Auth({ children }: Props) {
  const auth = await authenticate()

  const authCookie = auth.session
    ? authenticator.createSessionCookie(auth.session.id, auth.session.expiresAt)
    : authenticator.createBlankSessionCookie()

  try {
    cookies().set("test", Math.random().toString())

    cookies().set(
      authCookie.name,
      authCookie.value,
      authCookie.npmCookieOptions(),
    )
  } catch {
    // Next.js throws when trying to set a cookie during render
  }

  return (
    <Root>
      {children}
      <Dialog.Backdrop asChild>
        <Scrim className="z-50" />
      </Dialog.Backdrop>
      <Dialog.Positioner className="fixed inset-0 z-50 grid size-full scroll-p-1 place-items-center overflow-y-auto p-1 sm:scroll-p-12 sm:p-12">
        {auth.user ? <Profile /> : <Login />}
      </Dialog.Positioner>
    </Root>
  )
}
