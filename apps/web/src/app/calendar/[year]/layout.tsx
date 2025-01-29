import type { Metadata } from "next"
import type { PropsWithChildren } from "react"

export const metadata: Metadata = {
  title: "Calendar",
  robots: {
    index: false,
    follow: false,
  },
}

export default function Layout(props: PropsWithChildren) {
  return props.children
}
