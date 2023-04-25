import { Link, NavLink } from "@remix-run/react"

import useSession from "~/hooks/useSession"

export default function Sidebar() {
  const session = useSession()

  return (
    <aside>
      <nav>
        <ul className="flex flex-col">
          <li>
            <NavLink to="/">Home</NavLink>
          </li>
          <li>
            <NavLink to="/lounge">Lounge</NavLink>
          </li>
          <li>
            <NavLink to="/about">About</NavLink>
          </li>
          <li>
            <NavLink to="/art">A.R.T</NavLink>
          </li>
          <li>
            <NavLink to="/schedule">Schedule</NavLink>
          </li>
          <li>{session ? <NavLink to={`/${session.handle}`}>Home</NavLink> : <NavLink to="/login">Login</NavLink>}</li>
        </ul>
      </nav>
    </aside>
  )
}
