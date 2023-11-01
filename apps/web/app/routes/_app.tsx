import { Outlet } from "@remix-run/react"
import Navigation from "~/components/Navigation"
import Toast from "~/components/Toast"

export default function Page() {
  return (
    <>
      <Outlet />
      <Navigation />
      <Toast />
    </>
  )
}
