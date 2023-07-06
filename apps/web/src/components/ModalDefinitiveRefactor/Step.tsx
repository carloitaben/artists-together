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
        "flex items-center gap-x-2 rounded-full bg-gunpla-white-50 p-3 text-sm text-gunpla-white-300 shadow-[0px_4px_16px_0px_rgba(0,0,0,0.08)] radix-state-active:text-gunpla-white-500"
      )}
    >
      <span className="block rounded-full">{value}</span>
      <span>{children}</span>
    </TabsPrimitve.Trigger>
  )
}

export default forwardRef(Step)
