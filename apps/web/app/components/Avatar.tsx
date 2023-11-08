import * as AvatarPrimitive from "@radix-ui/react-avatar"
import type { User } from "lucia"
import type { ForwardedRef } from "react"
import { forwardRef } from "react"
import { cx } from "cva"
import { tailwind } from "~/lib/tailwind"
import Icon from "~/components/Icon"

function getColor(theme: string) {
  if (!(theme in tailwind.theme.colors)) {
    throw Error(`Invalid color: ${theme}`)
  }

  const color =
    tailwind.theme.colors[theme as keyof typeof tailwind.theme.colors]

  if (typeof color === "string") {
    throw Error(`Invalid color: ${theme}`)
  }

  return color
}

type Props = AvatarPrimitive.AvatarProps & {
  className: string
  user: Pick<User, "avatar" | "username" | "theme">
  alt?: string
}

function Avatar(
  { user, className, alt, ...props }: Props,
  ref: ForwardedRef<HTMLSpanElement>,
) {
  const color = getColor(user.theme)
  const label = alt || user.username

  return (
    <AvatarPrimitive.Root
      {...props}
      ref={ref}
      className={cx(className, "rounded-full inline-flex overflow-hidden")}
    >
      {user.avatar ? (
        <AvatarPrimitive.Image
          src={user.avatar}
          alt={label}
          draggable={false}
          className="w-full h-full object-cover"
          loading="lazy"
          decoding="async"
        />
      ) : (
        <AvatarPrimitive.AvatarFallback
          className="w-full h-full p-1"
          style={{ backgroundColor: color[50], color: color[700] }}
        >
          <Icon name="face" alt={label} className="w-full h-full" />
        </AvatarPrimitive.AvatarFallback>
      )}
    </AvatarPrimitive.Root>
  )
}

export default forwardRef(Avatar)
