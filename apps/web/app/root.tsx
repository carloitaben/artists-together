import {
  Links,
  LiveReload,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
} from "@remix-run/react";
import type { LinkDescriptor, LoaderArgs } from "@vercel/remix"
import { json } from "@vercel/remix"

import { auth } from "~/services/auth.server"

import Navbar from "./components/Navbar"
import styles from "./root.css"

export function links() {
  return [{ rel: "stylesheet", href: styles }] satisfies LinkDescriptor[]
}

export async function loader({ request }: LoaderArgs) {
  const headers = new Headers()
  const authRequest = auth.handleRequest(request, headers)
  const { user } = await authRequest.validateUser()

  return json(
    { user },
    {
      headers,
    }
  )
}

export type Loader = typeof loader

export default function App() {
  return (
    <html lang="en" className="h-full">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width,initial-scale=1" />
        <Meta />
        <Links />
      </head>
      <body className="min-h-full h-full pl-16">
        <Navbar />
        <Outlet />
        <ScrollRestoration />
        <Scripts />
        <LiveReload />
      </body>
    </html>
  )
}
