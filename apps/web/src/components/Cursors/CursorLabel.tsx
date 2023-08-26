import { ComponentProps } from "react"
import { cx } from "class-variance-authority"

type Props = ComponentProps<"div"> & {
  emoji?: boolean
}

export default function CursorLabel({
  emoji,
  className,
  children,
  ...props
}: Props) {
  return (
    <div
      {...props}
      className={cx(
        className,
        emoji
          ? "inline-block text-2xl"
          : "inline-flex h-6 items-center justify-center whitespace-nowrap rounded-full bg-not-so-white px-2 text-center text-sm text-not-so-black shadow-[0px_4px_8px_rgba(0,0,0,0.12)]",
      )}
    >
      {children}
    </div>
  )
}
