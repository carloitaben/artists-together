"use client"

import { QueryClientProvider } from "@tanstack/react-query"
import { getQueryClient } from "./shared"

export function QueryProvider(props: { children: React.ReactNode }) {
  const queryClient = getQueryClient()

  return (
    <QueryClientProvider client={queryClient}>
      {props.children}
    </QueryClientProvider>
  )
}
