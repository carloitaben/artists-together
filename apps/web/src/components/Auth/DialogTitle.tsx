import type { HTMLArkProps } from "@ark-ui/react/factory"
import { ark } from "@ark-ui/react/factory"
import type { VariantProps } from "cva"
import { cva } from "cva"

const variants = cva({
  base: "block font-fraunces text-[1.5rem]/[1.875rem] font-light md:text-[2rem]/[2.4375rem]",
  variants: {
    padding: {
      x: "px-3.5",
      false: "",
    },
  },
})

type Props = HTMLArkProps<"span"> & VariantProps<typeof variants>

export default function DialogTitle({ className, padding, ...props }: Props) {
  return <ark.span {...props} className={variants({ className, padding })} />
}

