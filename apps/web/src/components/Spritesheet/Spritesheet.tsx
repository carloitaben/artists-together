"use client"

import { preload } from "react-dom"

// import "server-only"
// import spritesheet from "./spritesheet.svg"

export default function Spritesheet() {
  preload("/spritesheet.svg", {
    as: "image",
  })

  // return (
  // <svg
  //   xmlns="http://www.w3.org/2000/svg"
  //   xmlnsXlink="http://www.w3.org/1999/xlink"
  //   width="0"
  //   height="0"
  //   className="sr-only"
  //   dangerouslySetInnerHTML={{ __html: spritesheet }}
  // />
  // )

  return null
}
