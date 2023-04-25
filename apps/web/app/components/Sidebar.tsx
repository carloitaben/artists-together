import { NavLink } from "@remix-run/react"
import { $path } from "remix-routes"

import useSession from "~/hooks/useSession"

export default function Sidebar() {
  const session = useSession()

  return (
    <aside>
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
            {session ? (
              <NavLink to={$path("/:handle", { handle: session.handle })}>Home</NavLink>
            ) : (
              <NavLink to={$path("/login")}>Login</NavLink>
            )}
          </li>
        </ul>
      </nav>
    </aside>
  )
}
