"use client"

import * as TabsPrimitve from "@radix-ui/react-tabs"
import { ForwardedRef, forwardRef } from "react"
import { cx } from "class-variance-authority"

type Props = Omit<TabsPrimitve.TabsTriggerProps, "asChild" | "value"> & {
  value: number
}

function Step(
  { className, children, value, ...props }: Props,
  ref: ForwardedRef<HTMLButtonElement>
) {
  return (
    <TabsPrimitve.Trigger
      {...props}
      ref={ref}
      value={String(value)}
      className={cx(
        className,
        "group flex items-center gap-2 rounded-full p-2 text-sm"
      )}
    >
      <div className="flex h-5 w-5 flex-none items-center justify-center rounded-full bg-gunpla-white-300 text-center text-[0.9375rem] font-bold text-gunpla-white-50 group-radix-state-active:bg-gunpla-white-500">
        {value}
      </div>
      <span className="text-sm text-gunpla-white-300 group-radix-state-active:text-gunpla-white-500">
        {children}
      </span>
    </TabsPrimitve.Trigger>
  )
}

export default forwardRef(Step)
