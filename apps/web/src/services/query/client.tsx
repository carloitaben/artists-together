"use client"

import { QueryClientProvider } from "@tanstack/react-query"
import { ReactQueryStreamedHydration } from "@tanstack/react-query-next-experimental"
import { getQueryClient } from "./shared"

export function QueryProvider(props: { children: React.ReactNode }) {
  const queryClient = getQueryClient()

  return (
    <QueryClientProvider client={queryClient}>
      <ReactQueryStreamedHydration>
        {props.children}
      </ReactQueryStreamedHydration>
    </QueryClientProvider>
  )
}
