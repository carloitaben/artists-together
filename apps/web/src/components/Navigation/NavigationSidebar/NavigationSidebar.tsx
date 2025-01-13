import { useSuspenseQueries } from "@tanstack/react-query"
import { Link, useLocation } from "@tanstack/react-router"
import { authenticateQueryOptions } from "~/services/auth/shared"
import { hintsQueryOptions } from "~/services/hints/shared"
import { navigationEntries } from "~/lib/navigation"
import NavLink from "~/components/NavLink"
import Icon from "~/components/Icon"
import NavigationSidebarTooltip from "./NavigationSidebarTooltip"
import Avatar from "~/components/Avatar"

const className = {
  navLink:
    "group block size-14 p-1 text-arpeggio-black-800 hover:text-theme-800 aria-[current='page']:text-theme-300 focus-visible:text-theme-800 aria-[current='page']:focus-visible:text-theme-800 focus:outline-none",
  iconWrapper:
    "grid size-12 place-items-center rounded-2 group-hover:bg-theme-300 group-aria-[current='page']:group-hover:text-theme-800 *:size-6 *:text-current group-focus-visible:bg-theme-300",
}

export default function NavigationSidebar() {
  const [auth, hints] = useSuspenseQueries({
    queries: [authenticateQueryOptions, hintsQueryOptions],
  })

  const pathname = useLocation({
    select: (state) => state.pathname,
  })

  return (
    <nav
      aria-label="Main Navigation"
      role="navigation"
      className="fixed inset-y-0 left-0 z-20 hidden w-16 place-items-center gap-y-4 bg-arpeggio-black-900/75 px-1 py-2 backdrop-blur-1 sm:grid"
    >
      <ul>
        <NavigationSidebarTooltip
          id="auth"
          label={auth.data ? "Your profile" : "Log-in"}
        >
          <Link
            replace
            to={pathname}
            search={(prev) => ({ ...prev, modal: "auth" })}
            className={className.navLink}
          >
            <span className={className.iconWrapper}>
              {auth.data ? (
                <Avatar
                  username={auth.data.user.username}
                  src={auth.data.user.avatar}
                />
              ) : (
                <Icon src="Face" alt="Log-in" />
              )}
            </span>
          </Link>
        </NavigationSidebarTooltip>
        {navigationEntries.map(([key, route]) => (
          <NavigationSidebarTooltip
            key={key}
            id={key}
            label={route.label}
            disabled={route.link.disabled}
          >
            <NavLink
              {...route.link}
              disabled={route.link.disabled}
              preload={hints.data.saveData ? "intent" : "render"}
              className={className.navLink}
            >
              <span className={className.iconWrapper}>
                <Icon src={route.icon} alt={route.label} />
              </span>
            </NavLink>
          </NavigationSidebarTooltip>
        ))}
      </ul>
    </nav>
  )
}
