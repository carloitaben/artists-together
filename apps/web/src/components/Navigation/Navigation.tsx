import type { PropsWithChildren } from "react"
import NavigationBottombar from "./NavigationBottombar"
import NavigationSidebar from "./NavigationSidebar"
import NavigationTopbar from "./NavigationTopbar"

export default function Navigation({ children }: PropsWithChildren) {
  return (
    <>
      <NavigationSidebar />
      <div data-transition-container>
        <NavigationTopbar />
        {children}
      </div>
      <NavigationBottombar />
    </>
  )
}
