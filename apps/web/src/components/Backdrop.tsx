import type { HTMLArkProps } from "@ark-ui/react/factory"
import { ark } from "@ark-ui/react/factory"
import { cx } from "cva"

type Props = HTMLArkProps<"div">

export default function Backdrop({ className, ...props }: Props) {
  return (
    <ark.div
      {...props}
      aria-hidden
      className={cx(
        className,
        "fixed inset-0 bg-arpeggio-black-900/75 backdrop-blur-8",
      )}
    />
  )
}

