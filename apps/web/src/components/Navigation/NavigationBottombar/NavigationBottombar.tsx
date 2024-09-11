"use client"

import type { CSSProperties } from "react"
import { useRef, useState } from "react"
import { AnimatePresence, motion } from "framer-motion"
import { useMeasure, useRoute } from "~/lib/react/client"
import Scrim from "~/components/Scrim"
import NavigationBottombarMenu from "./NavigationBottombarMenu"
import NavigationBottombarSearch from "./NavigationBottombarSearch"
import NavigationBottombarActions from "./NavigationBottombarActions"

export default function NavigationBottombar() {
  const [searchbarFocus, setSearchbarFocus] = useState(false)
  const [showScrim, setShowScrim] = useState(false)
  const route = useRoute()
  const ref = useRef(null)
  const refRect = useMeasure(ref)
  const inputMinWidth = refRect.width - refRect.height * 2

  return (
    <>
      {showScrim ? <Scrim /> : null}
      <motion.div
        ref={ref}
        className="fixed inset-x-0 bottom-0 flex h-16 flex-row-reverse items-stretch justify-center gap-1 p-2 sm:hidden"
        style={{ "--min-w": `${inputMinWidth}px` } as CSSProperties}
        layoutScroll
      >
        <AnimatePresence initial={false} mode="popLayout">
          {route.actions.length ? (
            <NavigationBottombarActions
              key="actions"
              onOpenChange={setShowScrim}
            />
          ) : null}
          {route.search ? (
            <NavigationBottombarSearch
              key="search"
              searchbarFocus={searchbarFocus}
              setSearchbarFocus={setSearchbarFocus}
            />
          ) : null}
        </AnimatePresence>
        <NavigationBottombarMenu
          searchbarFocus={searchbarFocus}
          onOpenChange={setShowScrim}
        />
      </motion.div>
    </>
  )
}
