import type { Metadata } from "next"
import type { PropsWithChildren } from "react"
import CalendarHeader from "../components/CalendarHeader"

export const metadata: Metadata = {
  title: "Calendar",
  robots: {
    index: false,
    follow: false,
  },
}

export default function Layout({ children }: PropsWithChildren) {
  return (
    <>
      <CalendarHeader />
      {children}
    </>
  )
}
