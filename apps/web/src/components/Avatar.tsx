import { Avatar as AvatarPrimitive } from "@ark-ui/react"
import type { ComponentProps, ComponentRef, ForwardedRef } from "react"
import { forwardRef } from "react"
import Icon from "./Icon"
import { cx } from "cva"
import Image from "next/image"

type Props = ComponentProps<typeof AvatarPrimitive.Root> & {
  src?: string | null
  username: string
}

function Avatar(
  { src, username, className, ...props }: Props,
  ref: ForwardedRef<ComponentRef<typeof AvatarPrimitive.Root>>,
) {
  const alt = `@${username}'s avatar`

  return (
    <AvatarPrimitive.Root
      {...props}
      ref={ref}
      className={cx(className, "relative overflow-hidden rounded-full")}
    >
      <AvatarPrimitive.Fallback className="absolute inset-0 size-full" asChild>
        <Icon name="face" alt="" />
      </AvatarPrimitive.Fallback>
      <AvatarPrimitive.Image
        src={src || ""}
        alt={alt}
        className="absolute inset-0 size-full object-cover"
      />
      {/* <AvatarPrimitive.Image asChild>
        <Image
          src={src}
          alt={alt}
          fill
          className="absolute inset-0 size-full object-cover"
        />
      </AvatarPrimitive.Image> */}
    </AvatarPrimitive.Root>
  )
}

export default forwardRef(Avatar)
