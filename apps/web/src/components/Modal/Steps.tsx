"use client"

import * as TabsPrimitive from "@radix-ui/react-tabs"
import { ForwardedRef, forwardRef } from "react"
import { cx } from "class-variance-authority"

function Steps(
  { className, ...props }: TabsPrimitive.TabsListProps,
  ref: ForwardedRef<HTMLDivElement>
) {
  return (
    <div className="flex items-center justify-between">
      <TabsPrimitive.List
        {...props}
        ref={ref}
        className={cx(
          className,
          "flex rounded-full bg-gunpla-white-50 p-2 shadow-[0px_4px_16px_0px_rgba(0,0,0,0.08)]"
        )}
      />
      <div className="flex">
        <button className="h-12 w-12 rounded-full bg-gunpla-white-50">
          prev
        </button>
        <button className="h-12 w-12 rounded-full bg-gunpla-white-50">
          next
        </button>
      </div>
    </div>
  )
}

export default forwardRef(Steps)
