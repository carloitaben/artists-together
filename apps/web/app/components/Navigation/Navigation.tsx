import Auth from "../Auth"
import NavigationBottomAppBar from "./NavigationBottomAppBar"
import NavigationRailAppBar from "./NavigationRailAppBar"

export default function Navigation() {
  return (
    <Auth>
      <NavigationBottomAppBar />
      <NavigationRailAppBar />
    </Auth>
  )
}
