import * as AccessibleIcon from "@radix-ui/react-accessible-icon"
import type { ComponentProps, ReactElement } from "react"

type BaseProps = ComponentProps<"div">

type Props = BaseProps & {
  label: string
  children: ReactElement
}

export default function Icon({ label, children, ...props }: Props) {
  return (
    <AccessibleIcon.Root label={label}>
      <div {...props}>{children}</div>
    </AccessibleIcon.Root>
  )
}
