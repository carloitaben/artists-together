/* eslint-disable @next/next/no-before-interactive-script-outside-document */

import Script from "next/script"

import { WebSocketProvider } from "~/hooks/ws"

import Cursors from "~/components/Cursors"
import Cursor from "~/components/Cursor"

import "./globals.css"

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="bg-white">
      <body className="relative">
        <WebSocketProvider>
          {children}
          <Cursors />
          <Cursor />
        </WebSocketProvider>
        <Script id="tailwindcss-noscript" strategy="beforeInteractive">
          {`(function(){typeof document !== "undefined" && document.documentElement.classList.add("js");}())`}
        </Script>
      </body>
    </html>
  )
}
