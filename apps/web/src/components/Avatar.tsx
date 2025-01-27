import { Avatar as AvatarPrimitive } from "@ark-ui/react/avatar"
import { cx } from "cva"
import type { ComponentProps, ComponentRef, ForwardedRef } from "react"
import { forwardRef } from "react"
import Image from "next/image"
import Icon from "./Icon"

type Props = ComponentProps<typeof AvatarPrimitive.Root> & {
  username: string
  src?: string | null
}

function Avatar(
  { username, src, className, ...props }: Props,
  ref: ForwardedRef<ComponentRef<typeof AvatarPrimitive.Root>>,
) {
  return (
    <AvatarPrimitive.Root
      ref={ref}
      className={cx(className, "relative overflow-hidden rounded-full")}
      {...props}
    >
      <AvatarPrimitive.Fallback className="absolute inset-0 size-full">
        <Icon src="Face" alt={username} className="size-full" />
      </AvatarPrimitive.Fallback>
      {src ? (
        <AvatarPrimitive.Image asChild>
          <Image
            draggable={false}
            className="absolute inset-0 size-full object-cover"
            src={src}
            alt={username}
            unoptimized
            fill
          />
        </AvatarPrimitive.Image>
      ) : null}
    </AvatarPrimitive.Root>
  )
}

export default forwardRef(Avatar)
