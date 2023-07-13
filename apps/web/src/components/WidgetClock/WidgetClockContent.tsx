"use client"

import "client-only"
import dayjs from "dayjs"
import utc from "dayjs/plugin/utc"
import timezone from "dayjs/plugin/timezone"
import advancedFormat from "dayjs/plugin/advancedFormat"
import { useEffect, useMemo, useState } from "react"
import { SpringOptions, motion, transform, useSpring } from "framer-motion"

import type { Timezone } from "./WidgetClock"

dayjs.extend(utc)
dayjs.extend(timezone)
dayjs.extend(advancedFormat)

const spring: SpringOptions = {
  mass: 0.75,
  damping: 15,
  stiffness: 1500,
}

const transformSeconds = transform([0, 60], [0, 360], {
  clamp: false,
})

const transformMinutes = transform([0, 60], [0, 360], {
  clamp: false,
})

const transformHours = transform([0, 12], [0, 360], {
  clamp: false,
})

export default function WidgetClockContent({
  timezone,
}: {
  timezone: Timezone
}) {
  const now = useMemo(() => {
    return dayjs().tz(timezone.code)
  }, [timezone])

  const [timestamp, setTimestamp] = useState(now)

  const seconds = useSpring(transformSeconds(now.second()), spring)
  const minutes = useSpring(transformMinutes(now.minute()), spring)
  const hours = useSpring(transformHours(now.hour()), spring)

  useEffect(() => {
    let second = now.second()
    let minute = now.minute()
    let hour = now.hour()

    const interval = setInterval(() => {
      second = second + 1
      seconds.set(transformSeconds(second))

      if (second % 60 === 0) {
        minute = minute + 1
        minutes.set(transformMinutes(minute))
      }

      if ((minute * 60) % 3600 === 0 && second % 60 === 0) {
        hour = hour + 1
        hours.set(transformHours(hour))
      }

      setTimestamp(dayjs())
    }, 1_000)

    return () => {
      clearInterval(interval)
    }
  }, [now, hours, minutes, seconds])

  return (
    <>
      <div className="absolute inset-0 flex flex-col items-stretch justify-between bg-theme-50 p-[5vw] font-serif font-light text-theme-900">
        <div>
          <div className="flex items-center justify-between text-[1.667vw]">
            <div className="text-start">{timestamp.format("MMM")}.</div>
            <div className="text-end">
              {timestamp.format("D")}
              <span className="uppercase">
                {timestamp.format("Do").replace(timestamp.format("D"), "")}
              </span>
            </div>
          </div>
          <div className=" whitespace-nowrap text-center text-[3.333vw] leading-none">
            {timestamp.format("HH:mm:ss")}
          </div>
        </div>
        <div className="text-center text-[1.667vw]/[1.771vw]">
          {timezone.name}
        </div>
      </div>
      <div aria-hidden className="pointer-events-none">
        <motion.div
          className="absolute inset-0 flex items-center justify-center"
          style={{ rotate: seconds }}
        >
          <div className="mt-[0.208vw] h-[9.375vw] w-[0.208vw] -translate-y-1/2 rounded-full bg-acrylic-red-500 shadow-button" />
        </motion.div>
        <motion.div
          className="absolute inset-0 flex items-center justify-center"
          style={{ rotate: minutes }}
        >
          <div className="mt-[0.573vw] h-[8.594vw] w-[0.573vw] -translate-y-1/2 rounded-full bg-ruler-cyan-400 shadow-button" />
        </motion.div>
        <motion.div
          className="absolute inset-0 flex items-center justify-center"
          style={{ rotate: hours }}
        >
          <div className="mt-[0.573vw] h-[5vw] w-[0.573vw] -translate-y-1/2 rounded-full bg-smiley-yellow-400 shadow-button" />
        </motion.div>
      </div>
    </>
  )
}
