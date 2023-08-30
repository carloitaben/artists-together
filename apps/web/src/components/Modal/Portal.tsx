import * as DialogPrimitive from "~/components/Dialog"
import * as TabsPrimitive from "~/components/Tabs"
import { VariantProps, cva, cx } from "class-variance-authority"
import { ForwardedRef, forwardRef } from "react"

type Props = DialogPrimitive.DialogContentProps &
  VariantProps<typeof wrapper> & {
    kind?: "tabs" | "steps" | "anchors"
  }

function getOrientation(kind: Props["kind"]) {
  switch (kind) {
    case "tabs":
    case "anchors":
      return "vertical"
    case "steps":
      return "horizontal"
    default:
      return null
  }
}

const wrapper = cva(
  "flex justify-center fixed inset-0 bg-arpeggio-black-900/25 backdrop-blur-[24px]",
  {
    variants: {
      align: {
        start: "items-start pt-[33.333vh]",
        center: "items-center",
      },
    },
    defaultVariants: {
      align: "start",
    },
  },
)

function Portal(
  { children, className, align, kind, ...props }: Props,
  ref: ForwardedRef<HTMLDivElement>,
) {
  const orientation = getOrientation(kind)

  return (
    <DialogPrimitive.Portal>
      <DialogPrimitive.Overlay className={wrapper({ align })}>
        <DialogPrimitive.Content
          {...props}
          ref={ref}
          className={cx(className, "relative")}
        >
          {orientation ? (
            <TabsPrimitive.Root orientation={orientation}>
              {children}
            </TabsPrimitive.Root>
          ) : (
            children
          )}
        </DialogPrimitive.Content>
      </DialogPrimitive.Overlay>
    </DialogPrimitive.Portal>
  )
}

export default forwardRef(Portal)
