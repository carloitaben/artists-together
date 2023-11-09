import { Outlet } from "@remix-run/react"
import Navigation from "~/components/Navigation"
import Toasts from "~/components/Toasts"
import Cursor from "~/components/Cursor"
import WebSocket from "~/components/Websocket"

export default function Page() {
  return (
    <WebSocket>
      <Outlet />
      <Navigation />
      <Toasts />
      <Cursor />
    </WebSocket>
  )
}
