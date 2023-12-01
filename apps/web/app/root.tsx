import type { LoaderFunctionArgs, MetaFunction } from "@remix-run/node"
import { json } from "@remix-run/node"
import {
  Links,
  LiveReload,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
} from "@remix-run/react"

import "~/styles/index.css"
import { auth } from "~/server/auth.server"
import { getCookie, themeCookie } from "~/server/cookies.server"
import { defaultTheme, useThemeStyle } from "~/lib/themes"
import Icons from "~/components/Icons"

export const meta: MetaFunction = () => [
  {
    title: "Artists Together",
    property: "og:title",
  },
  {
    name: "description",
    property: "og:description",
    content: "An inclusive community for all kinds of artists.",
  },
  {
    name: "keywords",
    content: "Art, Artist Community",
  },
]

export async function loader({ request }: LoaderFunctionArgs) {
  const [theme, user] = await Promise.all([
    getCookie(request, themeCookie),
    auth
      .handleRequest(request)
      .validate()
      .then((session) => session?.user),
  ])

  return json(
    {
      user,
      theme: theme || defaultTheme,
      hints: {
        saveData: request.headers.get("Save-Data") === "on",
      },
    },
    theme
      ? undefined
      : {
          headers: {
            "Set-Cookie": await themeCookie.serialize(
              user ? user.theme : defaultTheme,
            ),
            Vary: "Save-Data",
          },
        },
  )
}

export default function App() {
  const style = useThemeStyle()

  return (
    <html
      lang="en"
      className="h-full bg-theme-900 text-gunpla-white-50 selection:bg-theme-300 selection:text-theme-900 [-webkit-tap-highlight-color:transparent]"
      style={style}
    >
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.svg" type="image/svg+xml" />
        <Meta />
        <Links />
      </head>
      <body className="min-h-full h-full text-sm sm:pl-16">
        <Outlet />
        <Icons />
        <ScrollRestoration />
        <LiveReload />
        <Scripts />
      </body>
    </html>
  )
}
