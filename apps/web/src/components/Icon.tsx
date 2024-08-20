import type {
  ComponentPropsWithoutRef,
  ComponentRef,
  ForwardedRef,
} from "react"
import { forwardRef } from "react"
import type { IconName } from "~/lib/types/icons"

type Props = Omit<ComponentPropsWithoutRef<"svg">, "children"> & {
  name: IconName
  alt: string
}

function Icon(
  { name, alt, ...props }: Props,
  ref: ForwardedRef<ComponentRef<"svg">>,
) {
  const svg = (
    <svg {...props} ref={ref} focusable={false} aria-hidden>
      <use href={`./spritesheet.svg#${name}`} />
    </svg>
  )

  if (alt) {
    return (
      <>
        {
          <svg {...props} ref={ref} focusable={false} aria-hidden>
            <use href={`./spritesheet.svg#${name}`} />
          </svg>
        }
        <span className="sr-only">{alt}</span>
      </>
    )
  }

  return svg
}

export default forwardRef(Icon)
