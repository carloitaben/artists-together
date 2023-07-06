"use client"

import * as DialogPrimitive from "@radix-ui/react-dialog"
import * as TabsPrimitive from "@radix-ui/react-tabs"
import { VariantProps, cva, cx } from "class-variance-authority"
import {
  Children,
  ForwardedRef,
  ReactNode,
  forwardRef,
  isValidElement,
} from "react"

import Tabs from "./Tabs"
import Steps from "./Steps"

function getTabsOrientation(
  node?: ReactNode
): TabsPrimitive.TabsProps["orientation"] {
  // Bail out if node is falsy
  if (!node) return

  // Discard non-element nodes
  if (!isValidElement(node)) return

  // Early bail out if found
  if (node.type === Tabs) return "vertical"
  if (node.type === Steps) return "horizontal"

  // Bail out if children is falsy
  if (!node.props?.children) return

  if (!Array.isArray(node.props.children)) {
    return getTabsOrientation(node.props.children)
  }

  return getTabsOrientation(node.props.children.find(getTabsOrientation))
}

const wrapper = cva("fixed inset-0 flex justify-center", {
  variants: {
    align: {
      start: "items-start pt-[33.333vh]",
      center: "items-center",
    },
  },
  defaultVariants: {
    align: "start",
  },
})

function Portal(
  {
    children,
    className,
    align,
    ...props
  }: DialogPrimitive.DialogContentProps & VariantProps<typeof wrapper>,
  ref: ForwardedRef<HTMLDivElement>
) {
  const orientation = getTabsOrientation(
    Children.toArray(children).find(getTabsOrientation)
  )

  return (
    <DialogPrimitive.Portal>
      <DialogPrimitive.Overlay className="fixed inset-0 bg-arpeggio-black-900/25 backdrop-blur-[24px]" />
      <div className={wrapper({ align })}>
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
      </div>
    </DialogPrimitive.Portal>
  )
}

export default forwardRef(Portal)
