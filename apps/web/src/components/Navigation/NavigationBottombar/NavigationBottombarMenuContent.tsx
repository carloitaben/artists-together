import { useSuspenseQueries } from "@tanstack/react-query"
import { useLocation } from "@tanstack/react-router"
import { Menu } from "@ark-ui/react/menu"
import { authenticateQueryOptions } from "~/services/auth/queries"
import { hintsQueryOptions } from "~/services/hints/queries"
import { navigationEntries } from "~/lib/navigation"
import Icon from "~/components/Icon"
import NavLink from "~/components/NavLink"
import Avatar from "~/components/Avatar"
import NavigationBottombarMenuContentItem from "./NavigationBottombarMenuContentItem"

export default function NavigationBottombarMenuContent() {
  const [auth, hints] = useSuspenseQueries({
    queries: [authenticateQueryOptions, hintsQueryOptions],
  })

  const pathname = useLocation({
    select: (state) => state.pathname,
  })

  return (
    <Menu.Content className="fixed bottom-16 left-2 space-y-2 focus:outline-none">
      <Menu.Item value="auth" asChild>
        <NavigationBottombarMenuContentItem asChild>
          <NavLink
            to={pathname}
            replace
            // @ts-expect-error I don't know how to solve this
            search={(prev) => ({ ...prev, modal: "auth" })}
          >
            {auth.data ? (
              <Avatar
                username={auth.data.user.username}
                src={auth.data.user.avatar}
              />
            ) : (
              <Icon src="Face" alt="Log-in" />
            )}
            <span className="truncate">
              {auth.data ? "Your profile" : "Log-in"}
            </span>
          </NavLink>
        </NavigationBottombarMenuContentItem>
      </Menu.Item>
      {navigationEntries.map(([key, route]) => (
        <Menu.Item
          key={key}
          value={route.link.to}
          disabled={route.disabled}
          asChild
        >
          <NavigationBottombarMenuContentItem disabled={route.disabled} asChild>
            <NavLink
              {...route.link}
              disabled={route.disabled}
              preload={hints.data.saveData ? "intent" : "render"}
            >
              <Icon src={route.icon} alt="" />
              <span className="truncate">{route.label}</span>
            </NavLink>
          </NavigationBottombarMenuContentItem>
        </Menu.Item>
      ))}
    </Menu.Content>
  )
}
