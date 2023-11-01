import * as Dialog from "@radix-ui/react-dialog"
import Auth from "../Auth"
import NavigationBottomAppBar from "./NavigationBottomAppBar"
import NavigationRailAppBar from "./NavigationRailAppBar"

export default function Navigation() {
  return (
    <Dialog.Root>
      <NavigationBottomAppBar />
      <NavigationRailAppBar />
      <Auth />
    </Dialog.Root>
  )
}
