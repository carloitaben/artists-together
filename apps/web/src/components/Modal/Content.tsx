import { ComponentProps, ForwardedRef, forwardRef } from "react"
import * as TabsPrimitive from "~/components/Tabs"

type Props = {
  value?: string | number
} & ComponentProps<"div">

function Content(
  { value, children, ...props }: Props,
  ref: ForwardedRef<HTMLDivElement>,
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
