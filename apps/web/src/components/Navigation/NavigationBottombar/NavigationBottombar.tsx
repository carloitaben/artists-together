import { useChildMatches } from "@tanstack/react-router"
import type { ComponentProps, CSSProperties, ComponentRef } from "react"
import { useRef, useState } from "react"
import { AnimatePresence, motion } from "motion/react"
import { useMeasure } from "~/lib/media"
import Backdrop from "~/components/Backdrop"
import NavigationBottombarMenu from "./NavigationBottombarMenu"
import NavigationBottombarSearch from "./NavigationBottombarSearch"
import NavigationBottombarActions from "./NavigationBottombarActions"

export default function NavigationBottombar() {
  const [searchbarFocus, setSearchbarFocus] = useState(false)
  const [showBackdrop, setShowBackdrop] = useState(false)
  const ref = useRef<ComponentRef<"div">>(null)
  const refRect = useMeasure(ref)
  const routeStaticData = useChildMatches({
    select: ([match]) => match?.staticData,
  })

  const inputMinWidth = refRect ? refRect.width - refRect.height * 2 : 0

  return (
    <>
      {showBackdrop ? <Backdrop className="sm:hidden" /> : null}
      <motion.div
        ref={ref}
        className="fixed inset-x-0 bottom-0 flex h-16 flex-row-reverse items-stretch justify-center gap-1 p-2 sm:hidden"
        style={{ "--min-w": `${inputMinWidth}px` } as CSSProperties}
        layoutScroll
      >
        <AnimatePresence initial={false} mode="popLayout">
          {routeStaticData?.actions?.length ? (
            <NavigationBottombarActions
              key="actions"
              actions={routeStaticData.actions}
              onOpenChange={setShowBackdrop}
            />
          ) : null}
          {routeStaticData?.search ? (
            <NavigationBottombarSearch
              key="search"
              placeholder={
                typeof routeStaticData.search === "string"
                  ? routeStaticData.search
                  : "Search something"
              }
              searchbarFocus={searchbarFocus}
              setSearchbarFocus={setSearchbarFocus}
            />
          ) : null}
        </AnimatePresence>
        <NavigationBottombarMenu
          label={routeStaticData?.label || "404"}
          searchbarFocus={searchbarFocus}
          onOpenChange={setShowBackdrop}
        />
      </motion.div>
    </>
  )
}
