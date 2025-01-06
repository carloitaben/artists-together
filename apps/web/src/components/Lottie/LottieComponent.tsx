import lottie from "lottie-web/build/player/lottie_svg"
import type {
  AnimationConfigWithData,
  AnimationItem,
} from "lottie-web/build/player/lottie_svg"
import type {
  ComponentPropsWithoutRef,
  ComponentRef,
  ForwardedRef,
} from "react"
import { useEffect, useImperativeHandle, useRef, useState } from "react"
import { cx } from "cva"

type Props = ComponentPropsWithoutRef<"div"> &
  Pick<AnimationConfigWithData, "autoplay" | "loop"> & {
    src: Promise<unknown>
    ref?: ForwardedRef<AnimationItem | undefined>
  }

export default function LottieComponent({
  src,
  ref,
  className,
  autoplay = false,
  loop = false,
  ...props
}: Props) {
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
