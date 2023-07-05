import * as AccesibleIcon from "@radix-ui/react-accessible-icon"
import type { ComponentProps, ForwardedRef, ReactElement } from "react"
import { cloneElement, forwardRef } from "react"

type Props = AccesibleIcon.AccessibleIconProps &
  ComponentProps<"svg"> & {
    children: ReactElement<ComponentProps<"svg">>
  }

function Icon(
  { label, children, ...props }: Props,
  ref: ForwardedRef<SVGSVGElement>
) {
  return (
    <AccesibleIcon.Root label={label}>
      {cloneElement(children, { ...children.props, ...props, ref })}
    </AccesibleIcon.Root>
  )
}

export default forwardRef(Icon)
