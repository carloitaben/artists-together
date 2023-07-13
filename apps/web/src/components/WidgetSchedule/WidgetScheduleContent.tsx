// https://medium.com/@kapaak/custom-calendar-with-react-and-dayjs-dcdbba89e577

import dayjs, { Dayjs } from "dayjs"
import locale from "dayjs/locale/en"
import weekdayPlugin from "dayjs/plugin/weekday"
import objectPlugin from "dayjs/plugin/toObject"
import isTodayPlugin from "dayjs/plugin/isToday"
import { cx } from "class-variance-authority"

dayjs.extend(weekdayPlugin)
dayjs.extend(objectPlugin)
dayjs.extend(isTodayPlugin)

const now = dayjs().locale({
  ...locale,
  weekStart: 1,
})

export default function WidgetScheduleContent() {
  const formateDateObject = (date: Dayjs) => {
    const clonedObject = { ...date.toObject() }

    const formatedObject = {
      day: clonedObject.date,
      month: clonedObject.months,
      year: clonedObject.years,
      isCurrentMonth: clonedObject.months === now.month(),
      isCurrentDay: date.isToday(),
    }

    return formatedObject
  }

  let currentDate = now.startOf("month").weekday(0)
  const nextMonth = now.add(1, "month").month()

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
        {now.weekday(i).format("dd")}
      </div>
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
            "flex h-[2.083vw] w-[2.083vw] items-center justify-center",
            {
              invisible: !d.isCurrentMonth,
              "rounded-full bg-theme-900 text-theme-50": d.isCurrentDay,
            }
          )}
        >
          <span>{d.day}</span>
        </div>
      )
    })

    rows.push(
      <div className="grid grid-cols-7" key={index}>
        {rowDays}
      </div>
    )

    rowDays = []
  })

  return (
    <div className="h-full w-full bg-theme-50 px-[2.083vw] pb-[3.125vw] pt-[2.708vw] text-center text-[1.250vw] text-theme-900">
      <div className="font-serif text-[1.667vw]">
        {now.format("MMMM, YYYY")}
      </div>
      <div className="grid grid-cols-7 font-serif font-semibold">{days}</div>
      <div>{rows}</div>
    </div>
  )
}
