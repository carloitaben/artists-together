import { ReactNode } from "react"

import Navbar from "~/components/Navbar"

import "./globals.css"

type Props = {
  children: ReactNode
}

export default function Layout({ children }: Props) {
  return (
    <html lang="en" className="h-full">
      <body className="min-h-full h-full pl-16">
        <Navbar />
        {children}
      </body>
    </html>
  )
}
