"use client"

import type { HTMLArkProps } from "@ark-ui/react/factory"
import { ark } from "@ark-ui/react/factory"
import type { VariantProps } from "cva"
import { cva } from "cva"
import type { ComponentRef, ForwardedRef } from "react"
import { forwardRef, createContext, useContext } from "react"

export const gap = {
  x: "gap-x-1 sm:scale:gap-x-4",
  y: "gap-y-1 sm:scale:gap-y-4",
}

const variants = cva({
  variants: {
    inline: {
      true: "inline-grid",
      false: "grid",
    },
    cols: {
      base: "grid-cols-4 sm:grid-cols-8",
      subgrid: "grid-cols-[--subgrid-template-columns]",
    },
    gap: {
      x: gap.x,
      y: gap.y,
      true: [gap.x, gap.y],
      false: "",
    },
  },
  defaultVariants: {
    inline: false,
    cols: "base",
    gap: "x",
  },
})

const GridContext = createContext<true | null>(null)

GridContext.displayName = "GridContext"

type Props = HTMLArkProps<"div"> & Omit<VariantProps<typeof variants>, "cols">

function Grid(
  { className, gap, inline, ...props }: Props,
  ref: ForwardedRef<ComponentRef<"div">>,
) {
  const isSubgrid = Boolean(useContext(GridContext))

  return (
    <GridContext.Provider value={true}>
      <ark.div
        ref={ref}
        className={variants({
          className,
          gap,
          inline,
          cols: isSubgrid ? "subgrid" : "base",
        })}
        {...props}
      />
    </GridContext.Provider>
  )
}

export default forwardRef(Grid)
