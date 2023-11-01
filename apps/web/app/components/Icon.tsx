import type { ComponentProps } from "react"
import * as AccesibleIcon from "@radix-ui/react-accessible-icon"
import names from "virtual:svg-icons-ssr-names"

type Props = Omit<AccesibleIcon.AccessibleIconProps, "children"> &
  ComponentProps<"svg"> & {
    name: string
  }

export default function Icon({ name, label, ...props }: Props) {
  if (import.meta.env.DEV) {
    if (!names.includes(name)) {
      throw Error(
        `Invalid svg name: ${name}. Available names: ${names.join(", ")}`,
      )
    }
  }

  return (
    <AccesibleIcon.Root label={label}>
      <svg
        xmlns="http://www.w3.org/2000/svg"
        xmlnsXlink="http://www.w3.org/1999/xlink"
        {...props}
      >
        <use xlinkHref={`#${name}`} />
      </svg>
    </AccesibleIcon.Root>
  )
}
