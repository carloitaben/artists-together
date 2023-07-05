"use client"

import * as Dialog from "@radix-ui/react-dialog"
import NextLink from "next/link"
import { ComponentProps, ReactNode } from "react"
import { usePathname } from "next/navigation"
import { cx } from "class-variance-authority"

import { User } from "~/services/auth"

import { artists, calendar, help, home, profile, train } from "./Icons"
import Auth from "./Auth"
import Icon from "./Icon"

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
      className={cx(className, "group block")}
    >
      {children}
    </NextLink>
  )
}

function Item({ icon, children }: { icon: ReactNode; children: string }) {
  return (
    <div className="my-1 ml-4 mr-7 flex items-center gap-5 rounded-full p-3 group-[[aria-current='page']]:bg-theme-500 group-[[aria-current='page']]:text-theme-900">
      <Icon label={children} className="h-6 w-6">
        {icon}
      </Icon>
      <span>{children}</span>
    </div>
  )
}

type Props = {
  user: User
}

export default function NavbarMobile({ user }: Props) {
  return (
    <nav className="fixed inset-x-0 bottom-0 h-14 items-center justify-between bg-theme-900 text-gunpla-white-50">
      <Dialog.Root>
        <Dialog.Trigger>Menu</Dialog.Trigger>
        <Dialog.Portal>
          <Dialog.Overlay className="fixed inset-0 bg-arpeggio-black-900/25 backdrop-blur-[24px]" />
          <Dialog.Content className="fixed inset-y-0 left-0 w-full max-w-[19.5rem] pr-4">
            <ul className="flex h-full w-full flex-col rounded-r-3xl bg-theme-900 py-3 text-gunpla-white-50">
              <li className="flex flex-1 justify-center py-16">
                <Link href="/">
                  <div>logo</div>
                </Link>
              </li>
              <li>
                {user ? (
                  <form method="post" action="/api/auth/logout">
                    <button className="block w-full">
                      <Item icon={profile}>Your profile</Item>
                    </button>
                  </form>
                ) : (
                  <Auth className="block w-full">
                    <Item icon={profile}>Log-in</Item>
                  </Auth>
                )}
              </li>
              <li>
                <Link href="/">
                  <Item icon={home}>Home</Item>
                </Link>
              </li>
              <li aria-disabled={false}>
                <Link href="/about">
                  <Item icon={help}>Coming soon!</Item>
                </Link>
              </li>
              <li aria-disabled={false}>
                <Link href="/lounge">
                  <Item icon={artists}>Coming soon!</Item>
                </Link>
              </li>
              <li aria-disabled={false}>
                <Link href="/art">
                  <Item icon={train}>Coming soon!</Item>
                </Link>
              </li>
              <li aria-disabled={false}>
                <Link href="/schedule">
                  <Item icon={calendar}>Coming soon!</Item>
                </Link>
              </li>
            </ul>
          </Dialog.Content>
        </Dialog.Portal>
      </Dialog.Root>
    </nav>
  )
}

// import * as Dialog from "@radix-ui/react-dialog"
// import * as NavigationMenu from "@radix-ui/react-navigation-menu"
// import NextLink from "next/link"
// import { ReactNode } from "react"
// import { usePathname } from "next/navigation"
// import { cx } from "class-variance-authority"

// import { User } from "~/services/auth"

// import { artists, calendar, help, home, profile, train } from "./Icons"
// import Auth from "./Auth"
// import Icon from "./Icon"

// type LinkProps = Omit<
//   NavigationMenu.NavigationMenuLinkProps,
//   "href" | "active" | "asChild"
// > &
//   Required<Pick<NavigationMenu.NavigationMenuLinkProps, "href">>

// function Link({ href, children, className, ...props }: LinkProps) {
//   const pathname = usePathname()
//   const active = pathname === href

//   return (
//     <NavigationMenu.Link
//       active={active}
//       className={cx("group block", className)}
//       asChild
//       {...props}
//     >
//       <NextLink href={href}>{children}</NextLink>
//     </NavigationMenu.Link>
//   )
// }

// function Item({ icon, children }: { icon: ReactNode; children: string }) {
//   return (
//     <div className="my-1 ml-4 mr-7 flex items-center gap-5 rounded-full p-3 group-[[data-active]]:bg-theme-500 group-[[data-active]]:text-theme-900">
//       <Icon label={children} className="h-6 w-6">
//         {icon}
//       </Icon>
//       <span>{children}</span>
//     </div>
//   )
// }

// type Props = {
//   user: User
// }

// export default function NavbarMobile({ user }: Props) {
//   return (
//     <NavigationMenu.Root className="fixed inset-x-0 bottom-0 h-14 items-center justify-between bg-theme-900 text-gunpla-white-50">
//       <Dialog.Root>
//         <Dialog.Trigger>Menu</Dialog.Trigger>
//         <Dialog.Portal>
//           <Dialog.Overlay className="fixed inset-0 bg-arpeggio-black-900/25 backdrop-blur-[24px]" />
//           <Dialog.Content className="fixed inset-y-0 left-0 grid w-full max-w-[19.5rem] pr-4">
//             <NavigationMenu.List className="flex h-full w-full flex-col rounded-r-3xl bg-theme-900 py-3 text-gunpla-white-50">
//               <NavigationMenu.Item className="flex flex-1 justify-center py-16">
//                 <Link href="/">
//                   <div>logo</div>
//                 </Link>
//               </NavigationMenu.Item>
//               <NavigationMenu.Item>
//                 <NavigationMenu.Link href="#">
//                   {user ? (
//                     <form method="post" action="/api/auth/logout">
//                       <button className="block w-full">
//                         <Item icon={profile}>Your profile</Item>
//                       </button>
//                     </form>
//                   ) : (
//                     <Auth className="block w-full">
//                       <Item icon={profile}>Log-in</Item>
//                     </Auth>
//                   )}
//                 </NavigationMenu.Link>
//               </NavigationMenu.Item>
//               <NavigationMenu.Item>
//                 <Link href="/">
//                   <Item icon={home}>Home</Item>
//                 </Link>
//               </NavigationMenu.Item>
//               <NavigationMenu.Item aria-disabled={false}>
//                 <Link href="/about">
//                   <Item icon={help}>Coming soon!</Item>
//                 </Link>
//               </NavigationMenu.Item>
//               <NavigationMenu.Item aria-disabled={false}>
//                 <Link href="/lounge">
//                   <Item icon={artists}>Coming soon!</Item>
//                 </Link>
//               </NavigationMenu.Item>
//               <NavigationMenu.Item aria-disabled={false}>
//                 <Link href="/art">
//                   <Item icon={train}>Coming soon!</Item>
//                 </Link>
//               </NavigationMenu.Item>
//               <NavigationMenu.Item aria-disabled={false}>
//                 <Link href="/schedule">
//                   <Item icon={calendar}>Coming soon!</Item>
//                 </Link>
//               </NavigationMenu.Item>
//             </NavigationMenu.List>
//           </Dialog.Content>
//         </Dialog.Portal>
//       </Dialog.Root>
//     </NavigationMenu.Root>
//   )
// }
