import font from "next/font/local"
import type { Metadata, Viewport } from "next"
import type { PropsWithChildren } from "react"
import { lazy } from "react"
import { cx } from "cva"
import { WEB_URL } from "~/lib/constants"
import { colors } from "~/../tailwind.config"
import { getUser } from "~/services/auth/server"
import { getHints } from "~/services/hints/server"
import { QueryProvider } from "~/services/query/client"
import { PromiseProvider } from "~/lib/promises"
import { WebSocket } from "~/lib/websocket"
import Auth from "~/components/Auth"
import Cursors from "~/components/Cursors"
import Footer from "~/components/Footer"
import Navigation from "~/components/Navigation"
import PageTransition from "~/components/PageTransition"
import Toasts from "~/components/Toasts"
import "~/styles/index.css"

const EnsureUppercaseSerifAmpersand =
  process.env.NODE_ENV === "development"
    ? lazy(() => import("~/components/EnsureUppercaseSerifAmpersand"))
    : () => null

const QueryDevtools =
  process.env.NODE_ENV === "development"
    ? lazy(() =>
        import("@tanstack/react-query-devtools").then((module) => ({
          default: module.ReactQueryDevtools,
        })),
      )
    : () => null

const inter = font({
  src: "../assets/fonts/inter.woff2",
  variable: "--font-inter",
  display: "block",
  preload: true,
})

const fraunces = font({
  src: "../assets/fonts/fraunces.woff2",
  variable: "--font-fraunces",
  display: "block",
  preload: true,
})

export const viewport: Viewport = {
  themeColor: colors["arpeggio-black"][900],
  colorScheme: "dark",
}

export const metadata: Metadata = {
  title: {
    default: "Artists Together",
    template: "%s – Artists Together",
  },
  description: "An inclusive community for all kinds of artists.",
  keywords: ["Art", "Artist Community"],
  openGraph: {
    title: "Artists Together",
    description: "An inclusive community for all kinds of artists.",
    siteName: "Artists Together",
    locale: "en",
    type: "website",
    url: WEB_URL,
  },
  robots: {
    index: process.env.VERCEL_ENV === "production",
    follow: process.env.VERCEL_ENV === "production",
  },
}

export const runtime = "edge"

export default async function Layout({ children }: PropsWithChildren) {
  const user = getUser()
  const hints = getHints()

  return (
    <html
      lang="en"
      className={cx(
        inter.variable,
        fraunces.variable,
        "relative min-h-full scroll-p-0 font-inter antialiased",
        "theme-arpeggio-black bg-arpeggio-black-900 text-gunpla-white-50",
        "selection:bg-arpeggio-black-300 selection:text-arpeggio-black-900",
      )}
    >
      <body className="size-full min-h-full min-w-fit text-sm sm:pl-16">
        <QueryProvider>
          <PromiseProvider user={user} hints={hints}>
            <PageTransition>
              <Navigation>
                {children}
                <Footer />
              </Navigation>
            </PageTransition>
            <Auth />
            <Toasts />
            <Cursors />
            <WebSocket />
          </PromiseProvider>
          <EnsureUppercaseSerifAmpersand />
          <QueryDevtools buttonPosition="top-right" />
        </QueryProvider>
      </body>
    </html>
  )
}
