"use client"

import * as Dialog from "@radix-ui/react-dialog"
import NextLink from "next/link"
import { ComponentProps, ReactElement, useEffect, useState } from "react"
import { AnimatePresence, Transition, motion } from "framer-motion"
import { usePathname } from "next/navigation"
import { cx } from "class-variance-authority"

import { User } from "~/services/auth"
import { useOnMatchScreen } from "~/hooks/media"

import {
  artists,
  burger,
  calendar,
  help,
  home,
  logo,
  options,
  profile,
  train,
} from "~/components/Icons"
import Icon from "~/components/Icon"

const transition: Transition = {
  type: "spring",
  mass: 0.05,
}

function Link({
  href,
  className,
  children,
  ...props
}: ComponentProps<typeof NextLink>) {
  const pathname = usePathname()
  const active = pathname === href

  return (
    <NextLink
      {...props}
      href={href}
      aria-current={active ? "page" : undefined}
      className={cx(className, "group block focus:outline-none")}
    >
      {children}
    </NextLink>
  )
}

function Item({
  icon,
  children,
  disabled,
}: {
  icon: ReactElement<ComponentProps<"svg">>
  children: string
  disabled?: boolean
}) {
  return (
    <div
      className={cx(
        "my-1 ml-4 mr-7 flex items-center gap-5 rounded-full p-3 text-sm",
        "group-focus-visible:ring-4 group-[[aria-current='page']]:bg-theme-300 group-[[aria-current='page']]:text-theme-900",
        disabled && "text-theme-700"
      )}
    >
      <Icon label={children} className="h-6 w-6 flex-none">
        {icon}
      </Icon>
      <span className="truncate">{children}</span>
    </div>
  )
}

type Props = {
  user: User
}

export default function NavbarMobile(_: Props) {
  const [open, setOpen] = useState(false)
  const pathname = usePathname()

  useOnMatchScreen("sm", (matches) => {
    if (matches && open) setOpen(false)
  })

  useEffect(() => {
    if (pathname && open) setOpen(false)
  }, [pathname])

  return (
    <nav className="fixed inset-x-0 bottom-0 flex h-14 items-center justify-between bg-theme-900 text-gunpla-white-50 sm:hidden">
      <Dialog.Root open={open} onOpenChange={setOpen}>
        <Dialog.Trigger className="m-1 h-12 w-12 p-3">
          <Icon label="Menu" className="h-6 w-6">
            {burger}
          </Icon>
        </Dialog.Trigger>
        <AnimatePresence initial={false} mode="wait">
          {open ? (
            <Dialog.Portal forceMount>
              <Dialog.Overlay forceMount asChild>
                <motion.div
                  className="fixed inset-0 bg-arpeggio-black-900/25 backdrop-blur-[24px] sm:hidden"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={transition}
                />
              </Dialog.Overlay>
              <Dialog.Content forceMount asChild>
                <motion.div
                  className="fixed inset-y-0 left-0 w-full max-w-[19.5rem] pr-4 focus:outline-none sm:hidden"
                  initial={{ x: "-100%" }}
                  animate={{ x: "0%" }}
                  exit={{ x: "-100%" }}
                  transition={transition}
                >
                  <ul className="flex h-full w-full flex-col rounded-r-3xl bg-theme-900 py-3 text-gunpla-white-50">
                    <li className="flex-1 p-14">
                      <Link href="/">
                        <Icon
                          className="h-full w-full rounded-3xl p-2 group-focus-visible:ring-4"
                          label="Artist Together"
                        >
                          {logo}
                        </Icon>
                      </Link>
                    </li>
                    <li>
                      <Item disabled icon={profile}>
                        Coming soon!
                      </Item>
                    </li>
                    <li>
                      <Link href="/">
                        <Item icon={home}>Home</Item>
                      </Link>
                    </li>
                    <li aria-disabled>
                      {/* <Link href="/about"> */}
                      <Item disabled icon={help}>
                        Coming soon!
                      </Item>
                      {/* </Link> */}
                    </li>
                    <li aria-disabled>
                      {/* <Link href="/lounge"> */}
                      <Item disabled icon={artists}>
                        Coming soon!
                      </Item>
                      {/* </Link> */}
                    </li>
                    <li aria-disabled>
                      {/* <Link href="/art"> */}
                      <Item disabled icon={train}>
                        Coming soon!
                      </Item>
                      {/* </Link> */}
                    </li>
                    <li aria-disabled>
                      {/* <Link href="/schedule"> */}
                      <Item disabled icon={calendar}>
                        Coming soon!
                      </Item>
                      {/* </Link> */}
                    </li>
                  </ul>
                </motion.div>
              </Dialog.Content>
            </Dialog.Portal>
          ) : null}
        </AnimatePresence>
      </Dialog.Root>
      <div aria-disabled className="m-1 h-12 w-12 p-3">
        <Icon label="Options" className="h-6 w-6 text-theme-700">
          {options}
        </Icon>
      </div>
    </nav>
  )
}
