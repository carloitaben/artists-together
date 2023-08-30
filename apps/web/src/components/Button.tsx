import { Slot } from "@radix-ui/react-slot"
import { cva, VariantProps } from "class-variance-authority"
import { Children, ComponentProps } from "react"
import Shiny from "./Shiny"

export const styles = cva(
  "rounded-full py-3 text-center font-sans text-sm shadow-[0px_4px_16px_0px_rgba(11,14,30,0.08)] transition active:scale-95 disabled:active:scale-100",
  {
    variants: {
      color: {
        true: "bg-gunpla-white-50 text-gunpla-white-500 disabled:bg-gunpla-white-100 disabled:text-gunpla-white-400",
        disabled: "disabled:bg-gunpla-white-100 disabled:text-gunpla-white-400",
        false: "",
      },
      flex: {
        true: "inline-flex gap-2.5 px-5",
        false: "px-10",
      },
    },
    defaultVariants: {
      color: true,
      flex: false,
    },
  },
)

type Props = Omit<ComponentProps<"button">, "ref"> &
  Omit<VariantProps<typeof styles>, "flex"> & {
    asChild?: boolean
  }

export default function Button({
  asChild,
  className,
  children,
  color,
  ...props
}: Props) {
  const Comp = asChild ? Slot : "button"
  const flex = Children.count(children) > 1

  return (
    <Shiny>
      <Comp {...props} className={styles({ className, color, flex })}>
        {children}
      </Comp>
    </Shiny>
  )
}
