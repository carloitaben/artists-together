import { Link, useMatches } from "@remix-run/react"
import { routes } from "~/lib/routes"

export default function BottomAppBar() {
  const matches = useMatches()

  const actions = matches.filter(
    (match) => match.handle && match.handle?.actions
  )

  return (
    <div className="fixed bottom-0 inset-x-0">
      <ul>
        {routes.map((routes) => (
          <li key={routes.href}>
            <Link to={routes.href}>{routes.label}</Link>
          </li>
        ))}
      </ul>
    </div>
  )
}
