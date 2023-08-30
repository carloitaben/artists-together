import { cx } from "class-variance-authority"

import type { IconName } from "~/components/Icons"
import Icon from "~/components/Icon"
import Shiny from "~/components/Shiny"

export default function NavigationItem({
  label,
  icon,
  disabled,
}: {
  label: string
  icon: IconName
  disabled?: boolean
}) {
  return (
    <Shiny enabled={!disabled}>
      <div
        className={cx(
          "my-1 ml-4 mr-7 flex items-center gap-5 rounded-full p-3 text-sm",
          "group-focus-visible:ring-4 group-[[aria-current='page']]:bg-theme-300 group-[[aria-current='page']]:text-theme-900",
          disabled && "text-theme-700",
        )}
      >
        <Icon icon={icon} label={label} className="h-6 w-6 flex-none" />
        <span className="truncate">{label}</span>
      </div>
    </Shiny>
  )
}
