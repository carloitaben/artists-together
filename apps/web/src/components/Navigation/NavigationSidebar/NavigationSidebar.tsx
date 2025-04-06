import Avatar from "~/components/Avatar"
import Icon from "~/components/Icon"
import NavLink from "~/components/NavLink"
import { getUser } from "~/features/auth/server"
import { getHints } from "~/features/hints/server"
import { navigation } from "~/lib/navigation/shared"
import NavigationAuthLink from "../NavigationAuthLink"
import NavigationSidebarTooltip from "./NavigationSidebarTooltip"

const className = {
  navLink:
    "group block size-14 p-1 text-theme-700 hover:text-theme-700 aria-[current='page']:text-theme-300 focus-visible:text-theme-700 aria-[current='page']:focus-visible:text-theme-700 focus:outline-none",
  iconWrapper:
    "grid size-12 place-items-center rounded-2 group-hover:bg-theme-300 group-aria-[current='page']:group-hover:text-theme-700 *:size-6 *:text-current group-focus-visible:bg-theme-300",
}

export default async function NavigationSidebar() {
  const [user, hints] = await Promise.all([getUser(), getHints()])

  return (
    <nav
      aria-label="Main Navigation"
      role="navigation"
      className="fixed inset-y-0 left-0 z-20 hidden w-16 place-items-center gap-y-4 px-1 py-2 sm:grid"
    >
      <ul>
        <NavigationSidebarTooltip
          id="auth"
          label={user ? "Your profile" : "Log-in"}
        >
          <NavigationAuthLink className={className.navLink}>
            <span className={className.iconWrapper}>
              {user ? (
                <Avatar username={user.username} src={user.avatar} />
              ) : (
                <Icon src="Face" alt="Log-in" />
              )}
            </span>
          </NavigationAuthLink>
        </NavigationSidebarTooltip>
        {navigation.map((item) => (
          <NavigationSidebarTooltip
            key={item.id}
            id={item.id}
            label={item.label}
            disabled={item.link.disabled}
          >
            <NavLink
              {...item.link}
              disabled={item.link.disabled}
              prefetch={!hints.saveData}
              className={className.navLink}
            >
              <span className={className.iconWrapper}>
                <Icon src={item.icon} alt={item.label} />
              </span>
            </NavLink>
          </NavigationSidebarTooltip>
        ))}
      </ul>
    </nav>
  )
}
