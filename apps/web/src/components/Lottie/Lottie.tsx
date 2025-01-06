import type { ComponentProps, ReactNode } from "react"
import { Suspense, lazy } from "react"
import { ErrorBoundary } from "react-error-boundary"
import type LottieComponent from "./LottieComponent"
import ClientOnly from "../ClientOnly"

const LazyLottieComponent = lazy(() => import("./LottieComponent"))

type Props = Omit<ComponentProps<typeof LottieComponent>, "src"> & {
  /**
   * A dynamic import with the Lottie JSON animation
   */
  src: () => Promise<{ default: unknown }>
  fallback?: ReactNode
  errorFallback?: ReactNode
}

export default function Lottie({
  src,
  fallback = null,
  errorFallback = fallback,
  ...props
}: Props) {
  return (
    <Suspense fallback={fallback}>
      <ClientOnly fallback={fallback}>
        <ErrorBoundary fallback={errorFallback}>
          <LazyLottieComponent
            {...props}
            src={src().then((module) => module.default)}
          />
        </ErrorBoundary>
      </ClientOnly>
    </Suspense>
  )
}
