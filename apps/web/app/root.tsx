import {
  Links,
  LiveReload,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
} from "@remix-run/react";
import type { LinksFunction, LoaderArgs } from "@vercel/remix"
import { json } from "@vercel/remix"

import { auth } from "~/services/auth.server"
import Sidebar from "./components/Sidebar"
import rootStyles from "./root.css"

export const links: LinksFunction = () => [{ rel: "stylesheet", href: rootStyles }]

export async function loader({ request }: LoaderArgs) {
  const headers = new Headers()
  const authRequest = auth.handleRequest(request, headers)
  const { user, session } = await authRequest.validateUser()

  return json(
    {
      user,
      session,
    },
    {
      headers,
    }
  )
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
