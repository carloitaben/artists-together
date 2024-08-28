import { Menu } from "@ark-ui/react"
import {
  forwardRef,
  type ComponentRef,
  type Dispatch,
  type ForwardedRef,
  type SetStateAction,
} from "react"
import { motion } from "framer-motion"
import Icon from "~/components/Icon"
import NavigationBottombarMenuItem from "./NavigationBottombarMenuItem"

type Props = {
  onOpenChange: Dispatch<SetStateAction<boolean>>
}

function NavigationBottombarActions(
  { onOpenChange }: Props,
  ref: ForwardedRef<ComponentRef<typeof motion.button>>,
) {
  return (
    <Menu.Root onOpenChange={(context) => onOpenChange(context.open)}>
      <Menu.Trigger asChild>
        <motion.button
          ref={ref}
          initial={{
            opacity: 0,
            scale: 0,
          }}
          animate={{
            opacity: 1,
            scale: 1,
          }}
          exit={{
            opacity: 0,
            scale: 0,
          }}
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
          <Menu.Item value="foo" asChild>
            <NavigationBottombarMenuItem justify="between">
              <span className="truncate">More info</span>
              <Icon src="QuestionMark" alt="" />
            </NavigationBottombarMenuItem>
          </Menu.Item>
          <Menu.Item value="bar" asChild>
            <NavigationBottombarMenuItem justify="between">
              <span className="truncate">More info</span>
              <Icon src="QuestionMark" alt="" />
            </NavigationBottombarMenuItem>
          </Menu.Item>
        </Menu.Content>
      </Menu.Positioner>
    </Menu.Root>
  )
}

export default forwardRef(NavigationBottombarActions)
