"use client"

import * as DialogPrimitive from "@radix-ui/react-dialog"
import * as TabsPrimitive from "@radix-ui/react-tabs"
import { ForwardedRef, forwardRef } from "react"

function Portal(
  { children, ...props }: DialogPrimitive.DialogContentProps,
  ref: ForwardedRef<HTMLDivElement>
) {
  return (
    <DialogPrimitive.Portal>
      <DialogPrimitive.Overlay className="fixed inset-0 bg-arpeggio-black-900/25 backdrop-blur-[24px]" />
      <div className="fixed inset-0 flex items-center justify-center">
        <DialogPrimitive.Content {...props} ref={ref}>
          <TabsPrimitive.Root orientation="vertical">
            {children}
          </TabsPrimitive.Root>
        </DialogPrimitive.Content>
      </div>
    </DialogPrimitive.Portal>
  )
}

export default forwardRef(Portal)
