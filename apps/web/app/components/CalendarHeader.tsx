import { Link } from "@remix-run/react"
import type { Dayjs } from "dayjs"
import { useHints } from "~/hooks/loaders"
import Button from "./Button"
import Icon from "./Icon"

type Props = {
  prev: string | number
  next: string | number
  date: Dayjs
  days: string | number
  months: string | number
  active: "days" | "months"
}

function coerce(value: string | number) {
  return typeof value === "number" ? value.toString() : value
}

export default function CalendarHeader({
  prev,
  next,
  date,
  days,
  months,
  active,
}: Props) {
  const hints = useHints()

  return (
    <header className="flex items-center justify-between">
      <h2 className="font-serif font-light text-[4rem]">
        {date.format(active === "days" ? "MMMM" : "YYYY")}
      </h2>
      <nav className="flex items-center justify-end gap-2">
        <Button color="theme" asChild>
          <Link to={coerce(prev)} prefetch={hints.saveData ? "none" : "intent"}>
            <Icon
              name="arrow"
              alt="Previous year"
              className="w-6 h-6 -rotate-90"
            />
          </Link>
        </Button>
        <Button color="theme" asChild>
          <Link to={coerce(next)} prefetch={hints.saveData ? "none" : "intent"}>
            <Icon name="arrow" alt="Next year" className="w-6 h-6 rotate-90" />
          </Link>
        </Button>
        <div className="rounded-full bg-theme-800 text-theme-900 h-12 flex p-1">
          <Link
            to={coerce(days)}
            prefetch={hints.saveData ? "none" : "intent"}
            className="group"
            aria-current={active === "days" ? "page" : undefined}
          >
            <div className="rounded-full h-10 whitespace-nowrap flex items-center justify-center py-3 px-5 group-aria-[current=page]:bg-theme-300">
              days
            </div>
          </Link>
          <Link
            to={coerce(months)}
            prefetch={hints.saveData ? "none" : "intent"}
            className="group"
            aria-current={active === "months" ? "page" : undefined}
          >
            <div className="rounded-full h-10 whitespace-nowrap flex items-center justify-center py-3 px-5 group-aria-[current=page]:bg-theme-300">
              Months
            </div>
          </Link>
        </div>
      </nav>
    </header>
  )
}
