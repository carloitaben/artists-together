import { SegmentGroup } from "@ark-ui/react"
import type { Dayjs } from "dayjs"
import { motion } from "framer-motion"
import Link from "next/link"
import { startTransition, useOptimistic } from "react"
import { monthNumberSchema } from "~/lib/schemas"

type Props = {
  date: Dayjs
  mode: "year" | "month"
}

function Indicator() {
  return (
    <motion.span
      aria-hidden
      layoutId="calendar-indicator"
      className="pointer-events-none absolute inset-0 bg-gunpla-white-50"
      style={{ borderRadius: 9999 }}
      transition={{
        type: "spring",
        mass: 0.2,
        damping: 6,
      }}
    />
  )
}

export default function CalendarHeaderToggle({ date, mode }: Props) {
  const [optimisticMode, setOptimisticMode] = useOptimistic(mode)

  return (
    <SegmentGroup.Root
      value={optimisticMode}
      onValueChange={(event) =>
        startTransition(() => setOptimisticMode(event.value as typeof mode))
      }
      orientation="horizontal"
      className="grid h-12 grid-cols-2 rounded-full bg-arpeggio-black-800 p-1 text-arpeggio-black-900"
    >
      <SegmentGroup.Item asChild value="month">
        <Link
          className="relative grid place-items-center rounded-full px-5 text-center"
          href={`/calendar/${date.get("year")}/${monthNumberSchema.parse(date.get("month") + 1)}`}
        >
          <SegmentGroup.Context>
            {(context) => (context.value === "month" ? <Indicator /> : null)}
          </SegmentGroup.Context>
          <span className="relative z-10">
            <SegmentGroup.ItemText>Days</SegmentGroup.ItemText>
            <SegmentGroup.ItemControl />
            <SegmentGroup.ItemHiddenInput />
          </span>
        </Link>
      </SegmentGroup.Item>
      <SegmentGroup.Item asChild value="year">
        <Link
          className="relative grid place-items-center rounded-full px-5 text-center"
          href={`/calendar/${date.get("year")}`}
        >
          <SegmentGroup.Context>
            {(context) => (context.value === "year" ? <Indicator /> : null)}
          </SegmentGroup.Context>
          <span className="relative z-10">
            <SegmentGroup.ItemText>Months</SegmentGroup.ItemText>
            <SegmentGroup.ItemControl />
            <SegmentGroup.ItemHiddenInput />
          </span>
        </Link>
      </SegmentGroup.Item>
    </SegmentGroup.Root>
  )
}
