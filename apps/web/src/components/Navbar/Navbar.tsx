import { ReactNode } from "react"

import { User } from "~/services/auth"

import NavbarDesktop from "./NavbarDesktop"
import NavbarMobile from "./NavbarMobile"

type Props = {
  user: User
  children: ReactNode
}

export default function Navbar({ user, children }: Props) {
  return (
    <>
      <NavbarDesktop user={user} />
      {children}
      <NavbarMobile user={user} />
    </>
  )
}
