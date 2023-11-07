import type { Dayjs } from "dayjs"
import dayjs from "dayjs"
import advancedFormat from "dayjs/plugin/advancedFormat"
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
import { calendarTabCookie } from "~/services/cookies.server"
import Container from "~/components/Container"

dayjs.extend(advancedFormat)

export const handle = {
  actions: {},
  page: {
    name: "Calendar",
  },
}

export async function loader() {
  const today = dayjs().toISOString()

  return json(
    {
      today,
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
    <div className="fixed top-0 right-0 left-16">
      <Container grid asChild>
        <motion.div
          className="bg-theme-800 h-4 fixed top-0 right-0 left-16"
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
            dragTransition={{ bounceStiffness: 400, bounceDamping: 20 }}
            _dragX={x}
          />
        </motion.div>
      </Container>
    </div>
  )
}

export default function Page() {
  const data = useLoaderData<typeof loader>()
  const date = dayjs(data.today)

  return (
    <>
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
