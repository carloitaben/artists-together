import { ForwardedRef, forwardRef } from "react"
import { cx } from "class-variance-authority"

import * as TabsPrimitive from "~/components/Tabs"
import Shiny from "~/components/Shiny"

function Steps(
  { className, ...props }: TabsPrimitive.TabsListProps,
  ref: ForwardedRef<HTMLDivElement>,
) {
  return (
    <div className="mb-4 flex items-center justify-between">
      <TabsPrimitive.List
        {...props}
        ref={ref}
        className={cx(
          className,
          "flex rounded-full bg-gunpla-white-50 p-2 shadow-[0px_4px_16px_0px_rgba(0,0,0,0.08)]",
        )}
      />
      <div className="flex gap-2">
        <Shiny>
          <button className="h-12 w-12 rounded-full bg-gunpla-white-50 shadow-[0px_4px_16px_0px_rgba(0,0,0,0.08)]">
            prev
          </button>
        </Shiny>
        <Shiny>
          <button className="h-12 w-12 rounded-full bg-gunpla-white-50 shadow-[0px_4px_16px_0px_rgba(0,0,0,0.08)]">
            next
          </button>
        </Shiny>
      </div>
    </div>
  )
}

export default forwardRef(Steps)
