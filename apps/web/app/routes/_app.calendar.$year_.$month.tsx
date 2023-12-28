import type { Dayjs } from "dayjs"
import dayjs from "dayjs"
import advancedFormat from "dayjs/plugin/advancedFormat"
import type { LoaderFunctionArgs, MetaFunction } from "@remix-run/node"
import { json, redirect } from "@remix-run/node"
import { useLoaderData } from "@remix-run/react"
import { useRef } from "react"
import {
  useScroll,
  motion,
  useMotionValueEvent,
  useMotionValue,
  animate,
} from "framer-motion"
import { calendarTabCookie } from "~/server/cookies.server"
import Container from "~/components/Container"
import { $path } from "remix-routes"
import CalendarHeader from "~/components/CalendarHeader"
import { months, unreachable } from "~/lib/utils"
import { z } from "zod"

dayjs.extend(advancedFormat)

export const meta: MetaFunction = () => [
  {
    title: "Calendar – Artists Together",
  },
]

export const handle = {
  actions: {
    prev: () => {
      console.log("previous month")
    },
    next: () => {
      console.log("next month")
    },
  },
  page: {
    name: "Calendar",
  },
}

const paramsSchema = z.object({
  year: z.coerce.number().min(1970),
  month: z.enum(months).transform((value) => months.indexOf(value)),
})

export async function loader({ params }: LoaderFunctionArgs) {
  const result = paramsSchema.safeParse(params)

  if (!result.success) {
    throw redirect("/404")
  }

  const date = dayjs()
    .set("year", result.data.year)
    .set("month", result.data.month)

  return json(
    {
      date: date.toISOString(),
    },
    {
      headers: {
        "Set-Cookie": await calendarTabCookie.serialize("days"),
      },
    },
  )
}

function Day({ date, index }: { date: Dayjs; index: number }) {
  const day = date.day(index).format("dddd Do")
  return (
    <div className=" font-serif font-light text-[2rem] leading-none">{day}</div>
  )
}

function Scrollbar() {
  const { scrollX } = useScroll()
  const x = useMotionValue(0)
  const ref = useRef<HTMLDivElement>(null)
  const init = useRef(false)

  useMotionValueEvent(scrollX, "change", (latest) => {
    if (init.current) {
      x.set(latest)
    } else {
      init.current = true
      animate(x, latest, {
        type: "spring",
        mass: 0.5,
      })
    }
  })

  return (
    <div>
      <Container grid asChild>
        <motion.div
          className="bg-theme-800 h-4"
          ref={ref}
          onTap={(event, info) => {
            if (!ref.current) return

            const rect = ref.current.getBoundingClientRect()

            console.log((info.point.x * 100) / (rect.x + rect.width))
          }}
        >
          <motion.div
            className="bg-theme-300 rounded-full h-full col-span-2"
            style={{ x }}
            drag="x"
            dragConstraints={ref}
            dragElastic={0.2}
            dragTransition={{
              bounceStiffness: 400,
              bounceDamping: 20,
            }}
            _dragX={x}
          />
        </motion.div>
      </Container>
    </div>
  )
}

export default function Page() {
  const data = useLoaderData<typeof loader>()
  const date = dayjs(data.date)

  function to(mode: "prev" | "next") {
    let targetDate: Dayjs | undefined

    switch (mode) {
      case "prev":
        targetDate = date.subtract(1, "month")
        break
      case "next":
        targetDate = date.add(1, "month")
        break
      default:
        unreachable(mode)
    }

    return $path("/calendar/:year/:month", {
      year: targetDate.year(),
      month: targetDate.format("MMMM").toLowerCase(),
    })
  }

  return (
    <>
      <CalendarHeader
        date={date}
        active="days"
        prev={to("prev")}
        next={to("next")}
        days={$path("/calendar/:year/:month", {
          year: dayjs().year(),
          month: dayjs().format("MMMM").toLowerCase(),
        })}
        months={$path("/calendar/:year", {
          year: date.year(),
        })}
      />
      <div>
        <Scrollbar />
      </div>
      <main className="flex gap-1 sm:fluid:gap-4">
        {Array(Math.round(date.daysInMonth() / 4))
          .fill(0)
          .map((_, index) => (
            <Container key={index} grid className="flex-none sm:-mr-4">
              <div className="col-span-2">
                <Day date={date} index={index * 4 + 1} />
              </div>
              <div className="col-span-2">
                <Day date={date} index={index * 4 + 2} />
              </div>
              <div className="col-span-2">
                <Day date={date} index={index * 4 + 3} />
              </div>
              <div className="col-span-2">
                <Day date={date} index={index * 4 + 4} />
              </div>
            </Container>
          ))}
      </main>
    </>
  )
}
