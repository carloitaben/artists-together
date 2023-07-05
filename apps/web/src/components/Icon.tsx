import * as AccesibleIcon from "@radix-ui/react-accessible-icon"
import { ComponentProps } from "react"

type Props = ComponentProps<"div"> & AccesibleIcon.AccessibleIconProps

export default function Icon({ label, children, ...props }: Props) {
  return (
    <div {...props}>
      <AccesibleIcon.Root label={label}>{children}</AccesibleIcon.Root>
    </div>
  )
}
