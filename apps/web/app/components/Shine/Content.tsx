import { Slot } from "@radix-ui/react-slot"
import { cx } from "cva"
import { forwardRef, useId, useRef } from "react"
import type { CSSProperties, ComponentProps, ForwardedRef } from "react"
import { mergeRefs } from "react-merge-refs"
import { useMouseHovered } from "react-use"

type ShineProps = {
  /**
   * Depth of effect
   * @default 1
   */
  depth?: number
  /**
   * Size of light
   * @default 300
   */
  lightRadius?: number
  /**
   * Represents the height of the surface for a light filter primitive
   * @default 0.1
   */
  surfaceScale?: number
  /**
   * The bigger the value the bigger the reflection
   * @default 0.75
   */
  specularConstant?: number
  /**
   * Controls the focus for the light source. The bigger the value the brighter the light
   * @default 120
   */
  specularExponent?: number
}

type Props = ComponentProps<"div"> &
  ShineProps & {
    asChild?: boolean
  }

function Content(
  {
    asChild,
    className,
    style,
    children,
    depth = 1,
    surfaceScale = 0.1,
    lightRadius = 300,
    specularConstant = 0.75,
    specularExponent = 120,
    ...props
  }: Props,
  ref: ForwardedRef<HTMLDivElement>,
) {
  const id = useId()
  const containerRef = useRef<HTMLDivElement>(null)
  const pointLightRef = useRef<SVGFEPointLightElement>(null)
  const styles: CSSProperties = { ...style, filter: `url(#${id})` }
  const Component = asChild ? Slot : "div"

  const { elX, elY } = useMouseHovered(containerRef, {
    bound: true,
    // whenHovered: true,
  })

  return (
    <>
      <svg className="pointer-events-none sr-only" aria-hidden>
        <filter id={id} colorInterpolationFilters="sRGB">
          <feGaussianBlur in="SourceAlpha" stdDeviation={depth} />
          <feSpecularLighting
            result="light-source"
            surfaceScale={surfaceScale}
            specularConstant={specularConstant}
            specularExponent={specularExponent}
            lightingColor="#666666"
          >
            <fePointLight ref={pointLightRef} x={elX} y={elY} z={lightRadius} />
          </feSpecularLighting>
          <feComposite
            result="reflections"
            in="light-source"
            in2="SourceAlpha"
            operator="in"
          />
          <feComposite
            in="SourceGraphic"
            in2="reflections"
            operator="arithmetic"
            k1="0"
            k2="1"
            k3="1"
            k4="0"
          />
        </filter>
      </svg>
      <Component
        {...props}
        ref={mergeRefs([ref, containerRef])}
        className={cx(className, "CONTAINER inline-block")}
        style={styles}
      >
        {children}
      </Component>
    </>
  )
}

export default forwardRef(Content)
