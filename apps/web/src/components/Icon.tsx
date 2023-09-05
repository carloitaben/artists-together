import type { ComponentProps, ForwardedRef } from "react"
import { forwardRef } from "react"
import { icons, IconName } from "~/components/Icons"
import * as AccesibleIcon from "~/components/AccesibleIcon"

type Props = AccesibleIcon.AccessibleIconProps &
  Omit<ComponentProps<"svg">, "viewBox"> & {
    icon: IconName
  }

function Icon(
  { label, children, icon, ...props }: Props,
  ref: ForwardedRef<SVGSVGElement>,
) {
  return (
    <AccesibleIcon.Root label={label}>
      <svg {...props} viewBox={icons[icon]} ref={ref}>
        <use href={`#${icon}`} />
      </svg>
    </AccesibleIcon.Root>
  )
}

export default forwardRef(Icon)
