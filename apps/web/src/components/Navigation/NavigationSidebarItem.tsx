import type {
  ComponentPropsWithoutRef,
  ComponentRef,
  ForwardedRef,
} from "react"
import { forwardRef } from "react"
import { cx } from "cva"
import Slot from "~/components/Slot"

type Props = ComponentPropsWithoutRef<"span"> & {
  asChild?: boolean
}

function NavigationSidebarItem(
  { asChild, className, ...props }: Props,
  ref: ForwardedRef<ComponentRef<"span">>,
) {
  const Component = asChild ? Slot : "span"

  return (
    <Component
      {...props}
      ref={ref}
      className={cx(
        className,
        "grid size-12 place-items-center rounded-lg",
        "text-arpeggio-black-700",
        "group-hover:bg-arpeggio-black-300 group-hover:text-arpeggio-black-700",
        "group-aria-selected:text-arpeggio-black-300 group-aria-selected:group-hover:text-arpeggio-black-700",
      )}
    />
  )
}

export default forwardRef(NavigationSidebarItem)
