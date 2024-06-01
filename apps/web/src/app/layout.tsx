import font from "next/font/local"
import type { ReactNode } from "react"
import { cx } from "cva"
import "~/styles/index.css"

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

type Props = {
  children: ReactNode
}

export default function Layout({ children }: Props) {
  return (
    <html
      lang="en"
      className={cx(
        "bg-arpeggio-black-900 text-gunpla-white-50 min-h-full h-full",
        inter.variable,
        fraunces.variable,
      )}
    >
      <body className="h-full">{children}</body>
    </html>
  )
}
