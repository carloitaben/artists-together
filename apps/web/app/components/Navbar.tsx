import * as NavigationMenu from "@radix-ui/react-navigation-menu"
import * as Tooltip from "@radix-ui/react-tooltip"
import { NavLink } from "@remix-run/react"
import { $path } from "remix-routes"
import { createContext, useContext, type ReactElement } from "react"

import useUser from "~/hooks/useUser"

import { artists, calendar, help, home, profile, train } from "./Icons"
import UserModal from "./UserModal"
import AuthModal from "./AuthModal"
import Icon from "./Icon"

const navbarItemLabelContext = createContext("")

type NavbarItemIconProps = {
  children: ReactElement
}

function NavbarItemIcon({ children }: NavbarItemIconProps) {
  const label = useContext(navbarItemLabelContext)

  return (
    <Icon className="flex items-center justify-center w-8 h-8" label={label}>
      {children}
    </Icon>
  )
}

type NavbarItemLinkProps = {
  children: ReactElement
  to: string
}

function NavbarItemLink({ children, to }: NavbarItemLinkProps) {
  return (
    <NavigationMenu.Link asChild>
      <NavLink to={to} className="aria-[current]:text-theme-300 aria-[disabled]:text-theme-700">
        <NavbarItemIcon>{children}</NavbarItemIcon>
      </NavLink>
    </NavigationMenu.Link>
  )
}

type NavbarItemProps = {
  children: ReactElement
  label: string
}

function NavbarItem({ children, label }: NavbarItemProps) {
  return (
    <navbarItemLabelContext.Provider value={label}>
      <NavigationMenu.Item>
        <Tooltip.Root>
          <Tooltip.Trigger asChild>
            <div className="w-8 h-8">{children}</div>
          </Tooltip.Trigger>
          <Tooltip.Portal>
            <Tooltip.Content sideOffset={5} side="right">
              <Tooltip.Arrow className="fill-theme-300" />
              <div className="bg-theme-300 text-theme-700 py-2 px-4 rounded text-center">{label}</div>
            </Tooltip.Content>
          </Tooltip.Portal>
        </Tooltip.Root>
      </NavigationMenu.Item>
    </navbarItemLabelContext.Provider>
  )
}

export default function Navbar() {
  const user = useUser()

  return (
    <Tooltip.Provider>
      <NavigationMenu.Root
        orientation="vertical"
        className="w-16 bg-theme-900 text-theme-50 flex items-center justify-center overflow-y-auto fixed left-0 inset-y-0"
      >
        <NavigationMenu.List className="flex flex-col gap-6 my-6">
          {user ? (
            <NavbarItem label="Your profile">
              <UserModal>
                <NavbarItemIcon>{profile}</NavbarItemIcon>
              </UserModal>
            </NavbarItem>
          ) : (
            <NavbarItem label="Log-in">
              <AuthModal>
                <NavbarItemIcon>{profile}</NavbarItemIcon>
              </AuthModal>
            </NavbarItem>
          )}
          <NavbarItem label="Home">
            <NavbarItemLink to={$path("/")}>{home}</NavbarItemLink>
          </NavbarItem>
          <NavbarItem label="Coming soon!">
            <NavbarItemLink to={$path("/about")}>{help}</NavbarItemLink>
          </NavbarItem>
          <NavbarItem label="Coming soon!">
            <NavbarItemLink to={$path("/lounge")}>{artists}</NavbarItemLink>
          </NavbarItem>
          <NavbarItem label="Coming soon!">
            <NavbarItemLink to={$path("/art")}>{train}</NavbarItemLink>
          </NavbarItem>
          <NavbarItem label="Coming soon!">
            <NavbarItemLink to={$path("/schedule")}>{calendar}</NavbarItemLink>
          </NavbarItem>
        </NavigationMenu.List>
      </NavigationMenu.Root>
    </Tooltip.Provider>
  )
}
