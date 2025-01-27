"use client"

import { Menu } from "@ark-ui/react/menu"
import { navigation } from "~/lib/navigation/shared"
import { useUser, useHints } from "~/lib/promises"
import Icon from "~/components/Icon"
import NavLink from "~/components/NavLink"
import Avatar from "~/components/Avatar"
import NavigationAuthLink from "../NavigationAuthLink"
import NavigationBottombarMenuContentItem from "./NavigationBottombarMenuContentItem"

export default function NavigationBottombarMenuContent() {
  const user = useUser()
  const hints = useHints()

  return (
    <Menu.Content className="fixed bottom-16 left-2 space-y-2 focus:outline-none">
      <Menu.Item value="auth" asChild>
        <NavigationBottombarMenuContentItem asChild>
          <NavigationAuthLink>
            {user ? (
              <Avatar username={user.username} src={user.avatar} />
            ) : (
              <Icon src="Face" alt="Log-in" />
            )}
            <span className="truncate">{user ? "Your profile" : "Log-in"}</span>
          </NavigationAuthLink>
        </NavigationBottombarMenuContentItem>
      </Menu.Item>
      {navigation.map((item) => (
        <Menu.Item
          key={item.id}
          value={item.link.href.toString()}
          disabled={item.link.disabled}
          asChild
        >
          <NavigationBottombarMenuContentItem
            disabled={item.link.disabled}
            asChild
          >
            <NavLink {...item.link} prefetch={!hints.saveData}>
              <Icon src={item.icon} alt="" />
              <span className="truncate">{item.label}</span>
            </NavLink>
          </NavigationBottombarMenuContentItem>
        </Menu.Item>
      ))}
    </Menu.Content>
  )
}
