import type { CSSProperties, ComponentProps, ComponentRef } from "react"
import { startTransition, useEffect, useRef, useState } from "react"
import { cx } from "cva"
import { transform } from "motion/react"

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
  const ref = useRef<ComponentRef<"span">>(null)

  useEffect(() => {
    if (!ref.current) return

    const observer = new ResizeObserver((entries) =>
      entries.forEach((entry) => {
        startTransition(() => {
          const width = entry.contentRect.width
          const iterations = Math.ceil(window.innerWidth / width)
          const newShadows = computeShadows(width, iterations)
          setShadows(newShadows)
        })
      }),
    )

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
        style={style}
        className={cx(
          "pointer-events-none inline-block select-none",
          "animation-out animation-slide-out-to-left-full animation-ease-linear animation-fill-mode-both animation-repeat-infinite",
          shadows ? "animation-run" : "animation-pause",
        )}
      >
        {children}&nbsp;
      </span>
    </div>
  )
}
