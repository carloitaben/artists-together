import type { LinkComponent } from "@tanstack/react-router"
import { createLink } from "@tanstack/react-router"
import type { ComponentProps, ComponentRef, ForwardedRef } from "react"
import { forwardRef } from "react"
import { anchor } from "./Anchor"

type Props = ComponentProps<"a">

function NavLinkComponent(props: Props, ref: ForwardedRef<ComponentRef<"a">>) {
  return (
    <a
      ref={ref}
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

export default createLink(forwardRef(NavLinkComponent)) satisfies LinkComponent<
  typeof NavLinkComponent
>
