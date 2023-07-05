import { ComponentProps, ReactNode } from "react"
import { cx } from "class-variance-authority"

type Props = ComponentProps<"div">

export default function CursorLabel({ className, children, ...props }: Props) {
  return (
    <div
      {...props}
      className={cx(
        className,
        "inline-flex h-6 items-center justify-center whitespace-nowrap rounded-full bg-not-so-white px-2 text-center text-sm text-not-so-black shadow-[0px_4px_8px_rgba(0,0,0,0.12)]"
      )}
    >
      {children}
    </div>
  )
}
