import type { Dayjs } from "dayjs"
import dayjs from "dayjs"
import advancedFormat from "dayjs/plugin/advancedFormat"
import type { LoaderFunctionArgs, MetaFunction } from "@remix-run/node"
import { json } from "@remix-run/node"
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
import { $params, $path } from "remix-routes"
import CalendarHeader from "~/components/CalendarHeader"

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

export async function loader({ params }: LoaderFunctionArgs) {
  const { year, month } = $params("/calendar/:year/:month", params)

  const date = dayjs()
    .set("year", parseInt(year))
    .set("month", parseInt(month) - 1)

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

  return (
    <>
      <CalendarHeader
        date={date}
        active="days"
        prev={date.subtract(1, "month").month() + 1}
        next={date.add(1, "month").month() + 1}
        days={dayjs().month() + 1}
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
