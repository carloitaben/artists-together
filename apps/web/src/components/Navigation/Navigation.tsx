import type { ReactNode } from "react"
import NavigationBottombar from "./NavigationBottombar"
import NavigationSidebar from "./NavigationSidebar"

type Props = {
  children: ReactNode
}

export default function Navigation({ children }: Props) {
  return (
    <>
      {children}
      <NavigationBottombar />
      <NavigationSidebar />
    </>
  )
}
