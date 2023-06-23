import { NavLink, useFetcher } from "@remix-run/react"
import { $path } from "remix-routes"

import useUser from "~/hooks/useUser"
import Auth from "./Auth"

export default function Sidebar() {
  const user = useUser()
  const logoutFetcher = useFetcher()

  return (
    <aside className="bg-gray-100">
      <nav>
        <ul className="flex flex-col">
          <li>
            <NavLink to={$path("/")}>Home</NavLink>
          </li>
          <li>
            <NavLink to={$path("/lounge")}>Lounge</NavLink>
          </li>
          <li>
            <NavLink to={$path("/about")}>About</NavLink>
          </li>
          <li>
            <NavLink to={$path("/art")}>A.R.T</NavLink>
          </li>
          <li>
            <NavLink to={$path("/schedule")}>Schedule</NavLink>
          </li>
          <li>
            {user ? (
              <NavLink to={$path("/:username", { username: user.userId })}>
                <div>{user.userId}</div>
              </NavLink>
            ) : (
              <Auth />
            )}
          </li>
        </ul>
      </nav>
      {user && (
        <logoutFetcher.Form action="/logout" method="post">
          <button>logout</button>
        </logoutFetcher.Form>
      )}
    </aside>
  )
}
