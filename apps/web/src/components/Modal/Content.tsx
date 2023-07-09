"use client"

import * as TabsPrimitive from "@radix-ui/react-tabs"
import { ComponentProps, ForwardedRef, forwardRef } from "react"

type Props = {
  value?: string | number
} & ComponentProps<"div">

function Content(
  { value, children, ...props }: Props,
  ref: ForwardedRef<HTMLDivElement>
) {
  if (typeof value !== "undefined") {
    return (
      <TabsPrimitive.Content {...props} value={String(value)} ref={ref}>
        {children}
      </TabsPrimitive.Content>
    )
  }

  return (
    <div {...props} ref={ref}>
      {children}
    </div>
  )
}

export default forwardRef(Content)
