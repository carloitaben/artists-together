import type { LinkComponent } from "@tanstack/react-router"
import { createLink } from "@tanstack/react-router"
import type { ComponentProps } from "react"
import { anchor } from "./Anchor"

type Props = ComponentProps<"a">

function NavLinkComponent(props: Props) {
  return (
    <a
      {...props}
      onClick={(event) => {
        props.onClick?.(event)
        if (event.currentTarget.ariaCurrent === "page") {
          event.preventDefault()
          anchor(event)
        }
      }}
    >
      {props.children}
    </a>
  )
}

export default createLink(NavLinkComponent) satisfies LinkComponent<
  typeof NavLinkComponent
>
