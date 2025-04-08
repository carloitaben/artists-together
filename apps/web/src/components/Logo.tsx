"use client"

import type { ComponentProps, ComponentRef, ForwardedRef } from "react"
import { forwardRef,Suspense } from "react"
import { useHints } from "~/lib/promises"
import AspectRatio from "./AspectRatio"
import { CursorPrecision } from "./Cursors"
import Icon from "./Icon"
import Lottie from "./Lottie"

const lottie = () => import("~/assets/lottie/at_logo_25.json")

type Props = Omit<ComponentProps<typeof AspectRatio.Root>, "ratio">

function Logo(
  props: Props,
  ref: ForwardedRef<ComponentRef<typeof AspectRatio.Root>>,
) {
  const hints = useHints()

  return (
    <CursorPrecision id="logo" asChild>
      <AspectRatio.Root {...props} ref={ref} ratio={600 / 324}>
        <AspectRatio.Content>
          <h2 className="sr-only">Artists Together</h2>
          {hints.saveData ? (
            <Icon src="Logo" alt="" className="size-full" />
          ) : (
            <>
              <noscript>
                <Icon src="Logo" alt="" className="size-full" />
              </noscript>
              <Icon
                src="Logo"
                alt=""
                className="hidden size-full motion-reduce:block"
              />
              <Suspense>
                <Lottie
                  src={lottie()}
                  autoplay
                  className="motion-reduce:hidden"
                />
              </Suspense>
            </>
          )}
        </AspectRatio.Content>
      </AspectRatio.Root>
    </CursorPrecision>
  )
}

export default forwardRef(Logo)
