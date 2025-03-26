"use client"

import { Menu } from "@ark-ui/react/menu"
import { motion } from "motion/react"
import type {
  ComponentRef,
  Dispatch,
  ForwardedRef,
  SetStateAction,
} from "react"
import { forwardRef } from "react"
import Icon from "~/components/Icon"
import type { NavigationAction } from "~/lib/navigation/shared"
import { scalePresenceVariants, spring } from "../lib"
import NavigationBottombarMenuItem from "./NavigationBottombarMenuContentItem"

type Props = {
  onOpenChange: Dispatch<SetStateAction<boolean>>
  actions: NavigationAction[]
}

function NavigationBottombarActions(
  { actions, onOpenChange }: Props,
  ref: ForwardedRef<ComponentRef<typeof motion.button>>,
) {
  return (
    <Menu.Root onOpenChange={(context) => onOpenChange(context.open)}>
      <Menu.Trigger asChild>
        <motion.button
          ref={ref}
          initial="hide"
          animate="show"
          exit="hide"
          variants={scalePresenceVariants}
          transition={spring}
          className="grid size-12 place-items-center overflow-hidden bg-arpeggio-black-800 text-gunpla-white-50"
          style={{
            borderRadius: 16,
            boxShadow: "0px 4px 8px rgba(11, 14, 30, 0.08)",
          }}
        >
          <Icon src="More" alt="Actions" className="size-6" />
        </motion.button>
      </Menu.Trigger>
      <Menu.Positioner>
        <Menu.Content className="space-y-2 focus:outline-none">
          {actions.map((action) => (
            <Menu.Item key={action.label} value={action.label} asChild>
              <NavigationBottombarMenuItem justify="between" asChild>
                {"link" in action ? (
                  <a {...action.link}>
                    <span className="truncate">{action.label}</span>
                    <Icon src={action.icon} alt="" />
                  </a>
                ) : null}
              </NavigationBottombarMenuItem>
            </Menu.Item>
          ))}
        </Menu.Content>
      </Menu.Positioner>
    </Menu.Root>
  )
}

export default forwardRef(NavigationBottombarActions)
