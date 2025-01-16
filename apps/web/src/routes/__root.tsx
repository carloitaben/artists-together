import {
  Outlet,
  ScrollRestoration,
  createRootRouteWithContext,
  useLocation,
} from "@tanstack/react-router"
import { Meta, Scripts } from "@tanstack/start"
import type { QueryClient } from "@tanstack/react-query"
import type { ReactNode } from "react"
import { lazy, useEffect } from "react"
import { authenticateQueryOptions } from "~/services/auth/shared"
import { hintsQueryOptions } from "~/services/hints/shared"
import { seo } from "~/lib/seo"
import { WebSocket } from "~/lib/websocket"
import { RootSearchParams } from "~/lib/schemas"
import css from "~/styles/index.css?url"
import inter from "~/assets/fonts/inter.woff2"
import fraunces from "~/assets/fonts/fraunces.woff2"
import NotFound from "~/components/NotFound"
import Navigation from "~/components/Navigation"
import Cursors from "~/components/Cursors"
import Footer from "~/components/Footer"
import Toasts from "~/components/Toasts"
import Auth from "~/components/Auth"
import { cx } from "cva"

const QueryDevtools = import.meta.env.PROD
  ? () => null
  : lazy(() =>
      import("@tanstack/react-query-devtools").then((module) => ({
        default: module.ReactQueryDevtools,
      })),
    )

const temporaryHmrFix = import.meta.env.DEV
  ? [
      {
        type: "module",
        children: `import RefreshRuntime from "/_build/@react-refresh";
RefreshRuntime.injectIntoGlobalHook(window)
window.$RefreshReg$ = () => {}
window.$RefreshSig$ = () => (type) => type`,
      },
    ]
  : []

export const Route = createRootRouteWithContext<{
  queryClient: QueryClient
}>()({
  validateSearch: RootSearchParams,
  async beforeLoad({ context }) {
    await Promise.all([
      context.queryClient.ensureQueryData(hintsQueryOptions),
      context.queryClient.ensureQueryData(authenticateQueryOptions),
    ])
  },
  head() {
    return {
      meta: [
        {
          charSet: "utf-8",
        },
        {
          name: "viewport",
          content: "width=device-width, initial-scale=1",
        },
        {
          name: "robots",
          content:
            process.env.VERCEL_ENV === "production"
              ? "index, follow"
              : "noindex, nofollow",
        },
        ...seo({
          title: "Artists Together",
          description: "An inclusive community for all kinds of artists.",
        }),
      ],
      links: [
        { rel: "stylesheet", href: css },
        {
          rel: "icon",
          href: "/favicon.ico",
          type: "image/x-icon",
          sizes: "256x256",
        },
        {
          rel: "icon",
          href: "/favicon.svg",
          type: "image/svg+xml",
          sizes: "any",
        },
        {
          rel: "preload",
          href: inter,
          as: "font",
          type: "font/woff2",
          crossOrigin: "",
        },
        {
          rel: "preload",
          href: fraunces,
          as: "font",
          type: "font/woff2",
          crossOrigin: "",
        },
      ],
      scripts: temporaryHmrFix,
    }
  },
  notFoundComponent: () => <NotFound />,
  component: RootComponent,
})

function RootComponent() {
  return (
    <RootDocument>
      <Outlet />
    </RootDocument>
  )
}

function EnsureUppercaseSerifAmpersand() {
  const pathname = useLocation({
    select: (state) => state.pathname,
  })

  useEffect(() => {
    document.querySelectorAll(".font-fraunces").forEach((element) => {
      if (!element.textContent?.includes("&")) return
      if (!element.querySelector(".font-serif-ampersand")) {
        console.error(element)
        throw Error(
          `Found Fraunces ampersand without ".font-serif-ampersand" class on path "${pathname}".` +
            "\n" +
            "Check the browser console for more info.",
        )
      }
    })
  }, [pathname])

  return null
}

function RootDocument({ children }: { children: ReactNode }) {
  return (
    <html
      lang="en"
      className={cx(
        "relative min-h-full scroll-p-0 font-inter antialiased",
        "theme-arpeggio-black bg-arpeggio-black-900 text-gunpla-white-50",
        "selection:bg-arpeggio-black-300 selection:text-arpeggio-black-900",
      )}
    >
      <head>
        <Meta />
      </head>
      <body className="size-full min-h-full min-w-fit text-sm sm:pl-16">
        <Navigation />
        <WebSocket>
          {children}
          <Cursors />
        </WebSocket>
        <Footer />
        <Toasts />
        <Auth />
        {import.meta.dev ? <EnsureUppercaseSerifAmpersand /> : null}
        <QueryDevtools />
        <ScrollRestoration />
        <Scripts />
      </body>
    </html>
  )
}
