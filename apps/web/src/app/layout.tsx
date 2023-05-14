import { ReactNode } from "react"

import "./globals.css"

export const metadata = {
  title: "Create Next App",
  description: "Generated by create next app",
}

type Props = {
  children: ReactNode
}

export default function Layout({ children }: Props) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}
