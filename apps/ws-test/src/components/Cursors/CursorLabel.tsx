import { ComponentProps, ReactNode } from "react"
import { cx } from "class-variance-authority"

type Props = ComponentProps<"div"> & {
  children: ReactNode
}

export default function CursorLabel({ className, children, ...props }: Props) {
  return (
    <div
      {...props}
      className={cx(
        className,
        "bg-white rounded-full inline-flex h-6 px-2 items-center justify-center text-center text-sm whitespace-nowrap shadow-[0px_4px_8px_rgba(0,0,0,0.12)]"
      )}
    >
      {children}
    </div>
  )
}
