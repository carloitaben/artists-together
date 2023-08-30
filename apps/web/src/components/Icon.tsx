import type { ComponentProps, ForwardedRef } from "react"
import { forwardRef } from "react"
import type { IconName } from "~/components/Icons"
import * as AccesibleIcon from "~/components/AccesibleIcon"

type Props = AccesibleIcon.AccessibleIconProps &
  ComponentProps<"svg"> & {
    icon: IconName
  }

function Icon(
  { label, children, icon, ...props }: Props,
  ref: ForwardedRef<SVGSVGElement>,
) {
  return (
    <AccesibleIcon.Root label={label}>
      <svg {...props} ref={ref}>
        <use href={`#${icon}`} />
      </svg>
    </AccesibleIcon.Root>
  )
}

export default forwardRef(Icon)
