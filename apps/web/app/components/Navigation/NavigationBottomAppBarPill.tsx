import { cx } from "cva"
import type { ComponentProps, ForwardedRef, ReactNode } from "react"
import { forwardRef } from "react"
import Icon from "~/components/Icon"

type Props = ComponentProps<"div"> & {
  icon: ReactNode
  active?: boolean
}

function NavigationBottomAppBarPill(
  { icon, children, active, className, ...props }: Props,
  ref: ForwardedRef<HTMLDivElement>,
) {
  return (
    <div
      {...props}
      ref={ref}
      className={cx(
        className,
        "flex rounded-2xl gap-5 p-3 items-center",
        active
          ? "bg-theme-300 text-theme-900"
          : "bg-theme-900 text-theme-50 hover:bg-theme-300 hover:text-theme-900",
      )}
    >
      {typeof icon === "string" ? (
        <Icon name={icon} alt="" className="w-6 h-6 flex-none" />
      ) : (
        icon
      )}
      <span className="truncate">{children}</span>
    </div>
  )
}

export default forwardRef(NavigationBottomAppBarPill)
