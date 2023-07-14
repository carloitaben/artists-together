"use client"
import { ComponentProps, ReactElement } from "react"
import { cx } from "class-variance-authority"

import Icon from "~/components/Icon"
import Shiny from "~/components/Shiny"

export default function NavigationItem({
  label,
  children,
  disabled,
}: {
  label: string
  children: ReactElement<ComponentProps<"svg">>
  disabled?: boolean
}) {
  return (
    <Shiny enabled={!disabled}>
      <div
        className={cx(
          "my-1 ml-4 mr-7 flex items-center gap-5 rounded-full p-3 text-sm",
          "group-focus-visible:ring-4 group-[[aria-current='page']]:bg-theme-300 group-[[aria-current='page']]:text-theme-900",
          disabled && "text-theme-700"
        )}
      >
        <Icon label={label} className="h-6 w-6 flex-none">
          {children}
        </Icon>
        <span className="truncate">{label}</span>
      </div>
    </Shiny>
  )
}
