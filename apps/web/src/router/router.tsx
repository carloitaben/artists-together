import { QueryClient } from "@tanstack/react-query"
import { createRouter as createTanStackRouter } from "@tanstack/react-router"
import { routerWithQueryClient } from "@tanstack/react-router-with-query"
import type { Action } from "~/lib/navigation"
import { toaster } from "~/components/Toasts"
import NotFound from "~/components/NotFound"
import { routeTree } from "./route-tree.gen"

export function createRouter() {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        staleTime: Infinity,
      },
      mutations: {
        onError(error) {
          if (import.meta.env.DEV) {
            console.error(error)
          }

          toaster.create({
            type: "error",
            title: "Oops! Something went wrong…",
          })
        },
      },
    },
  })

  return routerWithQueryClient(
    createTanStackRouter({
      routeTree,
      context: { queryClient },
      defaultPreload: import.meta.env.DEV ? false : "intent",
      defaultNotFoundComponent: () => <NotFound />,
    }),
    queryClient,
  )
}

declare module "@tanstack/react-router" {
  interface Register {
    router: ReturnType<typeof createRouter>
  }

  interface StaticDataRouteOption {
    label?: string
    search?: true | string
    actions?: Action[]
  }
}
