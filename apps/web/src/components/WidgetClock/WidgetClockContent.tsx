"use client"

import { SpringOptions, motion, useSpring } from "framer-motion"
import dayjs from "dayjs"
import advancedFormat from "dayjs/plugin/advancedFormat"
import { useEffect } from "react"

dayjs.extend(advancedFormat)

const spring: SpringOptions = {
  mass: 0.75,
  damping: 15,
  stiffness: 1500,
}

export default function WidgetClockContent() {
  const now = dayjs()

  const seconds = useSpring(now.second(), spring)
  const minutes = useSpring(now.minute(), spring)
  const hours = useSpring(now.hour(), spring)

  useEffect(() => {
    let s = now.second()
    let m = now.minute()
    let h = now.hour()

    const secondInterval = setInterval(() => {
      s = s + 1
      seconds.set(s)
    }, 1_000)

    const minuteInterval = setInterval(() => {
      m = m + 1
      minutes.set(m)
    }, 60_000)

    const hourInterval = setInterval(() => {
      h = h + 1
      hours.set(h)
    }, 3_600_000)

    return () => {
      clearInterval(secondInterval)
      clearInterval(minuteInterval)
      clearInterval(hourInterval)
    }
  }, [hours, minutes, now, seconds])

  return (
    <>
      <div className="absolute inset-0 bg-theme-50 px-[6.667vw] py-[5vw] font-serif font-light text-theme-900">
        <div>
          <div className="flex items-center justify-between text-[1.667vw]">
            <div>{now.format("MMM")}.</div>
            <div>{now.format("Do")}</div>
          </div>
          <div className="text-center text-[3.333vw]">
            {now.format("HH:mm:ss")}
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
