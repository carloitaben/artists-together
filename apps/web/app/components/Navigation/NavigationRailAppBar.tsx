import * as NavigationMenu from "@radix-ui/react-navigation-menu"
import * as Tooltip from "@radix-ui/react-tooltip"
import * as Dialog from "@radix-ui/react-dialog"
import { cx } from "cva"
import type { MouseEvent } from "react"
import { animate } from "framer-motion"
import { NavLink } from "@remix-run/react"
import { useHints, useUser } from "~/hooks/loaders"
import { usePageHandle } from "~/lib/handle"
import { routes } from "~/lib/routes"
import Icon from "~/components/Icon"
import NavigationRailTooltip from "./NavigationRailTooltip"

function anchor(event: MouseEvent) {
  event.preventDefault()

  function stopPropagation(event: Event) {
    event.stopPropagation()
  }

  animate(document.documentElement.scrollTop, 0, {
    type: "spring",
    mass: 0.075,
    onPlay: () => window.addEventListener("scroll", stopPropagation),
    onComplete: () => window.removeEventListener("scroll", stopPropagation),
    onUpdate: (top) => (document.documentElement.scrollTop = top),
  })
}

export default function RailAppBar() {
  const handle = usePageHandle<{ page: { name: string } }>()
  const hints = useHints()
  const user = useUser()

  return (
    <Tooltip.Provider delayDuration={0}>
      <NavigationMenu.Root
        orientation="vertical"
        className="fixed inset-y-0 left-0 hidden w-16 text-theme-50 sm:flex flex-col items-center justify-center overflow-y-auto gap-y-4 pt-4 pb-2 bg-theme-900/25 backdrop-blur-xl"
      >
        <a
          className="inline-block absolute top-4 inset-x-auto"
          href="#top"
          onClick={anchor}
        >
          <h1 className="text-theme-100 font-serif text-base font-semibold [writing-mode:vertical-lr] rotate-180">
            {handle.page.name}
          </h1>
        </a>
        <NavigationMenu.List className="grid">
          <NavigationMenu.Item>
            <Tooltip.Root>
              <Tooltip.Trigger asChild>
                <NavigationMenu.Trigger asChild>
                  <Dialog.Trigger className="p-0.5 group">
                    <div className="w-12 h-12 flex items-center justify-center rounded-lg group-hover:bg-theme-300 group-hover:text-theme-700 text-theme-700">
                      {user?.avatar ? (
                        <img
                          className="w-6 h-6 bg-current rounded-full overflow-hidden"
                          src={user.avatar}
                          alt="Your profile"
                          decoding="async"
                          loading="lazy"
                        />
                      ) : (
                        <Icon
                          name="face"
                          label={user ? "Your profile" : "Sign in"}
                          className="w-6 h-6"
                        />
                      )}
                    </div>
                  </Dialog.Trigger>
                </NavigationMenu.Trigger>
              </Tooltip.Trigger>
              <Tooltip.Portal>
                <NavigationRailTooltip id="profile">
                  {user ? "Your profile" : "Sign in"}
                </NavigationRailTooltip>
              </Tooltip.Portal>
            </Tooltip.Root>
          </NavigationMenu.Item>
          {routes.map((route) => (
            <NavigationMenu.Item
              key={route.href}
              aria-disabled={route?.disabled}
            >
              <Tooltip.Root>
                <Tooltip.Trigger asChild>
                  {route.disabled ? (
                    <div className="group block p-0.5">
                      <div className="w-12 h-12 flex items-center justify-center rounded-lg text-theme-700">
                        <Icon
                          name={route.icon}
                          label={route.label}
                          className="w-6 h-6"
                        />
                      </div>
                    </div>
                  ) : (
                    <NavigationMenu.Link asChild href={route.href}>
                      <NavLink
                        className="group block p-0.5"
                        to={route.href}
                        prefetch={hints.saveData ? "intent" : "viewport"}
                      >
                        {({ isActive, isPending }) => (
                          <div
                            className={cx(
                              "w-12 h-12 flex items-center justify-center rounded-lg group-hover:bg-theme-300 group-hover:text-theme-700",
                              isActive || isPending
                                ? "text-theme-100"
                                : "text-theme-700",
                            )}
                          >
                            <Icon
                              name={route.icon}
                              label={route.label}
                              className="w-6 h-6"
                            />
                          </div>
                        )}
                      </NavLink>
                    </NavigationMenu.Link>
                  )}
                </Tooltip.Trigger>
                <Tooltip.Portal>
                  <NavigationRailTooltip id={route.href}>
                    {route.disabled ? "Coming soon!" : route.label}
                  </NavigationRailTooltip>
                </Tooltip.Portal>
              </Tooltip.Root>
            </NavigationMenu.Item>
          ))}
        </NavigationMenu.List>
      </NavigationMenu.Root>
    </Tooltip.Provider>
  )
}
