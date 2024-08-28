import type { VariantProps } from "cva"
import { cva } from "cva"
import type {
  ComponentProps,
  ComponentRef,
  ForwardedRef,
  ReactNode,
} from "react"
import { forwardRef } from "react"
import Icon from "~/components/Icon"
import type { IconName } from "~/lib/icons"

const item = cva({
  base: "flex h-12 items-center rounded-2xl py-3 gap-5 min-w-44",
  variants: {
    revert: {
      true: "justify-between flex-row-reverse pr-3 pl-4",
      false: "justify-start pl-3 pr-4",
    },
    active: {
      true: "text-arpeggio-black-900 bg-arpeggio-black-300",
      false: "text-gunpla-white-50 bg-arpeggio-black-900",
    },
    disabled: {
      true: "cursor-not-allowed",
      false: "",
    },
  },
  defaultVariants: {
    revert: false,
    active: false,
    disabled: false,
  },
})

type Props = Omit<ComponentProps<"span">, "children"> &
  VariantProps<typeof item> & {
    icon: IconName
    children: ReactNode
  }

function BottombarMenuItem(
  { className, icon, children, revert, ...props }: Props,
  ref: ForwardedRef<ComponentRef<"span">>,
) {
  return (
    <span {...props} ref={ref} className={item({ className, revert })}>
      <Icon src={icon} alt="" className="size-6 flex-none" />
      <span className="truncate">{children}</span>
    </span>
  )
}

export default forwardRef(BottombarMenuItem)
