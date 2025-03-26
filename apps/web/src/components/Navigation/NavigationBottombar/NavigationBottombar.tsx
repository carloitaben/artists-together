"use client"

import { AnimatePresence, motion, useMotionValue } from "motion/react"
import type { ComponentRef } from "react"
import { useEffect, useRef, useState } from "react"
import { onMeasure } from "~/lib/media"
import { useNavigationMatch } from "~/lib/navigation/client"
import NavigationBottombarActions from "./NavigationBottombarActions"
import NavigationBottombarMenu from "./NavigationBottombarMenu"
import NavigationBottombarSearch from "./NavigationBottombarSearch"

export default function NavigationBottombar() {
  const [searchbarFocus, setSearchbarFocus] = useState(false)
  const [showBackdrop, setShowBackdrop] = useState(false)
  const ref = useRef<ComponentRef<"div">>(null)
  const match = useNavigationMatch()
  const inputMinWidth = useMotionValue(0)

  useEffect(() => {
    return onMeasure(ref.current, (rect) => {
      inputMinWidth.set(rect.width - rect.height * 2)
    })
  }, [inputMinWidth])

  return (
    <>
      {showBackdrop ? <div className="backdrop sm:hidden" /> : null}
      <motion.div
        ref={ref}
        className="fixed inset-x-0 bottom-0 flex h-16 flex-row-reverse items-stretch justify-center gap-1 p-2 sm:hidden"
        layoutScroll
      >
        <AnimatePresence initial={false} mode="popLayout">
          {match?.actions.length ? (
            <NavigationBottombarActions
              key="actions"
              actions={match.actions}
              onOpenChange={setShowBackdrop}
            />
          ) : null}
          {match?.search ? (
            <NavigationBottombarSearch
              key="search"
              placeholder={
                typeof match.search === "string"
                  ? match.search
                  : "Search something"
              }
              searchbarFocus={searchbarFocus}
              setSearchbarFocus={setSearchbarFocus}
              minWidth={inputMinWidth}
            />
          ) : null}
        </AnimatePresence>
        <NavigationBottombarMenu
          label={match?.label || "404"}
          searchbarFocus={searchbarFocus}
          onOpenChange={setShowBackdrop}
          minWidth={inputMinWidth}
        />
      </motion.div>
    </>
  )
}
