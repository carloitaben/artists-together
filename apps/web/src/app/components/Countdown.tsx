"use client"

import dayjs from "dayjs"
import relativeTimePlugin from "dayjs/plugin/relativeTime"
import durationPlugin from "dayjs/plugin/duration"
import { useEffect, useRef, useState } from "react"

dayjs.extend(relativeTimePlugin)
dayjs.extend(durationPlugin)

type Props = {
  now: number
}

const target = dayjs("2025-04-14")

export default function Countdown(props: Props) {
  const ref = useRef<HTMLHeadingElement>(null)
  const [start, setStart] = useState(false)
  const [now, setNow] = useState(dayjs(props.now))
  const diff = target.diff(now)
  const duration = dayjs.duration(diff)
  const days = duration.days()
  const hours = duration.hours()
  const minutes = duration.minutes()
  const seconds = duration.seconds()
  const daysLabel = days === 1 ? "day" : "days"
  const hoursLabel = hours === 1 ? "hour" : "hours"
  const minutesLabel = minutes === 1 ? "minute" : "minutes"
  const secondsLabel = seconds === 1 ? "second" : "seconds"

  useEffect(() => {
    setNow(dayjs(Date.now()))
    const interval = setInterval(() => {
      setNow(dayjs(Date.now()))
    }, 1_000)

    return () => clearInterval(interval)
  }, [])

  useEffect(() => {
    if (start) return
    const onComplete = setStart.bind(null, true)
    window.addEventListener("animation:complete", onComplete)
    return () => window.removeEventListener("animation:complete", onComplete)
  }, [start])

  useEffect(() => {
    if (!start) return
    if (!ref.current) return

    const daysValueElement = ref.current.querySelector("[data-days-value]")!
    const daysLabelElement = ref.current.querySelector("[data-days-label]")!
    const hoursValueElement = ref.current.querySelector("[data-hours-value]")!
    const hoursLabelElement = ref.current.querySelector("[data-hours-label]")!
    const minutesValueElement = ref.current.querySelector(
      "[data-minutes-value]",
    )!
    const minutesLabelElement = ref.current.querySelector(
      "[data-minutes-label]",
    )!
    const secondsValueElement = ref.current.querySelector(
      "[data-seconds-value]",
    )!
    const secondsLabelElement = ref.current.querySelector(
      "[data-seconds-label]",
    )!

    daysValueElement.textContent = days.toString()
    daysLabelElement.textContent = daysLabel
    hoursValueElement.textContent = hours.toString()
    hoursLabelElement.textContent = hoursLabel

    minutesValueElement.textContent = minutes.toString()
    minutesLabelElement.textContent = minutesLabel
    secondsValueElement.textContent = seconds.toString()
    secondsLabelElement.textContent = secondsLabel
  }, [
    days,
    daysLabel,
    hours,
    hoursLabel,
    minutes,
    minutesLabel,
    seconds,
    secondsLabel,
    start,
  ])

  return (
    <h2 data-animated-text ref={ref} className="capitalize js:invisible">
      <span>
        <span data-days-value>{days}</span>
        &nbsp;
        <span data-days-label>{daysLabel}</span>
        &nbsp;
        <span data-hours-value>{hours}</span>
        &nbsp;
        <span data-hours-label>{hoursLabel}</span>
      </span>
      <br />
      <span>
        <span data-minutes-value>{minutes}</span>
        &nbsp;
        <span data-minutes-label>{minutesLabel}</span>
        &nbsp;
        <span data-seconds-value>{seconds}</span>
        &nbsp;
        <span data-seconds-label>{secondsLabel}</span>
      </span>
    </h2>
  )
}
