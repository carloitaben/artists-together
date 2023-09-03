/* eslint-disable @next/next/no-before-interactive-script-outside-document */

import { ReactNode } from "react"
import { Metadata } from "next"
import Script from "next/script"

import "~/styles/index.css"

import { getSession } from "~/services/auth"
import { getThemeFromCookie, getThemeStyle } from "~/services/theme"

import { WebSocketProvider } from "~/hooks/ws"

import NavigationSideBar from "~/components/NavigationSideBar"
import NavigationBottomBar from "~/components/NavigationBottomBar"
import Icons from "~/components/Icons"
import Toast from "~/components/Toast"
import Cursors from "~/components/Cursors"
import Cursor from "~/components/Cursor"

export const runtime = "edge"

const metadataBase = process.env.VERCEL_URL
  ? `https://${process.env.VERCEL_URL}`
  : `http://localhost:${process.env.PORT || 3000}`

export const metadata: Metadata = {
  metadataBase: new URL(metadataBase),
  title: "Artists Together – Website soon!",
  description: "An inclusive community for all kinds of artists.",
  keywords: ["Art", "Artist Community"],
  twitter: {
    card: "summary_large_image",
  },
}

type Props = {
  children: ReactNode
}

export default async function Layout({ children }: Props) {
  const session = await getSession()
  const theme = await getThemeFromCookie()
  const style = getThemeStyle(theme)

  return (
    <html
      lang="en"
      className="h-full bg-theme-900 text-gunpla-white-50"
      style={style}
      suppressHydrationWarning
    >
      <body className="min-h-full pb-14 selection:bg-theme-300 selection:text-theme-900 sm:pb-0 sm:pl-16">
        <Icons />
        <NavigationSideBar />
        <WebSocketProvider user={session?.user}>
          {children}
          <Cursors user={session?.user} />
        </WebSocketProvider>
        <NavigationBottomBar />
        <Toast />
        <Cursor />
        <Script id="tailwindcss-noscript" strategy="beforeInteractive">
          {`(function(){typeof document !== "undefined" && document.documentElement.classList.add("js");}())`}
        </Script>
      </body>
    </html>
  )
}
