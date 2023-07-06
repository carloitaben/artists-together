"use client"

import * as TabsPrimitive from "@radix-ui/react-tabs"
import { ForwardedRef, forwardRef } from "react"
import { cx } from "class-variance-authority"

function Tabs(
  { className, ...props }: TabsPrimitive.TabsListProps,
  ref: ForwardedRef<HTMLDivElement>
) {
  return (
    <TabsPrimitive.List
      {...props}
      ref={ref}
      className={cx(
        className,
        "absolute -left-4 top-0 grid w-56 -translate-x-full gap-2"
      )}
    />
  )
}

export default forwardRef(Tabs)
