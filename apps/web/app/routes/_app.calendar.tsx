import type { MetaFunction } from "@remix-run/react"
import { Outlet, NavLink } from "@remix-run/react"
import { $path } from "remix-routes"
import { guardDisabledRoute } from "~/server/lib.server"

export const meta: MetaFunction = () => [
  {
    title: "Calendar – Artists Together",
  },
]

export const handle = {
  actions: {
    toggle: () => console.log("toggle"),
  },
  page: {
    name: "Calendar",
  },
}

export async function loader() {
  guardDisabledRoute()
  return null
}

export default function Page() {
  return (
    <>
      <header>
        <h2>page title</h2>
        <nav>
          <NavLink to={$path("/calendar/days")}>Days</NavLink>
          <NavLink to={$path("/calendar/months")}>Months</NavLink>
        </nav>
      </header>
      <Outlet />
    </>
  )
}
