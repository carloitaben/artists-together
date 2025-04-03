"use client"

import type { ComponentProps } from "react"
import { lazy } from "react"
import { clientOnly } from "../ClientOnly"

const LottieComponent = lazy(() => import("./LottieComponent"))

type Props = ComponentProps<typeof LottieComponent>

export default function Lottie(props: Props) {
  clientOnly()
  return <LottieComponent {...props} />
}
