"use client"

import { Menu } from "@ark-ui/react/menu"
import { useSuspenseQuery } from "@tanstack/react-query"
import type { CSSProperties } from "react"
import Avatar from "~/components/Avatar"
import Icon from "~/components/Icon"
import NavLink from "~/components/NavLink"
import { userQueryOptions } from "~/features/auth/shared"
import { navigation } from "~/lib/navigation/shared"
import { useHints } from "~/lib/promises"
import NavigationAuthLink from "../NavigationAuthLink"
import NavigationBottombarMenuContentItem from "./NavigationBottombarMenuContentItem"

export default function NavigationBottombarMenuContent() {
  const user = useSuspenseQuery(userQueryOptions)
  const hints = useHints()

  return (
    <Menu.Content className="fixed bottom-16 left-2 space-y-2 focus:outline-none">
      <Menu.Item
        value="auth"
        asChild
        style={
          {
            "--animation-in-delay": `${(navigation.length + 1) * 10}ms`,
          } as CSSProperties
        }
      >
        <NavigationBottombarMenuContentItem asChild>
          <NavigationAuthLink>
            {user.data ? (
              <Avatar username={user.data.username} src={user.data.avatar} />
            ) : (
              <Icon src="Face" alt="Log-in" />
            )}
            <span className="truncate">{user ? "Your profile" : "Log-in"}</span>
          </NavigationAuthLink>
        </NavigationBottombarMenuContentItem>
      </Menu.Item>
      {navigation.map((item, index, array) => (
        <Menu.Item
          key={item.id}
          value={item.link.href.toString()}
          disabled={item.link.disabled}
          style={
            {
              "--animation-in-delay": `${(array.length + 1 - index) * 10}ms`,
            } as CSSProperties
          }
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
