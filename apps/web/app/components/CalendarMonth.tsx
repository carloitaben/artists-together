// https://medium.com/@kapaak/custom-calendar-with-react-and-dayjs-dcdbba89e577

import { cx } from "cva"
import type { Dayjs } from "dayjs"
import dayjs from "dayjs"
import locale from "dayjs/locale/en"
import weekdayPlugin from "dayjs/plugin/weekday"
import objectPlugin from "dayjs/plugin/toObject"
import isTodayPlugin from "dayjs/plugin/isToday"

dayjs.extend(weekdayPlugin)
dayjs.extend(objectPlugin)
dayjs.extend(isTodayPlugin)

type Props = {
  date?: Dayjs
  format?: string
}

export default function CalendarMonth({
  format = "MMMM",
  date: dateProp = dayjs(),
}: Props) {
  const today = dayjs()

  const date = dayjs(dateProp).locale({
    ...locale,
    weekStart: 1,
  })

  const active = today.month() === date.month()

  const formateDateObject = (date: Dayjs) => {
    const clonedObject = { ...date.toObject() }

    const formatedObject = {
      day: clonedObject.date,
      month: clonedObject.months,
      year: clonedObject.years,
      isCurrentMonth: clonedObject.months === date.month(),
      isCurrentDay: date.isToday(),
    }

    return formatedObject
  }

  let currentDate = date.startOf("month").weekday(0)
  const nextMonth = date.add(1, "month").month()

  let arrayOfDays = []
  let weekDates = []

  let weekCounter = 1

  while (currentDate.weekday(0).toObject().months !== nextMonth) {
    const formated = formateDateObject(currentDate)

    weekDates.push(formated)

    if (weekCounter === 7) {
      arrayOfDays.push({ dates: weekDates })
      weekDates = []
      weekCounter = 0
    }

    weekCounter++
    currentDate = currentDate.add(1, "day")
  }

  const days: JSX.Element[] = []

  for (let i = 0; i < 7; i++) {
    days.push(
      <div className={cx(i > 4 && "text-acrylic-red-500")} key={i}>
        {date.weekday(i).format("dd")}
      </div>,
    )
  }

  const rows: JSX.Element[] = []
  let rowDays: JSX.Element[] = []

  arrayOfDays.forEach((week, index) => {
    week.dates.forEach((d, i) => {
      rowDays.push(
        <div
          key={i}
          className={cx(
            "flex items-center justify-center fluid:h-10 fluid:w-10",
            {
              invisible: !d.isCurrentMonth,
              "rounded-full bg-theme-900 text-theme-50": d.isCurrentDay,
            },
          )}
        >
          <span>{d.day}</span>
        </div>,
      )
    })

    rows.push(
      <div className="grid grid-cols-7" key={index}>
        {rowDays}
      </div>,
    )

    rowDays = []
  })

  return (
    <div
      className={cx(
        "h-full w-full text-center fluid:px-10 fluid:py-12 fluid:text-2xl",
        active ? "bg-theme-50 text-theme-900" : "bg-theme-800 text-theme-50",
      )}
    >
      <div className="font-serif fluid:mb-3 fluid:text-[2rem]">
        {date.format(format)}
      </div>
      <div className="grid grid-cols-7 font-serif font-semibold">{days}</div>
      <div>{rows}</div>
    </div>
  )
}
