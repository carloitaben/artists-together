"use client"

import * as TabsPrimitve from "@radix-ui/react-tabs"
import { ForwardedRef, forwardRef } from "react"
import { cx } from "class-variance-authority"

function Steps(
  { className, ...props }: TabsPrimitve.TabsListProps,
  ref: ForwardedRef<HTMLDivElement>
) {
  return (
    <TabsPrimitve.List
      {...props}
      ref={ref}
      className={cx(className, "flex h-56 gap-2")}
    />
  )
}

export default forwardRef(Steps)
