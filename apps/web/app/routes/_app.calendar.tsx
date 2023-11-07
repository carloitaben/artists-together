import type { MetaFunction } from "@remix-run/react"
import { Outlet, useLoaderData, useLocation, Link } from "@remix-run/react"
import { cx } from "cva"
import dayjs from "dayjs"
import type { ReactNode } from "react"
import { $path } from "remix-routes"
import Button from "~/components/Button"
import Icon from "~/components/Icon"
import { guardDisabledRoute } from "~/server/lib.server"

export const meta: MetaFunction = () => [
  {
    title: "Calendar – Artists Together",
  },
]

export const handle = {
  actions: {
    toggle: () => console.log("toggle"),
  },
  page: {
    name: "Calendar",
  },
}

export async function loader() {
  guardDisabledRoute()

  return {
    today: dayjs().toISOString(),
  }
}

function LinkPill({
  to,
  active,
  children,
}: {
  to: string
  active: boolean
  children: ReactNode
}) {
  return (
    <Link to={to}>
      <div
        className={cx(
          "rounded-full h-10 whitespace-nowrap flex items-center justify-center py-3 px-5",
          active ? "bg-theme-300" : "",
        )}
      >
        {children}
      </div>
    </Link>
  )
}

export default function Page() {
  const location = useLocation()
  const data = useLoaderData<typeof loader>()

  const date = dayjs(data.today)
  const page = location.pathname.split("/").length === 3 ? "months" : "days"

  return (
    <>
      <header className="flex items-center justify-between">
        <h2>{page}</h2>
        <nav className="flex items-center justify-end gap-2">
          <Button color="theme" asChild>
            <Link to="#">
              <Icon
                name="arrow"
                label="Previous"
                className="w-6 h-6 -rotate-90"
              />
            </Link>
          </Button>
          <Button color="theme" asChild>
            <Link to="#">
              <Icon name="arrow" label="Next" className="w-6 h-6 rotate-90" />
            </Link>
          </Button>
          <div className="rounded-full bg-theme-800 text-theme-900 h-12 flex p-1">
            <LinkPill
              active={page === "days"}
              to={$path("/calendar/:year/:month", {
                year: date.year(),
                month: date.month(),
              })}
            >
              Days
            </LinkPill>
            <LinkPill
              active={page === "months"}
              to={$path("/calendar/:year", {
                year: date.year(),
              })}
            >
              Months
            </LinkPill>
          </div>
        </nav>
      </header>
      <Outlet />
    </>
  )
}
