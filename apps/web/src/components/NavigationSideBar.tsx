"use client"

import * as NavigationMenu from "@radix-ui/react-navigation-menu"
import * as RadixTooltip from "@radix-ui/react-tooltip"
import NextLink from "next/link"
import { usePathname } from "next/navigation"
import {
  CSSProperties,
  ComponentProps,
  ForwardedRef,
  ReactElement,
  ReactNode,
  createContext,
  forwardRef,
  useContext,
  useState,
} from "react"

import type { User } from "~/services/auth"
import { between } from "~/lib/utils"

import { artists, calendar, help, home, profile, train } from "./Icons"
import Icon from "./Icon"

const labelContext = createContext<string>("")

const Link = forwardRef(function Link(
  { href, children, ...props }: ComponentProps<typeof NextLink>,
  ref: ForwardedRef<HTMLAnchorElement>
) {
  const pathname = usePathname()
  const active = pathname === href

  return (
    <NavigationMenu.Item>
      <NavigationMenu.Link ref={ref} asChild active={active} className="group">
        <NextLink {...props} href={href}>
          {children}
        </NextLink>
      </NavigationMenu.Link>
    </NavigationMenu.Item>
  )
})

function Tooltip({ label, children }: { label: string; children: ReactNode }) {
  const [hover, setHover] = useState(false)
  const [rotation, setRotation] = useState(between(-5, 5))

  function onOpenChange(open: boolean) {
    if (open) setRotation(between(-5, 5))
    setHover(open)
  }

  const style = { "--tw-rotate": `${rotation}deg` } as CSSProperties

  return (
    <labelContext.Provider value={label}>
      <RadixTooltip.Root
        open={hover}
        onOpenChange={onOpenChange}
        delayDuration={0}
      >
        <RadixTooltip.Trigger asChild>{children}</RadixTooltip.Trigger>
        <RadixTooltip.Portal>
          <RadixTooltip.Content
            className="flex origin-left transform items-center drop-shadow-[0px_4px_8px_0px_rgba(11,14,30,0.08)]"
            side="right"
            sideOffset={5}
            style={style}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              width="16"
              height="13"
              className="-mr-px text-theme-300"
            >
              <path
                fill="currentColor"
                d="M16 0 1.37 4.64a1.95 1.95 0 0 0 0 3.72L16 13V0Z"
              />
            </svg>
            <div className="rounded bg-theme-300 px-3 py-2.5 text-center text-sm font-semibold text-theme-900">
              {label}
            </div>
          </RadixTooltip.Content>
        </RadixTooltip.Portal>
      </RadixTooltip.Root>
    </labelContext.Provider>
  )
}

function Item({
  children,
  disabled,
}: {
  children: ReactElement<ComponentProps<"svg">>
  disabled?: boolean
}) {
  const label = useContext(labelContext)

  return (
    <Icon
      aria-disabled={disabled}
      label={label}
      className="h-8 w-8 text-theme-50 group-[[aria-current='page']]:text-theme-300 aria-disabled:text-theme-700"
    >
      {children}
    </Icon>
  )
}

type Props = {
  user: User
}

export default function NavigationSideBar(_: Props) {
  return (
    <RadixTooltip.Provider>
      <NavigationMenu.Root
        orientation="vertical"
        className="fixed inset-y-0 left-0 hidden w-16 items-center justify-center overflow-y-auto bg-theme-900 text-theme-50 sm:flex"
      >
        <NavigationMenu.List className="my-4 flex flex-col gap-6">
          <Tooltip label="Coming soon!">
            <li>
              <Item disabled>{profile}</Item>
            </li>
          </Tooltip>
          <Tooltip label="Home">
            <Link href="/">
              <Item>{home}</Item>
            </Link>
          </Tooltip>
          <Tooltip label="Coming soon!">
            <li>
              <Item disabled>{help}</Item>
            </li>
          </Tooltip>
          <Tooltip label="Coming soon!">
            <li>
              <Item disabled>{artists}</Item>
            </li>
          </Tooltip>
          <Tooltip label="Coming soon!">
            <li>
              <Item disabled>{train}</Item>
            </li>
          </Tooltip>
          <Tooltip label="Coming soon!">
            <li>
              <Item disabled>{calendar}</Item>
            </li>
          </Tooltip>
        </NavigationMenu.List>
      </NavigationMenu.Root>
    </RadixTooltip.Provider>
  )
}
