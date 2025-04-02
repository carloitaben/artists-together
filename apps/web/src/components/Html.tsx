"use client"

import { cx } from "cva"
import { useSearchParams } from "next/navigation"
import type { ComponentProps } from "react"

export default function Html(props: ComponentProps<"html">) {
  const search = useSearchParams()
  const open = search.get("modal") === "auth"

  return (
    <html
      {...props}
      className={cx(props.className, open && "overflow-hidden")}
    />
  )
}
