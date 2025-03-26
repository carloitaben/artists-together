import { cx } from "cva"
import type {
  AnimationConfigWithData,
  AnimationItem,
} from "lottie-web/build/player/lottie_svg"
import lottie from "lottie-web/build/player/lottie_svg"
import type { ComponentProps, ComponentRef, ForwardedRef } from "react"
import {
  forwardRef,
  useEffect,
  useImperativeHandle,
  useRef,
  useState,
} from "react"

type Props = ComponentProps<"div"> &
  Pick<AnimationConfigWithData, "autoplay" | "loop"> & {
    src: Promise<unknown>
  }

function LottieComponent(
  { src, className, autoplay = false, loop = false, ...props }: Props,
  ref: ForwardedRef<AnimationItem | undefined>,
) {
  const innerRef = useRef<ComponentRef<"div">>(null)
  const [animationData, setAnimationData] = useState<unknown>()
  const [animation, setAnimation] = useState<AnimationItem>()

  useImperativeHandle(ref, () => animation, [animation])

  useEffect(() => {
    let unmounting = false

    src.then((data) => {
      if (!unmounting) {
        setAnimationData(data)
      }
    })

    return () => {
      unmounting = true
    }
  }, [src])

  useEffect(() => {
    if (!animationData) return
    if (!innerRef.current) return

    const animation = lottie.loadAnimation({
      animationData,
      container: innerRef.current,
      autoplay,
      loop,
    })

    setAnimation(animation)

    return () => {
      animation.destroy()
      setAnimation(undefined)
    }
  }, [animationData, autoplay, loop])

  return (
    <div
      {...props}
      ref={innerRef}
      className={cx(className, "*:!transform-none")}
    />
  )
}

export default forwardRef(LottieComponent)
