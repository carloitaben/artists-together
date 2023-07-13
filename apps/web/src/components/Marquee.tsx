"use client"

import {
  CSSProperties,
  ComponentProps,
  ForwardedRef,
  forwardRef,
  useCallback,
  useEffect,
  useRef,
  useState,
} from "react"
import { cx } from "class-variance-authority"

type Props = ComponentProps<"div"> & {
  children: string
}

function computeShadows(width: number, iterations: number) {
  const shadows = []

  for (let index = 0; index < iterations; index++) {
    shadows.push(`${width * (index + 1)}px 0 currentColor`)
  }

  return shadows.join(",")
}

function Marquee(
  { children, className, ...props }: Props,
  forwardedRef: ForwardedRef<HTMLDivElement>
) {
  const [shadows, setShadows] = useState("currentColor")
  const ref = useRef<HTMLSpanElement>(null)

  const recalculate = useCallback(() => {
    if (!ref.current) return
    const width = ref.current.offsetWidth
    const iterations = Math.ceil(window.innerWidth / width)
    const newShadows = computeShadows(width, iterations)
    setShadows(newShadows)
  }, [])

  useEffect(() => {
    window.addEventListener("resize", recalculate, true)
    return () => {
      window.removeEventListener("resize", recalculate, true)
    }
  }, [recalculate])

  const style: CSSProperties = {
    textShadow: shadows,
    animationDuration: `${((children.length + 1) * 30) / 100}s`, // 100 characters = 30s,
  }

  return (
    <div
      {...props}
      aria-label={children}
      ref={forwardedRef}
      className={cx(className, "w-full overflow-hidden whitespace-nowrap")}
    >
      <span
        aria-hidden
        ref={ref}
        className="pointer-events-none inline-block select-none [animation-iteration-count:infinite] [animation-name:marquee] [animation-timing-function:linear]"
        style={style}
      >
        {children}&nbsp;
      </span>
    </div>
  )
}

export default forwardRef(Marquee)
