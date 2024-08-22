import type { ReactNode } from "react"
import type { Metadata } from "next"
import CalendarHeader from "./components/CalendarHeader"

export const metadata: Metadata = {
  title: "Calendar",
}

type Props = {
  children: ReactNode
}

export default function Template({ children }: Props) {
  const date = new Date()

  return (
    <>
      <CalendarHeader date={date} />
      {children}
    </>
  )
}
