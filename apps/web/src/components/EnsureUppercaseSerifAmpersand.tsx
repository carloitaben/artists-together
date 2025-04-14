"use client"

import { usePathname } from "next/navigation"
import { useEffect } from "react"

export default function EnsureUppercaseSerifAmpersand() {
  const pathname = usePathname()

  useEffect(() => {
    document.querySelectorAll(".font-fraunces").forEach((element) => {
      if (!element.textContent?.includes("&")) return
      if (!element.querySelector(".font-fraunces-ampersand")) {
        console.error(
          `Found Fraunces ampersand without ".font-fraunces-ampersand" class on path "${pathname}".` +
            "\n" +
            "Check the following element:" +
            element,
        )
      }
    })
  }, [pathname])

  return null
}
