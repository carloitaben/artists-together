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
      className={cx(
        className,
        "inline-flex rounded-full bg-gunpla-white-50 p-2 shadow-[0px_4px_16px_0px_rgba(0,0,0,0.08)]"
      )}
    />
  )
}

export default forwardRef(Steps)
