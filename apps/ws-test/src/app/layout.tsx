import { WebSocketProvider } from "~/hooks/ws"
import Cursors from "~/components/Cursors"

import "./globals.css"

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <WebSocketProvider>
          {children}
          <Cursors />
        </WebSocketProvider>
      </body>
    </html>
  )
}
