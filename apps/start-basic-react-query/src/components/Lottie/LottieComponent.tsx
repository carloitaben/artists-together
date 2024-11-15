import lottie from "lottie-web/build/player/lottie_svg"
import type {
  AnimationConfigWithData,
  AnimationItem,
} from "lottie-web/build/player/lottie_svg"
import type { ComponentProps, ComponentRef, ForwardedRef } from "react"
import {
  forwardRef,
  useEffect,
  useImperativeHandle,
  useRef,
  useState,
} from "react"
import { cx } from "cva"

type Props = ComponentProps<"div"> &
  Pick<AnimationConfigWithData, "autoplay" | "loop"> & {
    src: Promise<unknown>
  }

function LottieComponent(
  { src, className, autoplay = false, loop = false, ...props }: Props,
  ref: ForwardedRef<AnimationItem | undefined>,
) {
  const innerRef = useRef<ComponentRef<"div">>(null)
  const [animation, setAnimation] = useState<AnimationItem>()

  useImperativeHandle(ref, () => animation, [animation])

  useEffect(() => {
    src
      .then((animationData) => {
        if (!innerRef.current) return

        const animation = lottie.loadAnimation({
          animationData,
          container: innerRef.current,
          autoplay,
          loop,
        })

        setAnimation(animation)
      })
      .catch(console.error)

    return () => {
      setAnimation((animation) => {
        animation?.destroy()
        return undefined
      })
    }
  }, [autoplay, loop, src])

  return (
    <div
      {...props}
      ref={innerRef}
      className={cx(className, "*:!transform-none")}
    />
  )
}

export default forwardRef(LottieComponent)
