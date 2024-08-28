"use client"

import { Menu } from "@ark-ui/react"
import { motion } from "framer-motion"
import type { CSSProperties } from "react"
import { useRef, useState } from "react"
import { useMeasure } from "~/lib/react/client"
import Icon from "~/components/Icon"
import NavigationBottombarSearch from "./NavigationBottombarSearch"
import NavigationBottombarMenuItem from "./NavigationBottombarMenuItem"
import NavigationBottombarMenu from "./NavigationBottombarMenu"

export default function NavigationBottombar() {
  const [searchbarFocus, setSearchbarFocus] = useState(false)
  const ref = useRef(null)
  const refRect = useMeasure(ref)
  const inputMinWidth = refRect.width - refRect.height * 2

  return (
    <motion.div
      ref={ref}
      className="fixed inset-x-0 bottom-0 flex h-16 items-stretch justify-center gap-1 p-2 sm:hidden"
      style={{ "--min-w": `${inputMinWidth}px` } as CSSProperties}
      layoutScroll
    >
      <NavigationBottombarMenu searchbarFocus={searchbarFocus} />
      <NavigationBottombarSearch
        searchbarFocus={searchbarFocus}
        setSearchbarFocus={setSearchbarFocus}
      />
      <Menu.Root>
        <Menu.Trigger asChild>
          <motion.button
            className="grid size-12 place-items-center overflow-hidden bg-arpeggio-black-800 text-gunpla-white-50"
            style={{
              borderRadius: 16,
              boxShadow: "0px 4px 8px rgba(11, 14, 30, 0.08)",
            }}
          >
            <Icon src="More" alt="More actions" className="size-6" />
          </motion.button>
        </Menu.Trigger>
        <Menu.Positioner>
          <Menu.Content>
            <Menu.Item value="foo">
              <NavigationBottombarMenuItem revert icon="QuestionMark">
                More info
              </NavigationBottombarMenuItem>
            </Menu.Item>
            <Menu.Item value="bar">
              <NavigationBottombarMenuItem revert icon="QuestionMark">
                More info
              </NavigationBottombarMenuItem>
            </Menu.Item>
          </Menu.Content>
        </Menu.Positioner>
      </Menu.Root>
    </motion.div>
  )
}
