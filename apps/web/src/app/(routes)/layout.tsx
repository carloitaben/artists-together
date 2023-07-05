import { ReactNode } from "react"

import "~/styles/index.css"

import { getUser } from "~/services/auth"
import { getTheme, makeThemeStyle, Theme } from "~/lib/themes"
import { oneOf } from "~/lib/utils"
import Navbar from "~/components/Navbar"
import Toast from "~/components/Toast"

type Props = {
  children: ReactNode
}

export const runtime = "edge"

const themes = [
  Theme["anamorphic-teal"],
  Theme["arpeggio-black"],
  Theme["outsider-violet"],
  Theme["tuxedo-crimson"],
]

export default async function Layout({ children }: Props) {
  const user = await getUser()
  const theme = getTheme(oneOf(themes))
  const style = makeThemeStyle(theme)

  return (
    <html
      lang="en"
      className="h-full bg-theme-900 text-gunpla-white-50"
      style={style}
    >
      <body className="h-full min-h-full pl-16">
        <Toast>
          <Navbar user={user}>{children}</Navbar>
        </Toast>
      </body>
    </html>
  )
}
