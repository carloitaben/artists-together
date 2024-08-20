"use client"

import Image from "next/image"
import { use, useEffect, useState } from "react"
import { motion, wrap, AnimatePresence } from "framer-motion"
import type { getRandomContentShared } from "~/services/content-shared/server"
import { usePrecache } from "~/lib/react/client"

const SLIDER_DURATION = 10_000

type Props = {
  promise: ReturnType<typeof getRandomContentShared>
}

export default function WidgetSlideshowContent({ promise }: Props) {
  const items = use(promise)
  const [index, setIndex] = useState(0)
  const [cached, startCaching] = usePrecache(items.map((item) => item.url))

  const slideable = items.length >= 2

  useEffect(() => {
    startCaching()
  }, [startCaching])

  useEffect(() => {
    if (!slideable) return
    if (!cached) return

    const timeout = setTimeout(() => {
      setIndex(wrap(0, items.length, index + 1))
    }, SLIDER_DURATION)

    return () => clearTimeout(timeout)
  }, [cached, index, items.length, slideable])

  const item = items[index]

  if (!item) {
    throw Error("Index is too large!")
  }

  if (!cached) {
    return null
  }

  return (
    <div className="relative size-full">
      <AnimatePresence initial={false} mode="wait">
        <motion.div
          key={index}
          className="relative size-full"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <Image
            src={item.url}
            alt=""
            fill
            className="size-full select-none object-cover"
            unoptimized
            draggable={false}
          />
        </motion.div>
      </AnimatePresence>
      <div className="">
        <motion.div
          layout
          className="absolute bottom-4 right-4 overflow-hidden whitespace-nowrap bg-gunpla-white-50 px-5 py-1.5 text-arpeggio-black-900"
          style={{ borderRadius: 9999 }}
        >
          {slideable ? (
            <motion.div
              key={index}
              className="absolute inset-0 rounded-full bg-arpeggio-black-300 shadow-button"
              initial={{ x: "0%", opacity: 0 }}
              animate={{
                opacity: 1,
                x: [null, "100%"],
                transition: {
                  x: {
                    delay: 0.5,
                    duration: SLIDER_DURATION / 1000 - 0.5,
                  },
                },
              }}
              exit={{
                opacity: 0,
              }}
            />
          ) : null}
          <div className="relative">
            <span aria-hidden className="invisible">
              @{item.username}
            </span>
            <motion.div layout="position" className="absolute inset-0">
              <AnimatePresence initial={false} mode="wait">
                <motion.span
                  key={item.username}
                  className=""
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                >
                  @{item.username}
                </motion.span>
              </AnimatePresence>
            </motion.div>
          </div>
        </motion.div>
      </div>
    </div>
  )
}
