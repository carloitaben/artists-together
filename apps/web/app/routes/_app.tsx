import { useLocation, Outlet } from "@remix-run/react"
import { useEffect } from "react"
import Navigation from "~/components/Navigation"
import Toasts from "~/components/Toasts"
import Cursor from "~/components/Cursor"
import WebSocket from "~/components/WebSocket"

function EnsureUppercaseSerifAmpersand() {
  const location = useLocation()

  useEffect(() => {
    document.querySelectorAll(".font-serif").forEach((element) => {
      if (!element.textContent?.includes("&")) return
      if (!element.querySelector(".font-serif-ampersand")) {
        console.error(element)
        throw Error(
          "Found serif ampersand without '.font-serif-ampersand' class." +
            "\n" +
            "Check the browser console for more info",
        )
      }
    })
  }, [location.pathname])

  return null
}

export default function Page() {
  return (
    <>
      <WebSocket>
        <Outlet />
        <Navigation />
        <Toasts />
        <Cursor />
      </WebSocket>
      {import.meta.env.DEV ? <EnsureUppercaseSerifAmpersand /> : null}
    </>
  )
}
