import { ReactNode } from "react"

import Navbar from "~/components/Navbar"

import "./styles.css"
import { getUser } from "~/services/auth"

type Props = {
  children: ReactNode
}

export default async function Layout({ children }: Props) {
  const user = await getUser()

  return (
    <html lang="en" className="h-full">
      <body className="h-full min-h-full pl-16">
        <Navbar user={user} />
        {children}
      </body>
    </html>
  )
}
