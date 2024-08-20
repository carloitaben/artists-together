"use client"

import type { User } from "@artists-together/auth"
import type { ComponentProps, ComponentRef, ForwardedRef } from "react"
import { forwardRef } from "react"
import ModalContainer from "./ModalContainer"
import ModalTitle from "./ModalTitle"
import Switch from "../Form/Switch"
import Tooltip from "../Form/Tooltip"

type Props = ComponentProps<typeof ModalContainer> & {
  user: User
}

function AuthProfileAdvancedSettings(
  props: Props,
  ref: ForwardedRef<ComponentRef<typeof ModalContainer>>,
) {
  return (
    <ModalContainer {...props} ref={ref}>
      <ModalTitle>Advanced settings</ModalTitle>
      <form className="grid gap-2">
        <Switch>24-hour time format</Switch>
        <Switch>
          <Tooltip>
            Lorem ipsum dolor sit amet consectetur adipisicing elit. Minus,
            incidunt quaerat. Obcaecati sapiente delectus veritatis non
            reprehenderit dolore id libero a perspiciatis beatae nobis facere
            nisi, vitae, commodi unde ullam?
          </Tooltip>
          Share approximate location
        </Switch>
        <Switch>
          <Tooltip>
            Lorem ipsum dolor sit amet consectetur adipisicing elit. Minus,
            incidunt quaerat. Obcaecati sapiente delectus veritatis non
            reprehenderit dolore id libero a perspiciatis beatae nobis facere
            nisi, vitae, commodi unde ullam?
          </Tooltip>
          Share streaming status
        </Switch>
        <Switch>
          <Tooltip>
            Lorem ipsum dolor sit amet consectetur adipisicing elit. Minus,
            incidunt quaerat. Obcaecati sapiente delectus veritatis non
            reprehenderit dolore id libero a perspiciatis beatae nobis facere
            nisi, vitae, commodi unde ullam?
          </Tooltip>
          Share cursor location
        </Switch>
        <Switch>Temperature in Fahrenheit</Switch>
      </form>
    </ModalContainer>
  )
}

export default forwardRef(AuthProfileAdvancedSettings)
