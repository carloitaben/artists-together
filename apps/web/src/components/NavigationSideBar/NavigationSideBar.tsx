import { getSession } from "~/services/auth"

import * as NavigationMenu from "~/components/NavigationMenu"
import * as Dialog from "~/components/Dialog"
import * as Tooltip from "~/components/Tooltip"
import Icon from "~/components/Icon"
import {
  artists,
  calendar,
  discord,
  help,
  home,
  profile,
  train,
} from "~/components/Icons"

import NavigationItem from "./NavigationItem"
import Button from "~/components/Button"

export default async function NavigationSidebar() {
  const session = await getSession()

  return (
    <Tooltip.Provider delayDuration={0}>
      <NavigationMenu.Root
        orientation="vertical"
        className="fixed inset-y-0 left-0 hidden w-16 items-center justify-center overflow-y-auto bg-theme-900 text-theme-50 sm:flex"
      >
        <NavigationMenu.List className="grid place-items-center gap-2">
          <Dialog.Root>
            <NavigationItem label="Log-in">
              <NavigationMenu.Trigger asChild>
                <Dialog.Trigger className="group block h-12 w-12 p-2">
                  <Icon
                    className="group-group-aria-disabled:text-theme-700 h-8 w-8 text-theme-50 group-[[aria-current='page']]:text-theme-300"
                    label="Log-in"
                  >
                    {profile}
                  </Icon>
                </Dialog.Trigger>
              </NavigationMenu.Trigger>
            </NavigationItem>
            <Dialog.Portal>
              <Dialog.Overlay className="fixed inset-0 overflow-y-auto bg-black/20 p-12">
                <Dialog.Content className="mx-auto w-full max-w-lg">
                  <div className="bg-white">
                    <Dialog.Title className="text-xl">Dialog</Dialog.Title>
                    <Dialog.Description>Dialog</Dialog.Description>
                    <Dialog.Close>Close</Dialog.Close>
                    <div className="bg-gray-100 m-2 h-[400px] rounded-lg"></div>
                    <div className="bg-gray-100 m-2 h-[400px] rounded-lg"></div>
                    <div className="bg-gray-100 m-2 h-[400px] rounded-lg"></div>
                  </div>
                  <div className="flex justify-end">
                    <Button
                      color="disabled"
                      className="bg-[#5865F2] text-gunpla-white-50"
                    >
                      <Icon label="" className="w-6">
                        {discord}
                      </Icon>
                      Log-in with Discord
                    </Button>
                  </div>
                </Dialog.Content>
              </Dialog.Overlay>
            </Dialog.Portal>
          </Dialog.Root>
          <NavigationItem label="Home" href="/">
            <Icon
              className="h-8 w-8 text-theme-50 group-[[aria-current='page']]:text-theme-300 group-aria-disabled:text-theme-700"
              label="Home"
            >
              {home}
            </Icon>
          </NavigationItem>
          <NavigationItem label="About" href="/about">
            <Icon
              className="h-8 w-8 text-theme-50 group-[[aria-current='page']]:text-theme-300 group-aria-disabled:text-theme-700"
              label="About"
            >
              {help}
            </Icon>
          </NavigationItem>
          <NavigationItem label="Coming soon!" disabled>
            <span aria-disabled className="group block h-12 w-12 p-2">
              <Icon
                className="h-8 w-8 text-theme-50 group-[[aria-current='page']]:text-theme-300 group-aria-disabled:text-theme-700"
                label="Coming soon!"
              >
                {artists}
              </Icon>
            </span>
          </NavigationItem>
          <NavigationItem label="Coming soon!" disabled>
            <span aria-disabled className="group block h-12 w-12 p-2">
              <Icon
                className="h-8 w-8 text-theme-50 group-[[aria-current='page']]:text-theme-300 group-aria-disabled:text-theme-700"
                label="Coming soon!"
              >
                {train}
              </Icon>
            </span>
          </NavigationItem>
          <NavigationItem label="Coming soon!" disabled>
            <span aria-disabled className="group block h-12 w-12 p-2">
              <Icon
                className="h-8 w-8 text-theme-50 group-[[aria-current='page']]:text-theme-300 group-aria-disabled:text-theme-700"
                label="Coming soon!"
              >
                {calendar}
              </Icon>
            </span>
          </NavigationItem>
        </NavigationMenu.List>
      </NavigationMenu.Root>
    </Tooltip.Provider>
  )
}