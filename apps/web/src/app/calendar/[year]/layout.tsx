import { Metadata } from "next"
import type { PropsWithChildren } from "react"

export const metadata: Metadata = {
  robots: {
    index: false,
    follow: false,
  },
}

export default function Layout(props: PropsWithChildren) {
  return props.children
}
