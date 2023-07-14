"use client"

import { ComponentProps, ReactElement, createContext, useContext } from "react"

import Icon from "~/components/Icon"

const labelContext = createContext<string>("")

type Props = {
  children: ReactElement<ComponentProps<"svg">>
  disabled?: boolean
}

export default function NavigationItem({ children, disabled }: Props) {
  const label = useContext(labelContext)

  return (
    <Icon
      aria-disabled={disabled}
      label={label}
      className="h-8 w-8 text-theme-50 group-[[aria-current='page']]:text-theme-300 aria-disabled:text-theme-700"
    >
      {children}
    </Icon>
  )
}
