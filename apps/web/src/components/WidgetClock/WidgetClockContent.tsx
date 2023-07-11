"use client"

import { useEffect, useState } from "react"
import {
  SpringOptions,
  motion,
  transform,
  useMotionValueEvent,
  useSpring,
  useTime,
} from "framer-motion"
import dayjs from "dayjs"
import advancedFormat from "dayjs/plugin/advancedFormat"

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

const transformHours = transform([0, 24], [0, 360], {
  clamp: false,
})

const now = dayjs()

export default function WidgetClockContent() {
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
  }, [hours, minutes, seconds])

  return (
    <>
      <div className="absolute inset-0 bg-theme-50 px-[6.667vw] py-[5vw] font-serif font-light text-theme-900">
        <div>
          <div className="flex items-center justify-between text-[1.667vw]">
            <div>{timestamp.format("MMM")}.</div>
            <div>{timestamp.format("Do")}</div>
          </div>
          <div className="text-center text-[3.333vw]">
            {timestamp.format("HH:mm:ss")}
          </div>
        </div>
        <div className="text-center text-[1.667vw]">Lisbon, Portugal</div>
      </div>

      <motion.div
        className="absolute inset-0 flex items-center justify-center"
        style={{ rotate: seconds }}
      >
        <div className="h-[9.375vw] w-[0.208vw] -translate-y-1/2 rounded-full bg-acrylic-red-500 shadow-button" />
      </motion.div>
      <motion.div
        className="absolute inset-0 flex items-center justify-center"
        style={{ rotate: minutes }}
      >
        <div className="h-[8.594vw] w-[0.573vw] -translate-y-1/2 rounded-full bg-ruler-cyan-400 shadow-button" />
      </motion.div>
      <motion.div
        className="absolute inset-0 flex items-center justify-center"
        style={{ rotate: hours }}
      >
        <div className="h-[5vw] w-[0.573vw] -translate-y-1/2 rounded-full bg-smiley-yellow-400 shadow-button" />
      </motion.div>
    </>
  )
}
