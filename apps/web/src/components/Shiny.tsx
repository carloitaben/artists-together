"use client"

import { cx } from "class-variance-authority"
import { ReactElement, cloneElement, useEffect, useRef } from "react"

import { useHasCursor } from "~/hooks/media"

type Props = {
  children: ReactElement
  enabled?: boolean
}

export default function Shiny({ children, enabled = true }: Props) {
  const ref = useRef<HTMLElement>(null)
  const hasCursor = useHasCursor()

  useEffect(() => {
    if (!hasCursor) return
    if (!ref.current) return
    if (!enabled) return

    const element = ref.current

    function onMouseMove(event: MouseEvent) {
      const { x, y } = element.getBoundingClientRect()
      element.style.setProperty("--x", (event.clientX - x).toString())
      element.style.setProperty("--y", (event.clientY - y).toString())
    }

    element.addEventListener("mousemove", onMouseMove)
    return () => {
      element.removeEventListener("mousemove", onMouseMove)
    }
  }, [enabled, hasCursor])

  return cloneElement(children, {
    ...children.props,
    ref,
    className: cx(
      children.props?.className,
      enabled &&
        hasCursor &&
        "relative overflow-hidden after:pointer-events-none after:absolute after:left-[calc(var(--x,0)*1px-6rem)] after:top-[calc(var(--y,0)*1px-6rem)] after:h-48 after:w-48 after:bg-gradient-radial after:from-white after:via-gunpla-white-50/0 after:to-gunpla-white-50/0 after:opacity-0 after:transition-opacity after:duration-100 hover:after:opacity-50",
    ),
  })
}
