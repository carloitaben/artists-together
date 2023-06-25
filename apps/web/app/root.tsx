import {
  Links,
  LiveReload,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
  useLoaderData,
} from "@remix-run/react";
import type { LinkDescriptor, LoaderArgs } from "@vercel/remix"
import { json } from "@vercel/remix"

import { auth } from "~/services/auth.server"
import { Theme, getTheme, makeThemeStyle } from "~/utils/themes"
import Navbar from "~/components/Navbar"

import styles from "./root.css"

export function links() {
  return [{ rel: "stylesheet", href: styles }] satisfies LinkDescriptor[]
}

export async function loader({ request }: LoaderArgs) {
  const headers = new Headers()
  const authRequest = auth.handleRequest(request, headers)
  const { user } = await authRequest.validateUser()

  // TODO get this from user settings, falls back to anamorphic-teal
  const theme = getTheme(Theme["anamorphic-teal"])

  return json(
    { user, theme },
    {
      headers,
    }
  )
}

export type Loader = typeof loader

export default function App() {
  const data = useLoaderData<typeof loader>()

  const style = makeThemeStyle(data.theme)

  return (
    <html lang="en" className="h-full bg-theme-900 text-gunpla-white-50" style={style}>
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
