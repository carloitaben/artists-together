"use client"

import { preload } from "react-dom"

export default function Spritesheet() {
  preload(`/spritesheet.svg`, {
    as: "image",
  })

  return null
}
