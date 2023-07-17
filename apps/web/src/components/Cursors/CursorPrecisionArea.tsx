"use client"

import { ReactElement, cloneElement, useEffect, useId, useRef } from "react"

import { $elements } from "./store"
import { cx } from "class-variance-authority"

type Props = {
  children: ReactElement
}

export default function CursorPrecisionArea({ children }: Props) {
  const ref = useRef<HTMLElement>(null)
  const id = useId()

  if (children.props?.id) {
    throw Error("Children of CursorPrecisionArea cannot have id prop")
  }

  useEffect(() => {
    if (!ref.current) return

    const element = ref.current

    function onEnter() {
      $elements.set([...$elements.get(), element])
    }

    function onLeave() {
      $elements.set($elements.get().filter((node) => node !== element))
    }

    element.addEventListener("pointerenter", onEnter)
    element.addEventListener("pointerleave", onLeave)
    return () => {
      element.removeEventListener("pointerenter", onEnter)
      element.removeEventListener("pointerleave", onLeave)
    }
  }, [])

  return cloneElement(children, {
    ...children.props,
    className: cx(
      children.props?.className,
      "ring-2 ring-inset ring-acrylic-red-500"
    ),
    ref,
    id,
  })
}
