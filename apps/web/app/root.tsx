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
import { getCookie, themeCookie } from "~/services/cookies.server"
import { defaultTheme, useThemeStyle } from "~/lib/themes"
import Icons from "~/components/Icons"

export async function loader({ request }: LoaderFunctionArgs) {
  const [theme, user] = await Promise.all([
    getCookie(request, themeCookie) || defaultTheme,
    auth
      .handleRequest(request)
      .validate()
      .then((session) => session?.user),
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
      className="h-full bg-theme-900 text-gunpla-white-50 selection:bg-theme-300 selection:text-theme-900"
      style={style}
    >
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.svg" type="image/svg+xml" />
        <Meta />
        <Links />
      </head>
      <body className="min-h-full h-full text-sm pl-16">
        <Outlet />
        <Icons />
        <ScrollRestoration />
        <LiveReload />
        <Scripts />
      </body>
    </html>
  )
}
