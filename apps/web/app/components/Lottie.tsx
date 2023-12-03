import lottie from "lottie-web/build/player/lottie_svg"
import type {
  AnimationConfigWithData,
  AnimationItem,
} from "lottie-web/build/player/lottie_svg"
import type { ComponentProps, ForwardedRef } from "react"
import {
  forwardRef,
  useEffect,
  useImperativeHandle,
  useRef,
  useState,
} from "react"

type Props = ComponentProps<"div"> &
  Pick<AnimationConfigWithData, "autoplay" | "loop"> & {
    src: string
  }

function Lottie(
  { src, autoplay = false, loop = false, ...props }: Props,
  ref: ForwardedRef<AnimationItem | undefined>,
) {
  const [animationData, setAnimationData] = useState<unknown>()
  const innerRef = useRef<HTMLDivElement>(null)
  const animationRef = useRef<AnimationItem>()

  useImperativeHandle(ref, () => animationRef.current, [])

  useEffect(() => {
    if (!animationData) {
      const controller = new AbortController()

      fetch(src, {
        signal: controller.signal,
      })
        .then((response) => response.json())
        .then((json) => setAnimationData(json))
        .catch(console.error)

      return () => {
        controller.abort()
      }
    }

    if (!innerRef.current) return

    const animation = lottie.loadAnimation({
      container: innerRef.current,
      animationData,
      autoplay,
      loop,
    })

    animationRef.current = animation

    return () => {
      animation.destroy()
    }
  }, [animationData, autoplay, loop, src])

  return <div {...props} ref={innerRef} />
}

export default forwardRef(Lottie)
