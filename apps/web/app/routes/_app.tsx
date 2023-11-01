import { Outlet } from "@remix-run/react"
import Auth from "~/components/Auth"
import Navigation from "~/components/Navigation"

export default function Page() {
  return (
    <>
      <Outlet />
      <Auth />
      <Navigation />
    </>
  )
}
