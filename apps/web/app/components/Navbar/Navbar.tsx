import * as NavigationMenu from "@radix-ui/react-navigation-menu"
import * as Tooltip from "@radix-ui/react-tooltip"
import { NavLink } from "@remix-run/react"
import { $path } from "remix-routes"
import type { ReactNode } from "react"

import useUser from "~/hooks/useUser"

import { artists, calendar, help, home, profile, train } from "../Icons"
import UserModal from "../UserModal"
import AuthModal from "../AuthModal"
import Icon from "../Icon"

// function NavbarItemLink({ children, to }: { children: ReactNode; to: string }) {
//   return (
//     <NavigationMenu.Link active={false} asChild>
//       <NavLink to={to} className="flex items-center justify-center w-8 h-8 aria-[current]:text-[#76F6D8]">
//         {children}
//       </NavLink>
//     </NavigationMenu.Link>
//   )
// }

// function NavbarItem({ children, label }: { children: ReactNode; label: string }) {
//   return (
//     <NavigationMenu.Item>
//       <Tooltip.Root>
//         <Tooltip.Trigger>
//           {children}
//           <Tooltip.Portal>
//             <Tooltip.Content sideOffset={5} side="right">
//               <Tooltip.Arrow className=" fill-[#76F6D8]" />
//               <div className="bg-[#76F6D8] text-[#0A3743] py-2 px-4 rounded text-center">{label}</div>
//             </Tooltip.Content>
//           </Tooltip.Portal>
//         </Tooltip.Trigger>
//       </Tooltip.Root>
//     </NavigationMenu.Item>
//   )
// }

// export default function Navbar() {
//   const user = useUser()

//   return (
//     <Tooltip.Provider>
//       <NavigationMenu.Root
//         orientation="vertical"
//         className="w-16 bg-[#011B23] text-[#024456] flex items-center justify-center overflow-y-auto fixed left-0 inset-y-0"
//       >
//         <NavigationMenu.List className="flex flex-col gap-6 my-4">
//           <NavbarItem label={user ? "Your profile" : "Log in"}>
//             {user ? (
//               <UserModal className="flex items-center justify-center w-8 h-8">{profile}</UserModal>
//             ) : (
//               <AuthModal className="flex items-center justify-center w-8 h-8">{profile}</AuthModal>
//             )}
//           </NavbarItem>
//           <NavbarItem label="Home">
//             <NavbarItemLink to={$path("/")}>{home}</NavbarItemLink>
//           </NavbarItem>
//           <NavbarItem label="Coming soon!">
//             <NavbarItemLink to={$path("/about")}>{help}</NavbarItemLink>
//           </NavbarItem>
//           <NavbarItem label="Coming soon!">
//             <NavbarItemLink to={$path("/lounge")}>{artists}</NavbarItemLink>
//           </NavbarItem>
//           <NavbarItem label="Coming soon!">
//             <NavbarItemLink to={$path("/art")}>{train}</NavbarItemLink>
//           </NavbarItem>
//           <NavbarItem label="Coming soon!">
//             <NavbarItemLink to={$path("/schedule")}>{calendar}</NavbarItemLink>
//           </NavbarItem>
//         </NavigationMenu.List>
//       </NavigationMenu.Root>
//     </Tooltip.Provider>
//   )
// }

export default function Navbar() {
  return (
    <Tooltip.Provider>
      <NavigationMenu.Root
        orientation="vertical"
        className="w-16 bg-anamorphic-teal-900 text-anamorphic-teal-50 flex items-center justify-center overflow-y-auto fixed left-0 inset-y-0"
      >
        <NavigationMenu.List className="flex flex-col gap-6 my-6">
          <NavigationMenu.Item>
            <NavigationMenu.Link asChild>
              <NavLink
                to={$path("/")}
                className="flex items-center justify-center w-8 h-8 aria-[current]:text-anamorphic-teal-300 aria-[disabled]:text-anamorphic-teal-700"
              >
                <Icon label="Home">{home}</Icon>
              </NavLink>
            </NavigationMenu.Link>
          </NavigationMenu.Item>
        </NavigationMenu.List>
      </NavigationMenu.Root>
    </Tooltip.Provider>
  )
}
