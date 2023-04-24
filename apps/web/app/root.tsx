import {
  Links,
  LiveReload,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
} from "@remix-run/react";
import type { LinksFunction, LoaderArgs } from "@vercel/remix"

import { authenticator } from "~/services/auth.server"
import Sidebar from "./components/Sidebar"
import rootStyles from "./root.css"

export const links: LinksFunction = () => [{ rel: "stylesheet", href: rootStyles }]

export async function loader({ request }: LoaderArgs) {
  const session = await authenticator.isAuthenticated(request)

  return {
    session,
  }
}

export type Loader = typeof loader

export default function App() {
  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width,initial-scale=1" />
        <Meta />
        <Links />
      </head>
      <body>
        <Sidebar />
        <Outlet />
        <ScrollRestoration />
        <Scripts />
        <LiveReload />
      </body>
    </html>
  )
}
