"use client"

import dayjs from "dayjs"
import advancedFormat from "dayjs/plugin/advancedFormat"
import timezone from "dayjs/plugin/timezone"
import utc from "dayjs/plugin/utc"
import type { SpringOptions } from "motion/react"
import { motion, useSpring } from "motion/react"
import { use, useEffect, useMemo, useState } from "react"
import { clientOnly } from "~/components/ClientOnly"
import type { getRandomLocationWithWeather } from "~/features/locations/server"
import { useSettings } from "~/lib/promises"

dayjs.extend(utc)
dayjs.extend(timezone)
dayjs.extend(advancedFormat)

function transformSeconds(seconds: number) {
  return (360 / 60) * seconds
}

function transformMinutes(minutes: number) {
  return (360 / 60) * minutes
}

function transformHours(hours: number) {
  return (360 / 12) * hours
}

const spring: SpringOptions = {
  mass: 0.75,
  damping: 15,
  stiffness: 1_500,
}

type Props = {
  promise: ReturnType<typeof getRandomLocationWithWeather>
}

export default function WidgetClockContent({ promise }: Props) {
  clientOnly()
  const settings = useSettings()
  const data = use(promise)
  const now = useMemo(
    () => dayjs().tz(data.location.timezone),
    [data.location.timezone],
  )

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

      setTimestamp(dayjs().tz(data.location.timezone))
    }, 1_000)

    return () => clearInterval(interval)
  }, [now, hours, minutes, seconds, data.location.timezone])

  const hourFormat = settings.fullHourFormat ? "HH" : "hh"

  return (
    <>
      <div className="flex size-full flex-col items-stretch justify-between bg-theme-50 font-fraunces font-light text-theme-900 scale:p-24">
        <div>
          <div
            aria-hidden
            className="flex items-center justify-between scale:text-[2rem]"
          >
            <div className="text-start">{timestamp.format("MMM")}.</div>
            <div className="text-end uppercase">
              {timestamp.format("D")}
              <sup>
                {timestamp.format("Do").replace(timestamp.format("D"), "")}
              </sup>
            </div>
          </div>
          <div
            aria-hidden
            className="flex items-center justify-center whitespace-nowrap leading-none scale:text-[4rem]"
          >
            <div className="relative">
              <span className="invisible">00</span>
              <div className="absolute inset-0 flex items-center justify-center">
                {timestamp.format(hourFormat)}
              </div>
            </div>
            <span>:</span>
            <div className="relative">
              <span className="invisible">00</span>
              <div className="absolute inset-0 flex items-center justify-center">
                {timestamp.format("mm")}
              </div>
            </div>
            <span>:</span>
            <div className="relative">
              <span className="invisible">00</span>
              <div className="absolute inset-0 flex items-center justify-center">
                {timestamp.format("ss")}
              </div>
            </div>
          </div>
        </div>
        <div className="text-center scale:text-[2rem]/[2.125rem]">
          {`${data.location.city}, ${data.location.country}`}
        </div>
      </div>
      <div aria-hidden className="pointer-events-none">
        <motion.div
          className="absolute inset-0 flex items-center justify-center"
          style={{ rotate: seconds }}
        >
          <div className="-translate-y-1/2 rounded-full bg-acrylic-red-500 shadow-button scale:mt-1 scale:h-[11rem] scale:w-1" />
        </motion.div>
        <motion.div
          className="absolute inset-0 flex items-center justify-center"
          style={{ rotate: minutes }}
        >
          <div className="-translate-y-1/2 rounded-full bg-ruler-cyan-400 shadow-button scale:mt-2.5 scale:h-40 scale:w-2.5" />
        </motion.div>
        <motion.div
          className="absolute inset-0 flex items-center justify-center"
          style={{ rotate: hours }}
        >
          <div className="-translate-y-1/2 rounded-full bg-smiley-yellow-400 shadow-button scale:mt-2.5 scale:h-24 scale:w-2.5" />
        </motion.div>
      </div>
    </>
  )
}
