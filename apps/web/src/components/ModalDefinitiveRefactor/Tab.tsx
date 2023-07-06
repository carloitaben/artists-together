"use client"

import * as TabsPrimitve from "@radix-ui/react-tabs"
import { ComponentProps, ForwardedRef, ReactElement, forwardRef } from "react"
import { cx } from "class-variance-authority"

import Icon from "~/components/Icon"

type Props = Omit<TabsPrimitve.TabsTriggerProps, "asChild"> & {
  icon?: ReactElement<ComponentProps<"svg">>
}

function Tab(
  { className, children, icon, ...props }: Props,
  ref: ForwardedRef<HTMLButtonElement>
) {
  return (
    <TabsPrimitve.Trigger
      {...props}
      ref={ref}
      className={cx(
        className,
        "flex items-center gap-x-2 rounded-full bg-gunpla-white-50 p-3 text-sm text-gunpla-white-300 shadow-[0px_4px_16px_0px_rgba(0,0,0,0.08)] radix-state-active:text-gunpla-white-500"
      )}
    >
      {icon ? (
        <Icon className="h-6 w-6" label="Log-in">
          {icon}
        </Icon>
      ) : null}
      <span>{children}</span>
    </TabsPrimitve.Trigger>
  )
}

export default forwardRef(Tab)
