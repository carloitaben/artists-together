"use client"

import dayjs from "dayjs"
import Link from "next/link"
import { useSelectedLayoutSegments } from "next/navigation"
import { MonthNameList, MonthNumber } from "~/lib/schemas"
import Button from "~/components/Button"
import Icon from "~/components/Icon"
import Container from "~/components/Container"
import CalendarHeaderToggle from "./CalendarHeaderToggle"

function capitalizeFirstLetter(string: string) {
  return string.charAt(0).toUpperCase() + string.slice(1)
}

function useDate() {
  const [year, month] = useSelectedLayoutSegments()
  const date = dayjs()

  if (!year) {
    return date
  }

  return date
    .set("year", parseInt(year))
    .set(
      "month",
      month
        ? MonthNameList.options.findIndex((m) => m === month)
        : date.month(),
    )
}

export default function CalendarHeader() {
  const segments = useSelectedLayoutSegments()
  const date = useDate()
  const mode = segments.length === 2 ? "month" : "year"

  function move(sign: 1 | -1) {
    if (mode === "year") {
      const year = dayjs(date).add(1, "year").year()
      return `/calendar/${year}`
    }

    const target = dayjs(date).add(sign, "month")
    const year = target.year()
    const month = MonthNumber.parse(target.month() + 1)
    return `/calendar/${year}/${month}`
  }

  return (
    <Container asChild>
      <header className="flex items-center justify-between">
        <h1 className="font-fraunces text-[4rem]/[4.9375rem] font-light">
          {capitalizeFirstLetter(segments[segments.length - 1] || "")}
        </h1>
        <nav aria-label="Actions">
          <ul className="flex gap-x-2 py-4">
            <li>
              <Button icon>
                <Icon src="QuestionMark" alt="More info" />
              </Button>
            </li>
            <li>
              <Button icon asChild>
                <Link href={move(-1)}>
                  <Icon
                    src="Arrow"
                    className="-rotate-90"
                    alt={mode === "year" ? "Previous year" : "Previous month"}
                  />
                </Link>
              </Button>
            </li>
            <li>
              <Button icon asChild>
                <Link href={move(1)}>
                  <Icon
                    src="Arrow"
                    className="rotate-90"
                    alt={mode === "year" ? "Next year" : "Next month"}
                  />
                </Link>
              </Button>
            </li>
            <li>
              <CalendarHeaderToggle date={date} mode={mode} />
            </li>
          </ul>
        </nav>
      </header>
    </Container>
  )
}
