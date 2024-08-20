"use client"

import type { CSSProperties, ComponentProps } from "react"
import { startTransition, useEffect, useRef, useState } from "react"
import { cx } from "cva"
import { transform } from "framer-motion"

const duration = transform([0, 100], ["0s", "30s"], {
  clamp: false,
})

function computeShadows(width: number, iterations: number) {
  const shadows: string[] = []

  for (let index = 0; index < iterations; index++) {
    shadows.push(`${width * (index + 1)}px 0 currentColor`)
  }

  return shadows.join(",")
}

type Props = ComponentProps<"div"> & {
  children: string
}

export default function Marquee({ children, className, ...props }: Props) {
  const [shadows, setShadows] = useState<string>()
  const ref = useRef<HTMLSpanElement>(null)

  useEffect(() => {
    if (!ref.current) return

    function recalculate() {
      startTransition(() => {
        if (!ref.current) return
        const width = ref.current.offsetWidth
        const iterations = Math.ceil(window.innerWidth / width)
        const newShadows = computeShadows(width, iterations)
        setShadows(newShadows)
      })
    }

    recalculate() // TODO: I think this is unnecesary
    const observer = new ResizeObserver(recalculate)
    observer.observe(ref.current)
    return () => observer.disconnect()
  }, [])

  const style: CSSProperties = {
    textShadow: shadows,
    animationDuration: duration(children.length + 1),
  }

  return (
    <div
      {...props}
      aria-label={children}
      className={cx(className, "w-full overflow-hidden whitespace-nowrap")}
    >
      <span
        aria-hidden
        ref={ref}
        className={cx(
          "pointer-events-none inline-block select-none",
          shadows && "animate-marquee",
        )}
        style={style}
      >
        {children}&nbsp;
      </span>
    </div>
  )
}
