import { ReactNode } from "react"
import { Metadata } from "next"

import "~/styles/index.css"

import { getUser } from "~/services/auth"
import { getTheme, makeThemeStyle, Theme } from "~/lib/themes"
import { oneOf } from "~/lib/utils"

import NavigationSideBar from "~/components/NavigationSideBar"
import NavigationBottomBar from "~/components/NavigationBottomBar"
import Toast from "~/components/Toast"

type Props = {
  children: ReactNode
}

export const runtime = "edge"

export const metadata: Metadata = {
  title: "Artists Together – Website soon!",
  description: "An inclusive community for all kinds of artists.",
  keywords: ["Art", "Artist Community"],
  twitter: {
    card: "summary_large_image",
  },
}

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
          <NavigationSideBar user={user} />
          {children}
          <NavigationBottomBar user={user} />
        </Toast>
      </body>
    </html>
  )
}
