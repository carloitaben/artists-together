import type { PropsWithChildren } from "react"
import NavigationBottombar from "./NavigationBottombar"
import NavigationSidebar from "./NavigationSidebar"

export default function Navigation({ children }: PropsWithChildren) {
  return (
    <>
      <NavigationSidebar />
      <div data-transition-container>{children}</div>
      <NavigationBottombar />
    </>
  )
}
