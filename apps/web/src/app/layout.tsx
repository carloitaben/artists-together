import "~/styles/index.css"
import { dehydrate, HydrationBoundary } from "@tanstack/react-query"
import { cx } from "cva"
import type { Metadata, Viewport } from "next"
import font from "next/font/local"
import type { PropsWithChildren } from "react"
import { lazy } from "react"
import Auth from "~/components/Auth"
import Cursors from "~/components/Cursors"
import Footer from "~/components/Footer"
import Html from "~/components/Html"
import Navigation from "~/components/Navigation"
import PageTransition from "~/components/PageTransition"
import Toasts from "~/components/Toasts"
import { userQueryOptions } from "~/features/auth/shared"
import { getHints } from "~/features/hints/server"
import { QueryProvider } from "~/features/query/client"
import { getQueryClient } from "~/features/query/shared"
import { WEB_URL } from "~/lib/constants"
import { PromiseProvider } from "~/lib/promises"
import { WebSocket } from "~/lib/websocket"
import { colors } from "~/tailwind.config"

const EnsureUppercaseSerifAmpersand =
  process.env.NODE_ENV === "development"
    ? lazy(() => import("~/components/EnsureUppercaseSerifAmpersand"))
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

export default async function Layout({ children }: PropsWithChildren) {
  const hints = getHints()
  const queryClient = getQueryClient()
  await queryClient.prefetchQuery(userQueryOptions)

  return (
    <Html
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
          <HydrationBoundary state={dehydrate(queryClient)}>
            <PromiseProvider hints={hints}>
              <PageTransition>
                <Navigation>
                  {children}
                  <Footer />
                </Navigation>
              </PageTransition>
              <Cursors>
                <Auth />
                <Toasts />
              </Cursors>
              <WebSocket />
            </PromiseProvider>
            <EnsureUppercaseSerifAmpersand />
          </HydrationBoundary>
        </QueryProvider>
      </body>
    </Html>
  )
}
