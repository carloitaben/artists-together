import dayjs from "dayjs"
import utc from "dayjs/plugin/utc"
import timezone from "dayjs/plugin/timezone"
import advancedFormat from "dayjs/plugin/advancedFormat"
import { use, useEffect, useMemo, useState } from "react"
import { useSpring, motion } from "motion/react"
import type { SpringOptions } from "motion/react"
import type { getRandomLocationWithWeather } from "~/services/locations/server"
import { useUser } from "~/services/auth/client"
import { useHints } from "~/lib/headers/client"

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
  const data = use(promise)
  const now = useMemo(
    () => dayjs().tz(data.location.timezone),
    [data.location.timezone],
  )

  const [timestamp, setTimestamp] = useState(now)
  const seconds = useSpring(transformSeconds(now.second()), spring)
  const minutes = useSpring(transformMinutes(now.minute()), spring)
  const hours = useSpring(transformHours(now.hour()), spring)
  const hints = useHints({ strict: true })
  const user = useUser()

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

  const hourFormat = user
    ? user.settingsFullHourFormat
      ? "HH"
      : "hh"
    : hints.hourFormat === "24"
      ? "HH"
      : "hh"

  return (
    <>
      <div className="bg-theme-50 font-fraunces text-theme-900 scale:p-24 flex size-full flex-col items-stretch justify-between font-light">
        <div>
          <div
            aria-hidden
            className="scale:text-[2rem] flex items-center justify-between"
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
            className="scale:text-[4rem] flex items-center justify-center whitespace-nowrap leading-none"
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
        <div className="scale:text-[2rem]/[2.125rem] text-center">
          {`${data.location.city}, ${data.location.country}`}
        </div>
      </div>
      <div aria-hidden className="pointer-events-none">
        <motion.div
          className="absolute inset-0 flex items-center justify-center"
          style={{ rotate: seconds }}
        >
          <div className="bg-acrylic-red-500 shadow-button scale:mt-1 scale:h-[11rem] scale:w-1 -translate-y-1/2 rounded-full" />
        </motion.div>
        <motion.div
          className="absolute inset-0 flex items-center justify-center"
          style={{ rotate: minutes }}
        >
          <div className="bg-ruler-cyan-400 shadow-button scale:mt-2.5 scale:h-40 scale:w-2.5 -translate-y-1/2 rounded-full" />
        </motion.div>
        <motion.div
          className="absolute inset-0 flex items-center justify-center"
          style={{ rotate: hours }}
        >
          <div className="bg-smiley-yellow-400 shadow-button scale:mt-2.5 scale:h-24 scale:w-2.5 -translate-y-1/2 rounded-full" />
        </motion.div>
      </div>
    </>
  )
}
