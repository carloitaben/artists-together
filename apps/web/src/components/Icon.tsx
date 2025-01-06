import type { ComponentProps } from "react"
import type { IconName } from "~/assets/spritesheet/types"
import spritesheet from "~/assets/spritesheet/spritesheet.svg"

type Props = Omit<ComponentProps<"svg">, "children"> & {
  src: IconName
  alt: string
}

export default function Icon({ src, alt, ...props }: Props) {
  return (
    <>
      <svg
        focusable={false}
        xmlns="http://www.w3.org/2000/svg"
        xmlnsXlink="http://www.w3.org/1999/xlink"
        aria-hidden
        {...props}
      >
        <use href={`${spritesheet}#${src}`} />
      </svg>
      {alt ? <span className="sr-only">{alt}</span> : null}
    </>
  )
}
