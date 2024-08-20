import font from "next/font/local"
import type { Metadata } from "next"
import type { ReactNode } from "react"
import { cx } from "cva"
import { WEB_URL } from "@artists-together/core/constants"
import { HintsContextProvider } from "~/lib/headers/server"
import Footer from "~/components/Footer"
import Theme from "~/components/Theme"
import Sidebar from "~/components/Sidebar"
import "~/styles/index.css"

export const runtime = "edge"
export const fetchCache = "default-no-store"

const inter = font({
  src: "../styles/fonts/inter.woff2",
  variable: "--font-inter",
  display: "block",
  preload: true,
})

const fraunces = font({
  src: "../styles/fonts/fraunces.woff2",
  variable: "--font-fraunces",
  display: "block",
  preload: true,
})

export const metadata: Metadata = {
  metadataBase: WEB_URL,
  title: {
    default: "Artists Together",
    template: `%s – Artists Together`,
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
  // themeColor: [
  //   { media: "(prefers-color-scheme: light)", color: "white" },
  //   { media: "(prefers-color-scheme: dark)", color: "black" },
  // ],
}

type Props = {
  children: ReactNode
}

export default function Layout({ children }: Props) {
  return (
    <html
      lang="en"
      className={cx(
        inter.variable,
        fraunces.variable,
        "relative min-h-full font-inter antialiased",
        "bg-arpeggio-black-900 text-gunpla-white-50 selection:bg-arpeggio-black-300 selection:text-arpeggio-black-900",
      )}
    >
      <HintsContextProvider>
        <Theme theme="arpeggio-black" asChild>
          <body className="size-full min-h-full min-w-fit text-sm sm:pl-16">
            <Sidebar />
            {children}
            <Footer />
          </body>
        </Theme>
      </HintsContextProvider>
    </html>
  )
}
