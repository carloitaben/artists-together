"use client"

import SplitType from "split-type"
import { animate, stagger } from "framer-motion"

import { useOnMatchScreen } from "~/hooks/media"

export default function Animations() {
  useOnMatchScreen("sm", () => {
    const logo = document.querySelector("[data-element='logo']")!

    animate(
      logo,
      {
        opacity: [0, 1],
        scale: [1.1, 1],
      },
      {
        duration: 0.5,
        ease: [0.68, -0.6, 0.32, 1.6],
      },
    )

    const targets = document.querySelectorAll<HTMLElement>(
      "[data-animated-text]",
    )!

    const visibleTargets = Array.from(targets).filter((target) => {
      return window.getComputedStyle(target).display !== "none"
    })

    visibleTargets.forEach((target, index) => {
      const split = new SplitType(target, {
        types: "lines,words",
        wordClass: "[text-decoration-line:inherit]",
      })

      target.classList.remove("js:invisible")

      if (!split.lines) {
        throw Error(`Could not generate any lines for target ${target}`)
      }

      if (!split.words) {
        throw Error(`Could not generate any words for target ${target}`)
      }

      animate(
        split.words,
        {
          y: ["50%", "0%"],
          scaleY: [1.5, 1],
          opacity: [0, 1],
        },
        {
          duration: 0.5,
          ease: [0.68, -0.6, 0.32, 1.6],
          delay: stagger(0.03, { startDelay: (index + 1) / 3 }),
          onComplete: split.revert,
        },
      )
    })
  })

  return null
}
