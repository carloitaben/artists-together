import dynamic from "next/dynamic"
import { WebSocketProvider } from "~/hooks/ws"
import "./globals.css"

const Cursors = dynamic(() => import("../components/Cursors"), {
  ssr: false,
})

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="relative">
        <WebSocketProvider>
          {children}
          <Cursors />
        </WebSocketProvider>
      </body>
    </html>
  )
}
