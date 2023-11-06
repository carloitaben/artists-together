import { Outlet } from "@remix-run/react"
import Navigation from "~/components/Navigation"
import Toasts from "~/components/Toasts"

export default function Page() {
  return (
    <>
      <Outlet />
      <Navigation />
      <Toasts />
    </>
  )
}
