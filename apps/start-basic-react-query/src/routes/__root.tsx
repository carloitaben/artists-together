/* eslint-disable react/jsx-no-undef */
import {
  Outlet,
  ScrollRestoration,
  createRootRouteWithContext,
} from "@tanstack/react-router"
import { Body, Head, Html, Meta, Scripts } from "@tanstack/start"
import { zodSearchValidator } from "@tanstack/router-zod-adapter"
import type { QueryClient } from "@tanstack/react-query"
import type { ReactNode } from "react"
import { lazy } from "react"
import { authenticateQueryOptions, hintsQueryOptions } from "~/lib/data"
import { seo } from "~/lib/seo"
import { WebSocket } from "~/lib/websocket"
import { RootSearchParams } from "~/lib/schemas"
import css from "~/styles/index.css?url"
import { NotFound } from "~/components/NotFound"
import inter from "~/assets/fonts/inter.woff2"
import fraunces from "~/assets/fonts/fraunces.woff2"
import Navigation from "~/components/Navigation"
import Footer from "~/components/Footer"
import Toasts from "~/components/Toasts"
import Auth from "~/components/Auth"
import Cursors from "~/components/Cursors"

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
  validateSearch: zodSearchValidator(RootSearchParams),
  async beforeLoad({ context }) {
    await Promise.all([
      context.queryClient.ensureQueryData(hintsQueryOptions),
      context.queryClient.ensureQueryData(authenticateQueryOptions),
    ])
  },
  meta: () => [
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
  links: () => [
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
  scripts: () => temporaryHmrFix,
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

function RootDocument({ children }: { children: ReactNode }) {
  return (
    <Html lang="en">
      <Head>
        <Meta />
      </Head>
      <Body>
        <Navigation>
          <WebSocket>
            {children}
            <Cursors />
          </WebSocket>
        </Navigation>
        <Footer />
        <Toasts />
        <Auth />
        <QueryDevtools />
        <ScrollRestoration />
        <Scripts />
      </Body>
    </Html>
  )
}
