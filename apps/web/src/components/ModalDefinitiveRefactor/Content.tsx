"use client"

import * as TabsPrimitve from "@radix-ui/react-tabs"
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
      <TabsPrimitve.Content {...props} value={String(value)} ref={ref}>
        {children}
      </TabsPrimitve.Content>
    )
  }

  return (
    <div {...props} ref={ref}>
      {children}
    </div>
  )
}

export default forwardRef(Content)
