import type { LoaderFunctionArgs } from "@remix-run/node"
import {
  Links,
  LiveReload,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
} from "@remix-run/react"

import "~/styles/index.css"
import { auth } from "~/services/auth.server"
import { getTheme } from "~/services/cookies.server"
import { useThemeStyle } from "~/lib/themes"

export async function loader({ request }: LoaderFunctionArgs) {
  const [user, theme] = await Promise.all([
    auth.isAuthenticated(request),
    getTheme(request),
  ])

  return {
    user,
    theme,
  }
}

export default function App() {
  const style = useThemeStyle()

  return (
    <html
      lang="en"
      className="h-full bg-theme-900 text-gunpla-white-50  selection:bg-theme-300 selection:text-theme-900 text-sm"
      style={style}
    >
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.svg" type="image/svg+xml" />
        <Meta />
        <Links />
      </head>
      <body className="min-h-full h-full">
        <Outlet />
        <ScrollRestoration />
        <LiveReload />
        <Scripts />
      </body>
    </html>
  )
}
