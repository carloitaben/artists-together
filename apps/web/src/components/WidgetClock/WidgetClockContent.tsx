"use client"

import "client-only"
import dayjs from "dayjs"
import utc from "dayjs/plugin/utc"
import timezone from "dayjs/plugin/timezone"
import advancedFormat from "dayjs/plugin/advancedFormat"
import { useEffect, useMemo, useState } from "react"
import { motion, useSpring, SpringOptions } from "framer-motion"

import { Location } from "~/data/locations"

dayjs.extend(utc)
dayjs.extend(timezone)
dayjs.extend(advancedFormat)

const spring: SpringOptions = {
  mass: 0.75,
  damping: 15,
  stiffness: 1_500,
}

function transformSeconds(seconds: number) {
  return (360 / 60) * seconds
}

function transformMinutes(minutes: number) {
  return (360 / 60) * minutes
}

function transformHours(hours: number) {
  return (360 / 12) * hours
}

export default function WidgetClockContent({ location }: { location: Location }) {
  const now = useMemo(() => {
    return dayjs().tz(location.timezone)
  }, [location.timezone])

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

      setTimestamp(dayjs().tz(location.timezone))
    }, 1_000)

    return () => {
      clearInterval(interval)
    }
  }, [now, hours, minutes, seconds, location.timezone])

  return (
    <>
      <div className="absolute inset-0 flex flex-col items-stretch justify-between bg-theme-50 font-serif font-light text-theme-900 fluid:p-24">
        <div>
          <div
            aria-hidden
            className="flex items-center justify-between fluid:text-[2rem]"
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
            className="flex items-center justify-center whitespace-nowrap leading-none fluid:text-[4rem]"
          >
            <div className="relative">
              <span className="invisible">00</span>
              <div className="absolute inset-0 flex items-center justify-center">
                {timestamp.format("HH")}
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
        <div className="text-center fluid:text-[2rem]/[2.125rem]">
          {location.name}
        </div>
      </div>
      <div aria-hidden className="pointer-events-none">
        <motion.div
          className="absolute inset-0 flex items-center justify-center"
          style={{ rotate: seconds }}
        >
          <div className="-translate-y-1/2 rounded-full bg-acrylic-red-500 shadow-button fluid:mt-1 fluid:h-[11rem] fluid:w-1" />
        </motion.div>
        <motion.div
          className="absolute inset-0 flex items-center justify-center"
          style={{ rotate: minutes }}
        >
          <div className="-translate-y-1/2 rounded-full bg-ruler-cyan-400 shadow-button fluid:mt-2.5 fluid:h-40 fluid:w-2.5" />
        </motion.div>
        <motion.div
          className="absolute inset-0 flex items-center justify-center"
          style={{ rotate: hours }}
        >
          <div className="-translate-y-1/2 rounded-full bg-smiley-yellow-400 shadow-button fluid:mt-2.5 fluid:h-24 fluid:w-2.5" />
        </motion.div>
      </div>
    </>
  )
}
