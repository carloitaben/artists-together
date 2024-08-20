import font from "next/font/local"
import type { ReactNode } from "react"
import { cx } from "cva"
import Navigation from "~/components/Navigation"
import "~/styles/index.css"
import type { Metadata } from "next"
import { WEB_URL } from "@artists-together/core/constants"
import Footer from "~/components/Footer"
import Spritesheet from "~/components/Spritesheet"
import Auth from "~/components/Auth"
import Toast from "~/components/Toast"

export const runtime = "edge"
export const dynamic = "force-dynamic"
export const fetchCache = "default-no-store"

const inter = font({
  src: "../styles/fonts/inter.woff2",
  variable: "--font-inter",
  display: "block",
})

const fraunces = font({
  src: "../styles/fonts/fraunces.woff2",
  variable: "--font-fraunces",
  display: "block",
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
    url: "https://artiststogether.online/",
    siteName: "Artists Together",
    locale: "en_US",
    type: "website",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
    },
  },
  twitter: {
    title: "Lee Robinson",
    card: "summary_large_image",
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
        "h-full min-h-full font-inter antialiased",
        "bg-arpeggio-black-900 text-gunpla-white-50 selection:bg-arpeggio-black-300 selection:text-arpeggio-black-900",
        inter.variable,
        fraunces.variable,
      )}
    >
      <Spritesheet />
      <body className="h-full text-sm sm:pl-16">
        <Auth>
          <Navigation>
            {children}
            <Footer />
          </Navigation>
        </Auth>
        <Toast />
      </body>
    </html>
  )
}
