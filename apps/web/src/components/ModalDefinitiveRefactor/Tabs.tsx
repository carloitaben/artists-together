"use client"

import * as TabsPrimitve from "@radix-ui/react-tabs"
import { ForwardedRef, forwardRef } from "react"
import { cx } from "class-variance-authority"

function Tabs(
  { className, ...props }: TabsPrimitve.TabsListProps,
  ref: ForwardedRef<HTMLDivElement>
) {
  return (
    <TabsPrimitve.List
      {...props}
      ref={ref}
      className={cx(className, "grid w-56 gap-2")}
    />
  )
}

export default forwardRef(Tabs)
