import { getSession } from "~/services/auth"
import Icon from "~/components/Icon"
import * as Dialog from "~/components/Dialog"

import NavigationMenu from "./NavigationMenu"

export default async function NavigationBottomBar() {
  const session = await getSession()

  return (
    <nav className="fixed inset-x-0 bottom-0 flex h-14 items-center justify-between bg-theme-900 text-gunpla-white-50 sm:hidden">
      <Dialog.ControlledRoot>
        <Dialog.Trigger className="m-1 h-12 w-12 p-3">
          <Icon icon="burger" label="Menu" className="h-6 w-6" />
        </Dialog.Trigger>
        <NavigationMenu />
      </Dialog.ControlledRoot>
      <div aria-disabled className="m-1 h-12 w-12 p-3">
        <Icon
          icon="options"
          label="Options"
          className="h-6 w-6 text-theme-700"
        />
      </div>
    </nav>
  )
}
