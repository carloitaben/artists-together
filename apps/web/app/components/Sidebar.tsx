import { Link } from "@remix-run/react"

import useSession from "~/hooks/useSession"

export default function Sidebar() {
  const session = useSession()

  if (!session) {
    return (
      <div>
        ANON
        <Link to="/login">log in</Link>
      </div>
    )
  }

  return <Link to={session.handle}>{session.handle}</Link>
}
